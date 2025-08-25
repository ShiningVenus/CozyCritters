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

interface ModerationPanelProps {
  userRole: 'user' | 'moderator' | 'admin';
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
    const action: ModerationAction = {
      id: crypto.randomUUID(),
      type,
      moderatorId: 'current-user', // In real app, this would be the actual user ID
      moderatorName: 'Current Moderator', // In real app, this would be the actual moderator name
      reason,
      timestamp: Date.now(),
      originalContent
    };

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
              <div className="text-center py-8 text-gray-500">
                User management features coming soon...
                <br />
                <span className="text-sm">This would include user role management, bans, warnings, etc.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}