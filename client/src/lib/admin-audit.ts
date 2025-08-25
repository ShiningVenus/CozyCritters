/**
 * Audit logging system for admin and moderator actions
 * Tracks all administrative activities for security and accountability
 */

import { UserRole } from '../../../shared/schema';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  actor: {
    username: string;
    role: UserRole;
    ip?: string; // Not implemented in client-only app, but reserved for future
  };
  action: {
    type: AuditActionType;
    resource: string;
    resourceId?: string;
    details: Record<string, any>;
  };
  result: 'success' | 'failure' | 'partial';
  errorMessage?: string;
  sessionId?: string;
}

export type AuditActionType = 
  // User Management
  | 'user_created'
  | 'user_deleted'
  | 'user_role_changed'
  | 'user_banned'
  | 'user_unbanned'
  | 'password_changed'
  
  // Content Moderation
  | 'post_hidden'
  | 'post_unhidden'
  | 'post_edited'
  | 'post_deleted'
  | 'topic_pinned'
  | 'topic_unpinned'
  | 'topic_locked'
  | 'topic_unlocked'
  | 'topic_deleted'
  
  // Forum Management
  | 'forum_created'
  | 'forum_deleted'
  | 'forum_settings_changed'
  
  // System Administration
  | 'admin_login'
  | 'admin_logout'
  | 'system_settings_changed'
  | 'audit_log_viewed'
  | 'backup_created'
  | 'data_exported';

const AUDIT_LOG_KEY = 'cozy-critter-audit-log';
const MAX_LOG_ENTRIES = 1000; // Keep last 1000 entries

/**
 * Log an administrative action
 */
export function logAuditEvent(
  actor: string,
  actorRole: UserRole,
  actionType: AuditActionType,
  resource: string,
  details: Record<string, any> = {},
  result: 'success' | 'failure' | 'partial' = 'success',
  resourceId?: string,
  errorMessage?: string
): void {
  try {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      actor: {
        username: actor,
        role: actorRole
      },
      action: {
        type: actionType,
        resource,
        resourceId,
        details
      },
      result,
      errorMessage,
      sessionId: getCurrentSessionId()
    };

    const existingLogs = getAuditLogs();
    
    // Add new entry at the beginning
    existingLogs.unshift(entry);
    
    // Keep only the last MAX_LOG_ENTRIES
    if (existingLogs.length > MAX_LOG_ENTRIES) {
      existingLogs.splice(MAX_LOG_ENTRIES);
    }
    
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(existingLogs));
    
    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('[AUDIT]', {
        actor: `${actor} (${actorRole})`,
        action: actionType,
        resource,
        result,
        details
      });
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Get all audit log entries
 */
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const logs = localStorage.getItem(AUDIT_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Failed to load audit logs:', error);
    return [];
  }
}

/**
 * Get audit logs filtered by criteria
 */
export function getFilteredAuditLogs(filters: {
  actor?: string;
  actionType?: AuditActionType;
  resource?: string;
  startDate?: number;
  endDate?: number;
  result?: 'success' | 'failure' | 'partial';
  limit?: number;
}): AuditLogEntry[] {
  let logs = getAuditLogs();
  
  // Apply filters
  if (filters.actor) {
    logs = logs.filter(log => log.actor.username.includes(filters.actor!));
  }
  
  if (filters.actionType) {
    logs = logs.filter(log => log.action.type === filters.actionType);
  }
  
  if (filters.resource) {
    logs = logs.filter(log => log.action.resource.includes(filters.resource!));
  }
  
  if (filters.startDate) {
    logs = logs.filter(log => log.timestamp >= filters.startDate!);
  }
  
  if (filters.endDate) {
    logs = logs.filter(log => log.timestamp <= filters.endDate!);
  }
  
  if (filters.result) {
    logs = logs.filter(log => log.result === filters.result);
  }
  
  // Apply limit
  if (filters.limit && filters.limit > 0) {
    logs = logs.slice(0, filters.limit);
  }
  
  return logs;
}

/**
 * Get audit summary statistics
 */
