import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Pin, 
  Edit3, 
  Trash2, 
  Flag, 
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  Search,
  Filter,
  X
} from 'lucide-react';
import { ModerationAction, ForumPostModeration, ForumReplyModeration } from '../../../shared/schema';
import { hasPermission } from '../lib/admin-permissions';
import { logAuditEvent } from '../lib/admin-audit';

interface ModerationPanelProps {
  userRole: 'user' | 'moderator' | 'admin';
  username: string; // Add username for permission checking
  onModerationAction: (action: ModerationAction, targetId: string, targetType: 'post' | 'topic') => void;
  posts: any[];
  topics: any[];
  onClose: () => void;
}

interface ModerationReport {
  id: string;
  targetId: string;
  targetType: 'post' | 'topic';
  reason: string;
  reporterId: string;
  timestamp: number;
  status: 'pending' | 'resolved' | 'dismissed';
}

export function ForumModerationPanel({ 
  userRole, 
  username,
  onModerationAction, 
  posts, 
  topics, 
  onClose 
}: ModerationPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'reports' | 'actions' | 'users'>('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'topics'>('all');
  const [moderationHistory, setModerationHistory] = useState<ModerationAction[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);

  useEffect(() => {
    // Load moderation history from localStorage
    const savedHistory = localStorage.getItem('cozy-critter-moderation-history');
    if (savedHistory) {
      setModerationHistory(JSON.parse(savedHistory));
    }

    // Load pending reports
    const savedReports = localStorage.getItem('cozy-critter-moderation-reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const handleModerationAction = (
    type: 'hide' | 'pin' | 'edit' | 'warn' | 'delete',
    targetId: string,
    targetType: 'post' | 'topic',
    reason?: string,
    originalContent?: string
  ) => {
    // Check permissions before performing action
    const permissionKey = targetType === 'post' ? 'MODERATE_POSTS' : 'MODERATE_TOPICS';
    const permissionCheck = hasPermission(username, permissionKey, userRole);
    
    if (!permissionCheck.hasPermission) {
      console.error('Access denied:', permissionCheck.reason);
      return;
    }

    const action: ModerationAction = {
      id: crypto.randomUUID(),
      type,
      moderatorId: username,
      moderatorName: username,
      reason,
      timestamp: Date.now(),
      originalContent
    };

    // Log the moderation action
    const auditActionType = type === 'hide' ? (targetType === 'post' ? 'post_hidden' : 'topic_locked') :
                           type === 'pin' ? 'topic_pinned' :
                           type === 'edit' ? (targetType === 'post' ? 'post_edited' : 'topic_locked') :
                           type === 'delete' ? (targetType === 'post' ? 'post_deleted' : 'topic_deleted') :
                           'post_edited';
    
    logAuditEvent(
      username,
      userRole,
      auditActionType as any,
      targetType,
      {
        targetId,
        action: type,
        reason: reason || 'No reason provided'
      },
      'success',
      targetId
    );

    // Save to moderation history
    const updatedHistory = [action, ...moderationHistory];
    setModerationHistory(updatedHistory);
    localStorage.setItem('cozy-critter-moderation-history', JSON.stringify(updatedHistory));

    // Call parent callback
    onModerationAction(action, targetId, targetType);
  };

  const handleReportResolve = (reportId: string, action: 'resolved' | 'dismissed') => {
    const updatedReports = reports.map(report => 
      report.id === reportId ? { ...report, status: action } : report
    );
    setReports(updatedReports);
    localStorage.setItem('cozy-critter-moderation-reports', JSON.stringify(updatedReports));
  };

  const filteredContent = () => {
    let content: any[] = [];
    
    if (filterType === 'all' || filterType === 'posts') {
      content = [...content, ...posts.map(p => ({ ...p, type: 'post' }))];
    }
    if (filterType === 'all' || filterType === 'topics') {
      content = [...content, ...topics.map(t => ({ ...t, type: 'topic' }))];
    }

    if (searchTerm) {
      content = content.filter(item => 
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return content.sort((a, b) => b.timestamp - a.timestamp);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (userRole === 'user') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-bold mb-4 text-red-600">Access Denied</h3>
          <p className="mb-4">You don't have permission to access the moderation panel.</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold">Moderation Panel</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {userRole === 'admin' ? 'Administrator' : 'Moderator'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['content', 'reports', 'actions', userRole === 'admin' ? 'users' : null].filter(Boolean).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 border-b-2 font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'content' && 'Content Management'}
              {tab === 'reports' && (
                <span className="flex items-center gap-2">
                  Reports
                  {pendingReports.length > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {pendingReports.length}
                    </span>
                  )}
                </span>
              )}
              {tab === 'actions' && 'Action History'}
              {tab === 'users' && 'User Management'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'content' && (
            <div className="h-full flex flex-col">
              {/* Search and Filter */}
              <div className="p-4 border-b flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Content</option>
                  <option value="posts">Posts Only</option>
                  <option value="topics">Topics Only</option>
                </select>
              </div>

              {/* Content List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {filteredContent().map(item => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {item.type === 'topic' ? (
                              <MessageSquare size={16} className="text-blue-600" />
                            ) : (
                              <MessageSquare size={16} className="text-green-600" />
                            )}
                            <span className="font-medium">
                              {item.type === 'topic' ? item.title : 'Post Reply'}
                            </span>
                            <span className="text-sm text-gray-500">
                              by {item.author} • {formatTimestamp(item.timestamp)}
                            </span>
                            {item.moderation?.isHidden && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                Hidden
                              </span>
                            )}
                            {item.moderation?.isPinned && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                Pinned
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3 line-clamp-3">
                            {item.content}
                          </p>
                        </div>
                        
                        {/* Moderation Actions */}
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleModerationAction(
                              item.moderation?.isHidden ? 'hide' : 'hide',
                              item.id,
                              item.type,
                              item.moderation?.isHidden ? 'Unhidden content' : 'Hidden inappropriate content'
                            )}
                            className={`p-2 rounded text-xs ${
                              item.moderation?.isHidden
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                            title={item.moderation?.isHidden ? 'Unhide' : 'Hide'}
                          >
                            {item.moderation?.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          
                          {item.type === 'topic' && (
                            <button
                              onClick={() => handleModerationAction(
                                'pin',
                                item.id,
                                'topic',
                                item.moderation?.isPinned ? 'Unpinned topic' : 'Pinned important topic'
                              )}
                              className={`p-2 rounded text-xs ${
                                item.moderation?.isPinned
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              title={item.moderation?.isPinned ? 'Unpin' : 'Pin'}
                            >
                              <Pin size={14} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleModerationAction('edit', item.id, item.type, 'Content edited by moderator', item.content)}
                            className="p-2 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          
                          <button
                            onClick={() => handleModerationAction('warn', item.id, item.type, 'User warned for inappropriate content')}
                            className="p-2 rounded text-xs bg-orange-100 text-orange-700 hover:bg-orange-200"
                            title="Warn User"
                          >
                            <AlertTriangle size={14} />
                          </button>
                          
                          {userRole === 'admin' && (
                            <button
                              onClick={() => handleModerationAction('delete', item.id, item.type, 'Content deleted by administrator')}
                              className="p-2 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-4">
                {pendingReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending reports
                  </div>
                ) : (
                  pendingReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Flag className="text-red-600" size={16} />
                            <span className="font-medium">
                              {report.targetType} Report
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimestamp(report.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">
                            <strong>Reason:</strong> {report.reason}
                          </p>
                          <p className="text-sm text-gray-600">
                            Reported by user #{report.reporterId}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleReportResolve(report.id, 'resolved')}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleReportResolve(report.id, 'dismissed')}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-4">
                {moderationHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No moderation actions yet
                  </div>
                ) : (
                  moderationHistory.map(action => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-gray-500" size={16} />
                        <span className="font-medium capitalize">{action.type}</span>
                        <span className="text-sm text-gray-500">
                          by {action.moderatorName} • {formatTimestamp(action.timestamp)}
                        </span>
                      </div>
                      {action.reason && (
                        <p className="text-gray-700 mb-2">
                          <strong>Reason:</strong> {action.reason}
                        </p>
                      )}
                      {action.originalContent && (
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <strong>Original content:</strong> {action.originalContent}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && userRole === 'admin' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">User Management</h3>
                  
                  {/* User Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <User className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm text-blue-600">Total Users</p>
                          <p className="text-xl font-bold text-blue-800">24</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="text-green-600" size={20} />
                        <div>
                          <p className="text-sm text-green-600">Active Moderators</p>
                          <p className="text-xl font-bold text-green-800">3</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="text-yellow-600" size={20} />
                        <div>
                          <p className="text-sm text-yellow-600">Online Today</p>
                          <p className="text-xl font-bold text-yellow-800">12</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Send Announcement
                      </button>
                      <button className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        Backup User Data
                      </button>
                      <button className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                        View Reports
                      </button>
                      <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                        Manage Roles
                      </button>
                    </div>
                  </div>

                  {/* Recent User Activity */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent User Activity</h4>
                    <div className="space-y-3">
                      {[
                        { user: 'Gentle Fox', action: 'Created new topic', time: '5 minutes ago', type: 'post' },
                        { user: 'Wise Owl', action: 'Replied to discussion', time: '12 minutes ago', type: 'reply' },
                        { user: 'Brave Rabbit', action: 'Registered account', time: '1 hour ago', type: 'join' },
                        { user: 'Calm Bear', action: 'Updated profile', time: '2 hours ago', type: 'profile' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border rounded">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'post' ? 'bg-blue-500' :
                              activity.type === 'reply' ? 'bg-green-500' :
                              activity.type === 'join' ? 'bg-purple-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <p className="font-medium">{activity.user}</p>
                              <p className="text-sm text-gray-600">{activity.action}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}