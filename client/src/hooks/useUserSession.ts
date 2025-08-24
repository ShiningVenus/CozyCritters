import { useState, useEffect } from 'react';
import { UserSession, UserRole } from '../../../shared/schema';

const USER_SESSION_KEY = 'cozy-critter-user-session';

export function useUserSession() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem(USER_SESSION_KEY);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as UserSession;
        setUserSession(session);
      } catch (error) {
        console.warn('Failed to parse user session:', error);
        localStorage.removeItem(USER_SESSION_KEY);
      }
    } else {
      // Create default user session
      const defaultSession: UserSession = {
        id: crypto.randomUUID(),
        username: generateAnonymousName(),
        role: 'user',
        timestamp: Date.now()
      };
      setUserSession(defaultSession);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(defaultSession));
    }
  }, []);

  const updateUserRole = (newRole: UserRole) => {
    if (!userSession) return;
    
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

  return {
    userSession,
    updateUserRole,
    hasModeratorAccess,
    hasAdminAccess
  };
}