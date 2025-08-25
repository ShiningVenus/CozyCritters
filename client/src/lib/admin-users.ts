/**
 * Enhanced user management module for admin/moderator operations
 * Provides comprehensive user administration capabilities
 */

import { UserRole, UserSession } from '../../../shared/schema';
import { 
  createAdminAccount, 
  deleteAdminAccount, 
  listAdminAccounts, 
  changeAdminPassword,
  verifyAdminCredentials 
} from './admin-accounts';
import { hasPermission, requirePermission } from './admin-permissions';
import { logAuditEvent } from './admin-audit';

export interface UserInfo {
  username: string;
  role: UserRole;
  isRegistered: boolean;
  joinDate: number;
  lastActive: number;
  postCount: number;
  status: 'active' | 'banned' | 'suspended';
  banInfo?: {
    reason: string;
    bannedBy: string;
    bannedAt: number;
    expiresAt?: number; // undefined for permanent bans
  };
}

export interface BanUserOptions {
  reason: string;
  duration?: number; // in milliseconds, undefined for permanent
  moderatorUsername: string;
  moderatorRole: UserRole;
}

const USER_INFO_KEY = 'cozy-critter-user-info';
const BANNED_USERS_KEY = 'cozy-critter-banned-users';

/**
 * Get comprehensive user information
 */
export function getUserInfo(username: string): UserInfo | null {
  try {
    const userInfoData = localStorage.getItem(USER_INFO_KEY);
    const userInfoMap: Record<string, UserInfo> = userInfoData ? JSON.parse(userInfoData) : {};
    
    // If user info doesn't exist, try to create it from available data
    if (!userInfoMap[username]) {
      const createdInfo = createUserInfoFromSession(username);
      if (createdInfo) {
        userInfoMap[username] = createdInfo;
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfoMap));
        return createdInfo;
      }
      return null;
    }
    
    return userInfoMap[username];
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
}

/**
 * Get all registered users (admin/moderator only)
 */
