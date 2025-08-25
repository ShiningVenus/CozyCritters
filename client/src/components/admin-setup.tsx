/**
 * Secure Admin Setup Component
 * Provides a protected interface for setting up admin and moderator accounts
 */

import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, UserPlus, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  initializeAdminAccounts, 
  verifyAdminCredentials, 
  createAdminAccount, 
  getDefaultCredentials,
  changeAdminPassword 
} from '../lib/admin-accounts';
import { UserRole } from '../../../shared/schema';
import { isProduction } from '../lib/environment';

interface AdminSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminAuth {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string;
}

export function AdminSetup({ isOpen, onClose }: AdminSetupProps) {
  const [authStep, setAuthStep] = useState<'login' | 'setup'>('login');
  const [adminAuth, setAdminAuth] = useState<AdminAuth>({
    isAuthenticated: false,
    role: null,
    username: ''
  });
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Setup form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('moderator');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  
  // Password change state
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPasswordChange, setNewPasswordChange] = useState('');
  const [confirmPasswordChange, setConfirmPasswordChange] = useState('');
  
  const defaultCreds = getDefaultCredentials();

  useEffect(() => {
    if (isOpen) {
      // Initialize admin accounts on open
      initializeAdminAccounts();
      
      // Reset form state
      setAuthStep('login');
      setAdminAuth({ isAuthenticated: false, role: null, username: '' });
      setLoginUsername('');
      setLoginPassword('');
      setLoginError('');
      setSetupError('');
      setSetupSuccess('');
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const role = await verifyAdminCredentials(loginUsername, loginPassword);
      if (role) {
        setAdminAuth({
          isAuthenticated: true,
          role,
          username: loginUsername
        });
        setAuthStep('setup');
      } else {
        setLoginError('Invalid credentials. Please check your username and password.');
      }
    } catch (error) {
      setLoginError('Authentication failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupLoading(true);
    setSetupError('');
    setSetupSuccess('');

    if (newPassword !== confirmPassword) {
      setSetupError('Passwords do not match.');
      setSetupLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setSetupError('Password must be at least 8 characters long.');
      setSetupLoading(false);
      return;
    }

    if (adminAuth.role !== 'admin' && newRole === 'admin') {
      setSetupError('Only admins can create other admin accounts.');
      setSetupLoading(false);
      return;
    }

    try {
      const success = await createAdminAccount(newUsername, newPassword, newRole);
      if (success) {
        setSetupSuccess(`${newRole === 'admin' ? 'Admin' : 'Moderator'} account created successfully!`);
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        setNewRole('moderator');
      } else {
        setSetupError('Failed to create account. Please try again.');
      }
    } catch (error: any) {
      setSetupError(error.message || 'Failed to create account.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupLoading(true);
    setSetupError('');
    setSetupSuccess('');

    if (newPasswordChange !== confirmPasswordChange) {
      setSetupError('New passwords do not match.');
      setSetupLoading(false);
      return;
    }

    if (newPasswordChange.length < 8) {
      setSetupError('New password must be at least 8 characters long.');
      setSetupLoading(false);
      return;
    }

    try {
      const success = await changeAdminPassword(adminAuth.username, oldPassword, newPasswordChange);
      if (success) {
        setSetupSuccess('Password changed successfully!');
        setChangePasswordMode(false);
        setOldPassword('');
        setNewPasswordChange('');
        setConfirmPasswordChange('');
      } else {
        setSetupError('Failed to change password. Please check your current password.');
      }
    } catch (error) {
      setSetupError('Failed to change password. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {authStep === 'login' ? 'Admin Authentication' : 'Admin Setup Panel'}
          </h2>
        </div>

        {authStep === 'login' && (
          <div>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This is a protected admin area. Only authorized personnel should access this interface.
                  </p>
                  {!isProduction() && (
                    <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
                      <p className="font-medium">Development Mode - Default Credentials:</p>
                      <p>Admin: {defaultCreds.admin.username} / {defaultCreds.admin.password}</p>
                      <p>Moderator: {defaultCreds.moderator.username} / {defaultCreds.moderator.password}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="text-red-600 text-sm">{loginError}</div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loginLoading ? 'Authenticating...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {authStep === 'setup' && (
          <div>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Authenticated as {adminAuth.role}: {adminAuth.username}
                  </p>
                  <p className="text-sm text-green-700">
                    You can now manage admin and moderator accounts.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {!changePasswordMode ? (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create New Account
                    </h3>
                    
                    <form onSubmit={handleCreateAccount} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          minLength={3}
                          maxLength={20}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="moderator">Moderator</option>
                          {adminAuth.role === 'admin' && (
                            <option value="admin">Admin</option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          minLength={8}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={setupLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {setupLoading ? 'Creating Account...' : `Create ${newRole === 'admin' ? 'Admin' : 'Moderator'} Account`}
                      </button>
                    </form>
                  </div>

                  <div className="border-t pt-4">
                    <button
                      onClick={() => setChangePasswordMode(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Key className="w-4 h-4" />
                      Change My Password
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Change Password
                  </h3>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPasswordChange}
                        onChange={(e) => setNewPasswordChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPasswordChange}
                        onChange={(e) => setConfirmPasswordChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={setupLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {setupLoading ? 'Changing Password...' : 'Change Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChangePasswordMode(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {setupError && (
                <div className="text-red-600 text-sm">{setupError}</div>
              )}

              {setupSuccess && (
                <div className="text-green-600 text-sm">{setupSuccess}</div>
              )}

              <div className="border-t pt-4">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded text-sm hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}