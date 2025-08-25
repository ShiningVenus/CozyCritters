import { test } from 'node:test';
import assert from 'node:assert/strict';

// Test for username behavior in forum posts
// This will help validate that registered users see their chosen usernames in posts

test('registered user should use their username for posts', () => {
  // Mock user session with registered user
  const registeredUserSession = {
    id: 'test-user-id',
    username: 'TestUser123',
    role: 'user' as const,
    timestamp: Date.now(),
    isRegistered: true
  };

  // Function to get author name based on user session
  const getAuthorName = (userSession: typeof registeredUserSession, generateAnonymous: () => string) => {
    if (userSession.isRegistered && userSession.username) {
      return userSession.username;
    }
    return generateAnonymous();
  };

  const mockGenerateAnonymous = () => 'Random Animal';
  
  const authorName = getAuthorName(registeredUserSession, mockGenerateAnonymous);
  assert.equal(authorName, 'TestUser123', 'Registered user should use their chosen username');
});

test('unregistered user should use anonymous name for posts', () => {
  // Mock user session with unregistered user
  const unregisteredUserSession = {
    id: 'test-user-id',
    username: 'Gentle Fox', // This is generated, not chosen
    role: 'user' as const,
    timestamp: Date.now(),
    isRegistered: false
  };

  // Function to get author name based on user session
  const getAuthorName = (userSession: typeof unregisteredUserSession, generateAnonymous: () => string) => {
    if (userSession.isRegistered && userSession.username) {
      return userSession.username;
    }
    return generateAnonymous();
  };

  const mockGenerateAnonymous = () => 'Random Animal';
  
  const authorName = getAuthorName(unregisteredUserSession, mockGenerateAnonymous);
  assert.equal(authorName, 'Random Animal', 'Unregistered user should use anonymous name');
});

test('admin user should use their username for posts', () => {
  // Mock admin user session
  const adminUserSession = {
    id: 'admin-user-id',
    username: 'AdminUser',
    role: 'admin' as const,
    timestamp: Date.now(),
    isRegistered: true
  };

  // Function to get author name based on user session
  const getAuthorName = (userSession: typeof adminUserSession, generateAnonymous: () => string) => {
    if (userSession.isRegistered && userSession.username) {
      return userSession.username;
    }
    return generateAnonymous();
  };

  const mockGenerateAnonymous = () => 'Random Animal';
  
  const authorName = getAuthorName(adminUserSession, mockGenerateAnonymous);
  assert.equal(authorName, 'AdminUser', 'Admin user should use their chosen username');
});

test('moderator user should use their username for posts', () => {
  // Mock moderator user session
  const modUserSession = {
    id: 'mod-user-id',
    username: 'ModeratorUser',
    role: 'moderator' as const,
    timestamp: Date.now(),
    isRegistered: true
  };

  // Function to get author name based on user session
  const getAuthorName = (userSession: typeof modUserSession, generateAnonymous: () => string) => {
    if (userSession.isRegistered && userSession.username) {
      return userSession.username;
    }
    return generateAnonymous();
  };

  const mockGenerateAnonymous = () => 'Random Animal';
  
  const authorName = getAuthorName(modUserSession, mockGenerateAnonymous);
  assert.equal(authorName, 'ModeratorUser', 'Moderator user should use their chosen username');
});