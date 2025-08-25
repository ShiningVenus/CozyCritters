/**
 * Enhanced Admin Dashboard Component
 * Comprehensive administrative interface with modular functionality
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Activity, 
  Settings, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Download,
  Trash2,
  UserPlus,
  Ban,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Lock,
  Unlock
} from 'lucide-react';

import { UserRole } from '../../../shared/schema';
import { hasPermission, getPermissionsForRole, PERMISSIONS } from '../lib/admin-permissions';
import { 
  getAuditLogs, 
  getAuditSummary, 
  getFilteredAuditLogs, 
  exportAuditLogs,
  clearAuditLogs,
  formatAuditTimestamp,
  getActionDescription,
  type AuditLogEntry,
  type AuditActionType
} from '../lib/admin-audit';
import { 
  getAllUsers, 
  getUserStats, 
  banUser, 
  unbanUser, 
  updateUserRole,
  type UserInfo 
} from '../lib/admin-users';
import { listAdminAccounts } from '../lib/admin-accounts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  currentRole: UserRole;
}

type DashboardTab = 'overview' | 'users' | 'audit' | 'permissions' | 'settings';

export function AdminDashboard({ isOpen, onClose, currentUser, currentRole }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Overview data
  const [stats, setStats] = useState<any>(null);
  const [auditSummary, setAuditSummary] = useState<any>(null);
  
  // Users data
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'banned' | 'admin' | 'moderator'>('all');
  
  // Audit data
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditFilter, setAuditFilter] = useState<{
    actionType?: AuditActionType;
    result?: 'success' | 'failure' | 'partial';
    startDate?: number;
    endDate?: number;
  }>({});
  
  // Permissions data
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  
  // User management
  const [showBanDialog, setShowBanDialog] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<'permanent' | '1day' | '7days' | '30days'>('permanent');
  const [showRoleDialog, setShowRoleDialog] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [adminPassword, setAdminPassword] = useState('');

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check permissions first
      const hasOverview = hasPermission(currentUser, 'VIEW_ADMIN_PANEL', currentRole);
      if (!hasOverview.hasPermission) {
        throw new Error('Access denied to admin dashboard');
      }

      // Load overview data
      if (activeTab === 'overview') {
        const userStats = getUserStats(currentUser, currentRole);
        setStats(userStats);
        
        const summary = getAuditSummary({
          start: Date.now() - 30 * 24 * 60 * 60 * 1000, // Last 30 days
          end: Date.now()
        });
        setAuditSummary(summary);
      }
      
      // Load users data
      if (activeTab === 'users') {
        const allUsers = getAllUsers(currentUser, currentRole);
        setUsers(allUsers);
      }
      
      // Load audit data
      if (activeTab === 'audit') {
        const logs = getFilteredAuditLogs({
          limit: 100,
          ...auditFilter
        });
        setAuditLogs(logs);
      }
      
      // Load permissions data
      if (activeTab === 'permissions') {
        const permissions = getPermissionsForRole(currentRole);
        setUserPermissions(permissions);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (username: string) => {
    try {
      const duration = banDuration === 'permanent' ? undefined : 
        banDuration === '1day' ? 24 * 60 * 60 * 1000 :
        banDuration === '7days' ? 7 * 24 * 60 * 60 * 1000 :
        30 * 24 * 60 * 60 * 1000;
      
      const success = banUser(username, {
        reason: banReason,
        duration,
        moderatorUsername: currentUser,
        moderatorRole: currentRole
      });
      
      if (success) {
        setShowBanDialog(null);
        setBanReason('');
        loadDashboardData();
      } else {
        setError('Failed to ban user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (username: string) => {
    try {
      const success = unbanUser(username, currentUser, currentRole);
      if (success) {
        loadDashboardData();
      } else {
        setError('Failed to unban user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unban user');
    }
  };

  const handleChangeRole = async (username: string) => {
    try {
      const success = await updateUserRole(username, newRole, currentUser, adminPassword);
      if (success) {
        setShowRoleDialog(null);
        setAdminPassword('');
        loadDashboardData();
      } else {
        setError('Failed to change user role');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change user role');
    }
  };

  const handleExportAuditLogs = () => {
    try {
      const exportData = exportAuditLogs(currentUser, currentRole);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export audit logs');
    }
  };

  const filteredUsers = users.filter(user => {
    if (userSearchTerm && !user.username.toLowerCase().includes(userSearchTerm.toLowerCase())) {
      return false;
    }
    
    switch (userFilter) {
      case 'active': return user.status === 'active';
      case 'banned': return user.status === 'banned';
      case 'admin': return user.role === 'admin';
      case 'moderator': return user.role === 'moderator';
      default: return true;
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              {currentRole.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b bg-gray-50">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'audit', label: 'Audit Log', icon: FileText },
            { id: 'permissions', label: 'Permissions', icon: Lock },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {activeTab === 'overview' && (
                <OverviewTab stats={stats} auditSummary={auditSummary} />
              )}
              
              {activeTab === 'users' && (
                <UsersTab 
                  users={filteredUsers}
                  searchTerm={userSearchTerm}
                  setSearchTerm={setUserSearchTerm}
                  filter={userFilter}
                  setFilter={setUserFilter}
                  onBanUser={setShowBanDialog}
                  onUnbanUser={handleUnbanUser}
                  onChangeRole={setShowRoleDialog}
                  currentRole={currentRole}
                />
              )}
              
              {activeTab === 'audit' && (
                <AuditTab 
                  logs={auditLogs}
                  searchTerm={auditSearchTerm}
                  setSearchTerm={setAuditSearchTerm}
                  filter={auditFilter}
                  setFilter={setAuditFilter}
                  onExport={handleExportAuditLogs}
                  onRefresh={loadDashboardData}
                  currentRole={currentRole}
                />
              )}
              
              {activeTab === 'permissions' && (
                <PermissionsTab permissions={userPermissions} currentRole={currentRole} />
              )}
              
              {activeTab === 'settings' && (
                <SettingsTab currentUser={currentUser} currentRole={currentRole} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ban User Dialog */}
      {showBanDialog && (
        <BanUserDialog
          username={showBanDialog}
          reason={banReason}
          setReason={setBanReason}
          duration={banDuration}
          setDuration={setBanDuration}
          onConfirm={() => handleBanUser(showBanDialog)}
          onCancel={() => setShowBanDialog(null)}
        />
      )}

      {/* Change Role Dialog */}
      {showRoleDialog && (
        <ChangeRoleDialog
          username={showRoleDialog}
          newRole={newRole}
          setNewRole={setNewRole}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          onConfirm={() => handleChangeRole(showRoleDialog)}
          onCancel={() => setShowRoleDialog(null)}
        />
      )}
    </div>
  );
}

