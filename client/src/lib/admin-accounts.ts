/**
 * Secure admin account management for production
 */

import { hashPassword, verifyPassword } from './password-utils';
import { UserSession, UserRole } from '../../../shared/schema';

// Predefined admin accounts with hashed credentials
interface AdminAccount {
  username: string;
  role: UserRole;
  passwordHash: string;
}

// Storage key for admin accounts
const ADMIN_ACCOUNTS_KEY = 'cozy-critter-admin-accounts';

/**
 * Default admin credentials (these should be changed in production)
 */
const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'ChangeMe123!',
  role: 'admin' as UserRole
};

const DEFAULT_MOD_CREDENTIALS = {
  username: 'moderator', 
  password: 'ChangeMeToo123!',
  role: 'moderator' as UserRole
};

/**
 * Initialize default admin accounts if they don't exist
 */
export async function initializeAdminAccounts(): Promise<void> {
  const existingAccounts = getAdminAccounts();
  
  if (existingAccounts.length === 0) {
    // Create default accounts with hashed passwords
    const adminPasswordHash = await hashPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    const modPasswordHash = await hashPassword(DEFAULT_MOD_CREDENTIALS.password);
    
    const defaultAccounts: AdminAccount[] = [
      {
        username: DEFAULT_ADMIN_CREDENTIALS.username,
        role: DEFAULT_ADMIN_CREDENTIALS.role,
        passwordHash: adminPasswordHash
      },
      {
        username: DEFAULT_MOD_CREDENTIALS.username,
        role: DEFAULT_MOD_CREDENTIALS.role,
        passwordHash: modPasswordHash
      }
    ];
    
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(defaultAccounts));
  }
}

/**
 * Get all admin accounts
 */
export function getAdminAccounts(): AdminAccount[] {
  try {
    const accounts = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error('Failed to load admin accounts:', error);
    return [];
  }
}

/**
 * Verify admin/mod credentials
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<UserRole | null> {
  const accounts = getAdminAccounts();
  
  for (const account of accounts) {
    if (account.username === username) {
      const isValid = await verifyPassword(password, account.passwordHash);
      if (isValid) {
        return account.role;
      }
    }
  }
  
  return null;
}

/**
 * Create a new admin or moderator account
 */
export async function createAdminAccount(username: string, password: string, role: UserRole): Promise<boolean> {
  if (role !== 'admin' && role !== 'moderator') {
    throw new Error('Invalid role. Only admin and moderator roles are allowed.');
  }
  
  const accounts = getAdminAccounts();
  
  // Check if username already exists
  if (accounts.some(account => account.username === username)) {
    throw new Error('Username already exists');
  }
  
  try {
    const passwordHash = await hashPassword(password);
    const newAccount: AdminAccount = {
      username,
      role,
      passwordHash
    };
    
    accounts.push(newAccount);
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
    return true;
  } catch (error) {
    console.error('Failed to create admin account:', error);
    return false;
  }
}

/**
 * Change password for an admin account
 */
export async function changeAdminPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
  const accounts = getAdminAccounts();
  
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].username === username) {
      const isValidOldPassword = await verifyPassword(oldPassword, accounts[i].passwordHash);
      if (isValidOldPassword) {
        try {
          accounts[i].passwordHash = await hashPassword(newPassword);
          localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
          return true;
        } catch (error) {
          console.error('Failed to change password:', error);
          return false;
        }
      }
    }
  }
  
  return false;
}

/**
 * Get default admin credentials (for setup instructions)
 */
export function getDefaultCredentials() {
  return {
    admin: {
      username: DEFAULT_ADMIN_CREDENTIALS.username,
      password: DEFAULT_ADMIN_CREDENTIALS.password
    },
    moderator: {
      username: DEFAULT_MOD_CREDENTIALS.username,
      password: DEFAULT_MOD_CREDENTIALS.password
    }
  };
}

/**
 * Get all admin/moderator usernames for enhanced permissions checking
 */
export function getAllAdminUsernames(): string[] {
  const accounts = getAdminAccounts();
  return accounts.map(account => account.username);
}

/**
 * Check if a username belongs to an admin/moderator account
 */
export function isStaffUser(username: string): { isStaff: boolean; role?: UserRole } {
  const accounts = getAdminAccounts();
  const account = accounts.find(acc => acc.username === username);
  
  if (account) {
    return { isStaff: true, role: account.role };
  }
  
  return { isStaff: false };
}

/**
 * Delete an admin account (admins only)
 */
export async function deleteAdminAccount(username: string, adminUsername: string, adminPassword: string): Promise<boolean> {
  // Verify admin credentials first
  const adminRole = await verifyAdminCredentials(adminUsername, adminPassword);
  if (adminRole !== 'admin') {
    throw new Error('Only administrators can delete accounts');
  }
  
  const accounts = getAdminAccounts();
  const accountIndex = accounts.findIndex(account => account.username === username);
  
  if (accountIndex === -1) {
    throw new Error('Account not found');
  }
  
  // Prevent deleting the last admin account
  const adminAccounts = accounts.filter(acc => acc.role === 'admin');
  if (adminAccounts.length === 1 && accounts[accountIndex].role === 'admin') {
    throw new Error('Cannot delete the last administrator account');
  }
  
  accounts.splice(accountIndex, 1);
  localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
  return true;
}

/**
 * List all admin accounts (for admin management interface)
 */
export function listAdminAccounts(): Array<{ username: string; role: UserRole }> {
  const accounts = getAdminAccounts();
  return accounts.map(account => ({
    username: account.username,
    role: account.role
  }));
}