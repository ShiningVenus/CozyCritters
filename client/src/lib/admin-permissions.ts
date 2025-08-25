/**
 * Modular admin permissions system
 * Provides granular permission checking for admin and moderator actions
 */

import { UserRole } from '../../../shared/schema';
import { isStaffUser, verifyAdminCredentials } from './admin-accounts';

export interface Permission {
  action: string;
  resource: string;
  requiredRole: UserRole;
  description: string;
}

export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
  role?: UserRole;
}

// Define all available permissions
export const PERMISSIONS: Record<string, Permission> = {
  // User Management
  CREATE_ADMIN: {
    action: 'create',
    resource: 'admin_account',
    requiredRole: 'admin',
    description: 'Create new administrator accounts'
  },
  CREATE_MODERATOR: {
    action: 'create',
    resource: 'moderator_account',
    requiredRole: 'admin',
    description: 'Create new moderator accounts'
  },
  DELETE_ADMIN: {
    action: 'delete',
    resource: 'admin_account',
    requiredRole: 'admin',
    description: 'Delete administrator accounts'
  },
  DELETE_MODERATOR: {
    action: 'delete',
    resource: 'moderator_account',
    requiredRole: 'admin',
    description: 'Delete moderator accounts'
  },
  CHANGE_USER_ROLE: {
    action: 'change',
    resource: 'user_role',
    requiredRole: 'admin',
    description: 'Change user roles'
  },
  VIEW_USER_LIST: {
    action: 'view',
    resource: 'user_list',
    requiredRole: 'moderator',
    description: 'View list of all users'
  },

  // Content Moderation
  MODERATE_POSTS: {
    action: 'moderate',
    resource: 'posts',
    requiredRole: 'moderator',
    description: 'Hide, edit, or delete posts'
  },
  MODERATE_TOPICS: {
    action: 'moderate',
    resource: 'topics',
    requiredRole: 'moderator',
    description: 'Pin, lock, or delete topics'
  },
  BAN_USERS: {
    action: 'ban',
    resource: 'users',
    requiredRole: 'moderator',
    description: 'Temporarily or permanently ban users'
  },
  VIEW_MODERATION_LOGS: {
    action: 'view',
    resource: 'moderation_logs',
    requiredRole: 'moderator',
    description: 'View moderation action history'
  },

  // Forum Management
  CREATE_FORUMS: {
    action: 'create',
    resource: 'forums',
    requiredRole: 'admin',
    description: 'Create new forum categories'
  },
  DELETE_FORUMS: {
    action: 'delete',
    resource: 'forums',
    requiredRole: 'admin',
    description: 'Delete forum categories'
  },
  MANAGE_FORUM_SETTINGS: {
    action: 'manage',
    resource: 'forum_settings',
    requiredRole: 'admin',
    description: 'Change forum configuration and settings'
  },

  // System Administration
  VIEW_ADMIN_PANEL: {
    action: 'view',
    resource: 'admin_panel',
    requiredRole: 'moderator',
    description: 'Access admin/moderator panel'
  },
  MANAGE_SYSTEM_SETTINGS: {
    action: 'manage',
    resource: 'system_settings',
    requiredRole: 'admin',
    description: 'Change system-wide settings'
  },
  VIEW_AUDIT_LOGS: {
    action: 'view',
    resource: 'audit_logs',
    requiredRole: 'admin',
    description: 'View complete audit trail'
  }
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  username: string,
  permissionKey: string,
  userRole?: UserRole
): PermissionCheck {
  const permission = PERMISSIONS[permissionKey];
  
  if (!permission) {
    return {
      hasPermission: false,
      reason: 'Invalid permission key'
    };
  }

  // Get user role if not provided
  let role = userRole;
  if (!role) {
    const staffInfo = isStaffUser(username);
    if (staffInfo.isStaff) {
      role = staffInfo.role;
    } else {
      role = 'user';
    }
  }

  // Ensure role is defined before checking hierarchy
  if (!role) {
    return {
      hasPermission: false,
      reason: 'Unable to determine user role',
      role: 'user'
    };
  }

  // Check role hierarchy
  const hasRequiredRole = checkRoleHierarchy(role, permission.requiredRole);
  
  return {
    hasPermission: hasRequiredRole,
    reason: hasRequiredRole ? undefined : `Requires ${permission.requiredRole} role or higher`,
    role
  };
}

/**
 * Check role hierarchy (admin > moderator > user)
 */
function checkRoleHierarchy(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'user': 1,
    'moderator': 2,
    'admin': 3
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check multiple permissions at once
 */
export function hasPermissions(
  username: string,
  permissionKeys: string[],
  userRole?: UserRole
): Record<string, PermissionCheck> {
  const results: Record<string, PermissionCheck> = {};
  
  for (const key of permissionKeys) {
    results[key] = hasPermission(username, key, userRole);
  }
  
  return results;
}

/**
 * Get all permissions for a specific role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return Object.values(PERMISSIONS).filter(permission => 
    checkRoleHierarchy(role, permission.requiredRole)
  );
}

/**
 * Require permission check with error throwing
 */
export function requirePermission(
  username: string,
  permissionKey: string,
  userRole?: UserRole
): void {
  const check = hasPermission(username, permissionKey, userRole);
  
  if (!check.hasPermission) {
    throw new Error(`Access denied: ${check.reason}`);
  }
}

/**
 * Validate admin credentials and return permissions
 */
export async function validateAdminAccess(
  username: string,
  password: string
): Promise<{
  isValid: boolean;
  role?: UserRole;
  permissions?: Permission[];
}> {
  try {
    const role = await verifyAdminCredentials(username, password);
    
    if (!role) {
      return { isValid: false };
    }

    const permissions = getPermissionsForRole(role);
    
    return {
      isValid: true,
      role,
      permissions
    };
  } catch (error) {
    console.error('Admin access validation failed:', error);
    return { isValid: false };
  }
}