export function getAllUsers(requestingUser: string, requestingRole: UserRole): UserInfo[] {
  requirePermission(requestingUser, 'VIEW_USER_LIST', requestingRole);
  
  try {
    const userInfoData = localStorage.getItem(USER_INFO_KEY);
    const userInfoMap: Record<string, UserInfo> = userInfoData ? JSON.parse(userInfoData) : {};
    
    logAuditEvent(
      requestingUser,
      requestingRole,
      'audit_log_viewed',
      'user_list',
      { totalUsers: Object.keys(userInfoMap).length }
    );
    
    return Object.values(userInfoMap);
  } catch (error) {
    console.error('Failed to get all users:', error);
    return [];
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  targetUsername: string,
  newRole: UserRole,
  adminUsername: string,
  adminPassword: string
): Promise<boolean> {
  try {
    // Verify admin credentials
    const adminRole = await verifyAdminCredentials(adminUsername, adminPassword);
    if (adminRole !== 'admin') {
      throw new Error('Only administrators can change user roles');
    }
    
    requirePermission(adminUsername, 'CHANGE_USER_ROLE', adminRole);
    
    const userInfo = getUserInfo(targetUsername);
    if (!userInfo) {
      throw new Error('User not found');
    }
    
    const oldRole = userInfo.role;
    
    // Handle admin/moderator account changes
    if (newRole === 'admin' || newRole === 'moderator') {
      // Get current password (this is a limitation of the current system)
      // In a real app, this would be handled differently
      const defaultPassword = 'ChangePassword123!';
      await createAdminAccount(targetUsername, defaultPassword, newRole);
    } else {
      // Remove from admin accounts if downgrading
      if (oldRole === 'admin' || oldRole === 'moderator') {
        await deleteAdminAccount(targetUsername, adminUsername, adminPassword);
      }
    }
    
    // Update user info
    userInfo.role = newRole;
    updateUserInfo(targetUsername, userInfo);
    
    logAuditEvent(
      adminUsername,
      adminRole,
      'user_role_changed',
      'user',
      { 
        targetUser: targetUsername,
        oldRole,
        newRole 
      },
      'success',
      targetUsername
    );
    
    return true;
  } catch (error) {
    logAuditEvent(
      adminUsername,
      'admin',
      'user_role_changed',
      'user',
      { 
        targetUser: targetUsername,
        newRole,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      'failure',
      targetUsername,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    console.error('Failed to update user role:', error);
    return false;
  }
}

/**
 * Ban a user
 */
export function banUser(
  targetUsername: string,
  options: BanUserOptions
): boolean {
  try {
    requirePermission(options.moderatorUsername, 'BAN_USERS', options.moderatorRole);
    
    const userInfo = getUserInfo(targetUsername);
    if (!userInfo) {
      throw new Error('User not found');
    }
    
    if (userInfo.role === 'admin') {
      throw new Error('Cannot ban administrator accounts');
    }
    
    if (userInfo.role === 'moderator' && options.moderatorRole !== 'admin') {
      throw new Error('Only administrators can ban moderators');
    }
    
    const banInfo = {
      reason: options.reason,
      bannedBy: options.moderatorUsername,
      bannedAt: Date.now(),
      expiresAt: options.duration ? Date.now() + options.duration : undefined
    };
    
    userInfo.status = 'banned';
    userInfo.banInfo = banInfo;
    
    updateUserInfo(targetUsername, userInfo);
    
    // Also store in banned users list for quick lookup
    const bannedUsers = getBannedUsers();
    bannedUsers[targetUsername] = banInfo;
    localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(bannedUsers));
    
    logAuditEvent(
      options.moderatorUsername,
      options.moderatorRole,
      'user_banned',
      'user',
      { 
        targetUser: targetUsername,
        reason: options.reason,
        duration: options.duration ? `${options.duration}ms` : 'permanent'
      },
      'success',
      targetUsername
    );
    
    return true;
  } catch (error) {
    logAuditEvent(
      options.moderatorUsername,
      options.moderatorRole,
      'user_banned',
      'user',
      { 
        targetUser: targetUsername,
        reason: options.reason,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      'failure',
      targetUsername,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    console.error('Failed to ban user:', error);
    return false;
  }
}

/**
 * Unban a user
 */
export function unbanUser(
  targetUsername: string,
  moderatorUsername: string,
  moderatorRole: UserRole
): boolean {
  try {
    requirePermission(moderatorUsername, 'BAN_USERS', moderatorRole);
    
    const userInfo = getUserInfo(targetUsername);
    if (!userInfo || userInfo.status !== 'banned') {
      throw new Error('User is not banned');
    }
    
    userInfo.status = 'active';
    delete userInfo.banInfo;
    
    updateUserInfo(targetUsername, userInfo);
    
    // Remove from banned users list
    const bannedUsers = getBannedUsers();
    delete bannedUsers[targetUsername];
    localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(bannedUsers));
    
    logAuditEvent(
      moderatorUsername,
      moderatorRole,
      'user_unbanned',
      'user',
      { targetUser: targetUsername },
      'success',
      targetUsername
    );
    
    return true;
  } catch (error) {
    logAuditEvent(
      moderatorUsername,
      moderatorRole,
      'user_unbanned',
      'user',
      { 
        targetUser: targetUsername,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      'failure',
      targetUsername,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    console.error('Failed to unban user:', error);
    return false;
  }
}

/**
 * Check if a user is currently banned
 */
export function isUserBanned(username: string): boolean {
  const userInfo = getUserInfo(username);
  if (!userInfo || userInfo.status !== 'banned') {
    return false;
  }
  
  // Check if ban has expired
  if (userInfo.banInfo?.expiresAt && userInfo.banInfo.expiresAt <= Date.now()) {
    // Auto-unban expired bans
    unbanUser(username, 'system', 'admin');
    return false;
  }
  
  return true;
}

/**
 * Get banned users list
 */
export function getBannedUsers(): Record<string, any> {
  try {
    const bannedData = localStorage.getItem(BANNED_USERS_KEY);
    return bannedData ? JSON.parse(bannedData) : {};
  } catch (error) {
    console.error('Failed to get banned users:', error);
    return {};
  }
}

/**
 * Get user statistics
 */
export function getUserStats(requestingUser: string, requestingRole: UserRole): {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  adminUsers: number;
  moderatorUsers: number;
  recentJoins: UserInfo[];
} {
  requirePermission(requestingUser, 'VIEW_USER_LIST', requestingRole);
  
  const allUsers = getAllUsers(requestingUser, requestingRole);
  const adminAccounts = listAdminAccounts();
  
  const stats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.status === 'active').length,
    bannedUsers: allUsers.filter(u => u.status === 'banned').length,
    adminUsers: adminAccounts.filter(a => a.role === 'admin').length,
    moderatorUsers: adminAccounts.filter(a => a.role === 'moderator').length,
    recentJoins: allUsers
      .sort((a, b) => b.joinDate - a.joinDate)
      .slice(0, 10)
  };
  
  logAuditEvent(
    requestingUser,
    requestingRole,
    'audit_log_viewed',
    'user_stats',
    stats
  );
  
  return stats;
}

/**
 * Create user info from session data
 */
function createUserInfoFromSession(username: string): UserInfo | null {
  try {
    // Try to get info from current session
    const sessionData = localStorage.getItem('cozy-critter-user-session');
    if (sessionData) {
      const session: UserSession = JSON.parse(sessionData);
      if (session.username === username) {
        return {
          username,
          role: session.role,
          isRegistered: session.isRegistered || false,
          joinDate: session.timestamp,
          lastActive: Date.now(),
          postCount: 0, // Would need to calculate from forum posts
          status: 'active'
        };
      }
    }
    
    // Check if it's an admin/mod account
    const adminAccounts = listAdminAccounts();
    const adminAccount = adminAccounts.find(a => a.username === username);
    if (adminAccount) {
      return {
        username,
        role: adminAccount.role,
        isRegistered: true,
        joinDate: Date.now(), // We don't store creation date for admin accounts
        lastActive: Date.now(),
        postCount: 0,
        status: 'active'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to create user info from session:', error);
    return null;
  }
}

/**
 * Update user info in storage
 */
function updateUserInfo(username: string, userInfo: UserInfo): void {
  try {
    const userInfoData = localStorage.getItem(USER_INFO_KEY);
    const userInfoMap: Record<string, UserInfo> = userInfoData ? JSON.parse(userInfoData) : {};
    
    userInfo.lastActive = Date.now();
    userInfoMap[username] = userInfo;
    
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfoMap));
  } catch (error) {
    console.error('Failed to update user info:', error);
  }
}

/**
 * Update user activity (called when user performs actions)
 */
export function updateUserActivity(username: string): void {
  const userInfo = getUserInfo(username);
  if (userInfo) {
    updateUserInfo(username, userInfo);
  }
}

/**
 * Increment user post count
 */
export function incrementUserPostCount(username: string): void {
  const userInfo = getUserInfo(username);
  if (userInfo) {
    userInfo.postCount++;
    updateUserInfo(username, userInfo);
  }
}