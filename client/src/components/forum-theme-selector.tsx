import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { forumThemes, applyForumTheme, getCurrentForumTheme, ForumTheme } from '../lib/forum-themes';

export function ForumThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ForumTheme>(getCurrentForumTheme());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Apply the current theme on component mount
    applyForumTheme(currentTheme);
  }, []);

  const handleThemeChange = (theme: ForumTheme) => {
    setCurrentTheme(theme);
    applyForumTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="phpbb-admin-btn"
        title="Change forum theme"
      >
        <Palette size={14} />
        Theme: {currentTheme.name}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-64">
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-800 text-sm">Forum Themes</h4>
            <p className="text-xs text-gray-600 mt-1">Choose a theme that's comfortable for you</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {forumThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme)}
                className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  currentTheme.id === theme.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-800">{theme.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{theme.description}</div>
                  </div>
                  
                  {/* Theme preview colors */}
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded border border-gray-300"
                      style={{ backgroundColor: theme.colors.background }}
                      title="Background"
                    />
                    <div 
                      className="w-3 h-3 rounded border border-gray-300"
                      style={{ backgroundColor: theme.colors.link }}
                      title="Links"
                    />
                    <div 
                      className="w-3 h-3 rounded border border-gray-300"
                      style={{ backgroundColor: theme.colors.button }}
                      title="Buttons"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-600">
              Themes are designed to be ND-friendly and sensory-comfortable
            </p>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}