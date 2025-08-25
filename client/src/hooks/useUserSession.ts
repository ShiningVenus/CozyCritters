import { useState, useEffect } from 'react';
import { UserSession, UserRole } from '../../../shared/schema';
import { hashPassword, verifyPassword } from '../lib/password-utils';
import { verifyAdminCredentials, initializeAdminAccounts } from '../lib/admin-accounts';
import { isProduction } from '../lib/environment';

const USER_SESSION_KEY = 'cozy-critter-user-session';

export function useUserSession() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    // Initialize admin accounts on app load
    initializeAdminAccounts();
    
    const savedSession = localStorage.getItem(USER_SESSION_KEY);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as UserSession;
        
        // Check if session is expired (older than 30 days)
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        if (Date.now() - session.timestamp > maxAge) {
          console.log('Session expired, creating new session');
          localStorage.removeItem(USER_SESSION_KEY);
          // Create new session below
        } else {
          setUserSession(session);
          return;
        }
      } catch (error) {
        console.warn('Failed to parse user session:', error);
        localStorage.removeItem(USER_SESSION_KEY);
      }
    }
    
    // Create default user session if no valid session exists
    const defaultSession: UserSession = {
      id: crypto.randomUUID(),
      username: generateAnonymousName(),
      role: 'user',
      timestamp: Date.now(),
      isRegistered: false
    };
    setUserSession(defaultSession);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(defaultSession));
  }, []);

  const updateUserRole = (newRole: UserRole) => {
    if (!userSession) return;
    
    // In production, prevent unauthorized role elevation
    if (isProduction()) {
      console.warn('Role elevation blocked in production mode. Use admin setup interface.');
      return;
    }
    
    const updatedSession: UserSession = {
      ...userSession,
      role: newRole
    };
    setUserSession(updatedSession);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
  };

  const generateAnonymousName = () => {
    const animals = ['Fox', 'Owl', 'Rabbit', 'Penguin', 'Deer', 'Cat', 'Bear', 'Wolf', 'Squirrel', 'Hedgehog'];
    const adjectives = ['Gentle', 'Wise', 'Kind', 'Brave', 'Calm', 'Thoughtful', 'Patient', 'Creative', 'Curious', 'Peaceful'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective} ${animal}`;
  };

  const hasModeratorAccess = () => {
    return userSession?.role === 'moderator' || userSession?.role === 'admin';
  };

  const hasAdminAccess = () => {
    return userSession?.role === 'admin';
  };

  const registerUser = async (username: string, password: string): Promise<boolean> => {
    if (!userSession) return false;

    try {
      const passwordHash = await hashPassword(password);
      const updatedSession: UserSession = {
        ...userSession,
        username,
        isRegistered: true,
        passwordHash
      };
      setUserSession(updatedSession);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
      return true;
    } catch (error) {
      console.error('Failed to register user:', error);
      return false;
    }
  };

  const loginUser = async (username: string, password: string): Promise<boolean> => {
    // First check if it's an admin/mod account
    const adminRole = await verifyAdminCredentials(username, password);
    if (adminRole) {
      // Login as admin/mod
      const adminSession: UserSession = {
        id: crypto.randomUUID(),
        username,
        role: adminRole,
        timestamp: Date.now(),
        isRegistered: true,
        passwordHash: await hashPassword(password) // Store for session verification
      };
      setUserSession(adminSession);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(adminSession));
      return true;
    }
    
    // In a real app, this would check against a database
    // For this local-only app, we check if the current user matches
    if (!userSession?.isRegistered || !userSession.passwordHash) {
      return false;
    }

    try {
      const isValidPassword = await verifyPassword(password, userSession.passwordHash);
      return isValidPassword && userSession.username === username;
    } catch (error) {
      console.error('Failed to login user:', error);
      return false;
    }
  };

  const updateUsername = (newUsername: string) => {
    if (!userSession) return;
    
    const updatedSession: UserSession = {
      ...userSession,
      username: newUsername
    };
    setUserSession(updatedSession);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
  };

  const logoutUser = () => {
    // Create new anonymous session
    const defaultSession: UserSession = {
      id: crypto.randomUUID(),
      username: generateAnonymousName(),
      role: 'user',
      timestamp: Date.now(),
      isRegistered: false
    };
    setUserSession(defaultSession);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(defaultSession));
  };

  const refreshSession = () => {
    // Update session timestamp to keep it active
    if (userSession) {
      const updatedSession: UserSession = {
        ...userSession,
        timestamp: Date.now()
      };
      setUserSession(updatedSession);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
    }
  };

  const clearExpiredSessions = () => {
    // Clear sessions older than 30 days
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (userSession && (Date.now() - userSession.timestamp > maxAge)) {
      console.log('Session expired, creating new session');
      logoutUser();
    }
  };

  return {
    userSession,
    updateUserRole,
    updateUsername,
    hasModeratorAccess,
    hasAdminAccess,
    registerUser,
    loginUser,
    logoutUser,
    refreshSession,
    clearExpiredSessions,
    generateAnonymousName
  };
}