export function getAuditSummary(timeRange?: { start: number; end: number }): {
  totalActions: number;
  actionsByType: Record<AuditActionType, number>;
  actionsByActor: Record<string, number>;
  successRate: number;
  recentActions: AuditLogEntry[];
} {
  let logs = getAuditLogs();
  
  // Filter by time range if provided
  if (timeRange) {
    logs = logs.filter(log => 
      log.timestamp >= timeRange.start && log.timestamp <= timeRange.end
    );
  }
  
  const actionsByType: Record<AuditActionType, number> = {} as any;
  const actionsByActor: Record<string, number> = {};
  let successCount = 0;
  
  for (const log of logs) {
    // Count by type
    actionsByType[log.action.type] = (actionsByType[log.action.type] || 0) + 1;
    
    // Count by actor
    actionsByActor[log.actor.username] = (actionsByActor[log.actor.username] || 0) + 1;
    
    // Count successes
    if (log.result === 'success') {
      successCount++;
    }
  }
  
  return {
    totalActions: logs.length,
    actionsByType,
    actionsByActor,
    successRate: logs.length > 0 ? (successCount / logs.length) * 100 : 0,
    recentActions: logs.slice(0, 10)
  };
}

/**
 * Clear audit logs (admin only operation)
 */
export function clearAuditLogs(actor: string, actorRole: UserRole): boolean {
  if (actorRole !== 'admin') {
    logAuditEvent(
      actor,
      actorRole,
      'audit_log_viewed',
      'audit_logs',
      { action: 'clear_attempted' },
      'failure',
      undefined,
      'Insufficient permissions'
    );
    return false;
  }
  
  try {
    const logsBeforeClearing = getAuditLogs().length;
    
    // Log the clearing action before actually clearing
    logAuditEvent(
      actor,
      actorRole,
      'audit_log_viewed',
      'audit_logs',
      { 
        action: 'cleared',
        entriesCleared: logsBeforeClearing
      }
    );
    
    // Clear logs but keep the clearing action
    const clearingEntry = getAuditLogs()[0]; // Get the clearing entry we just added
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify([clearingEntry]));
    
    return true;
  } catch (error) {
    console.error('Failed to clear audit logs:', error);
    return false;
  }
}

/**
 * Export audit logs as JSON
 */
export function exportAuditLogs(actor: string, actorRole: UserRole): string {
  logAuditEvent(
    actor,
    actorRole,
    'data_exported',
    'audit_logs',
    { format: 'json' }
  );
  
  const logs = getAuditLogs();
  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: actor,
    totalEntries: logs.length,
    logs
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Get current session ID (simplified for client-only app)
 */
function getCurrentSessionId(): string {
  let sessionId = sessionStorage.getItem('cozy-critter-session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('cozy-critter-session-id', sessionId);
  }
  return sessionId;
}

/**
 * Format timestamp for display
 */
export function formatAuditTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Get human-readable action description
 */
export function getActionDescription(actionType: AuditActionType): string {
  const descriptions: Record<AuditActionType, string> = {
    // User Management
    user_created: 'User account created',
    user_deleted: 'User account deleted',
    user_role_changed: 'User role changed',
    user_banned: 'User banned',
    user_unbanned: 'User unbanned',
    password_changed: 'Password changed',
    
    // Content Moderation
    post_hidden: 'Post hidden',
    post_unhidden: 'Post made visible',
    post_edited: 'Post content edited',
    post_deleted: 'Post deleted',
    topic_pinned: 'Topic pinned',
    topic_unpinned: 'Topic unpinned',
    topic_locked: 'Topic locked',
    topic_unlocked: 'Topic unlocked',
    topic_deleted: 'Topic deleted',
    
    // Forum Management
    forum_created: 'Forum category created',
    forum_deleted: 'Forum category deleted',
    forum_settings_changed: 'Forum settings modified',
    
    // System Administration
    admin_login: 'Administrator logged in',
    admin_logout: 'Administrator logged out',
    system_settings_changed: 'System settings changed',
    audit_log_viewed: 'Audit log accessed',
    backup_created: 'System backup created',
    data_exported: 'Data exported'
  };
  
  return descriptions[actionType] || 'Unknown action';
}