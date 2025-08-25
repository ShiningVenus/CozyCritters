import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserSession } from '../hooks/useUserSession';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'register' | 'login';
}

export function UserAuthModal({ isOpen, onClose, mode }: UserAuthModalProps) {
  const { userSession, registerUser, loginUser, updateUsername } = useUserSession();
  const [username, setUsername] = useState(userSession?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (mode === 'register') {
        success = await registerUser(username, password);
        if (!success) {
          setError('Failed to register. Please try again.');
        }
      } else {
        success = await loginUser(username, password);
        if (!success) {
          setError('Invalid username or password.');
        }
      }

      if (success) {
        onClose();
        setPassword('');
        setError('');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameOnly = () => {
    updateUsername(username);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">
            {mode === 'register' ? 'Register Account' : 'Login'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose your username"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {mode === 'register' && '(optional)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder={mode === 'register' ? 'Leave blank to stay anonymous' : 'Enter your password'}
                required={mode === 'login'}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}
            </button>
            
            {mode === 'register' && !password && (
              <button
                type="button"
                onClick={handleUsernameOnly}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm font-medium hover:bg-gray-200"
              >
                Skip Password
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-200"
          >
            Cancel
          </button>
        </form>

        {mode === 'register' && (
          <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
            <p className="font-medium mb-1">Privacy Note:</p>
            <p>Your data stays on your device. No emails, tracking, or personal info required. 
               Password is optional for anonymous use.</p>
          </div>
        )}
      </div>
    </div>
  );
}