// Individual tab components would be implemented here...
// For brevity, I'll include just the structure

function OverviewTab({ stats, auditSummary }: any) {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">System Overview</h3>
      {/* Stats cards, charts, recent activity */}
    </div>
  );
}

function UsersTab({ users, searchTerm, setSearchTerm, filter, setFilter, onBanUser, onUnbanUser, onChangeRole, currentRole }: any) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="admin">Admins</option>
          <option value="moderator">Moderators</option>
        </select>
      </div>
      {/* User list with actions */}
    </div>
  );
}

function AuditTab({ logs, searchTerm, setSearchTerm, filter, setFilter, onExport, onRefresh, currentRole }: any) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Audit Log</h3>
        <div className="flex gap-2">
          <button onClick={onExport} className="btn-secondary">
            <Download size={16} />
            Export
          </button>
          <button onClick={onRefresh} className="btn-primary">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
      {/* Audit log table */}
    </div>
  );
}

function PermissionsTab({ permissions, currentRole }: any) {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Your Permissions ({currentRole})</h3>
      {/* Permissions list */}
    </div>
  );
}

function SettingsTab({ currentUser, currentRole }: any) {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Settings</h3>
      {/* Various admin settings */}
    </div>
  );
}

function BanUserDialog({ username, reason, setReason, duration, setDuration, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Ban User: {username}</h3>
        {/* Ban form */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Ban User</button>
        </div>
      </div>
    </div>
  );
}

function ChangeRoleDialog({ username, newRole, setNewRole, adminPassword, setAdminPassword, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Change Role: {username}</h3>
        {/* Role change form */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-primary">Change Role</button>
        </div>
      </div>
    </div>
  );
}