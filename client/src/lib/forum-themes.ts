/**
 * Forum-specific theme presets and utilities
 */

export interface ForumTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    headerBackground: string;
    headerGradient: string;
    border: string;
    text: string;
    link: string;
    linkHover: string;
    button: string;
    buttonHover: string;
    tableHeader: string;
    tableRow: string;
    tableRowHover: string;
  };
}

export const forumThemes: ForumTheme[] = [
  {
    id: 'classic',
    name: 'phpBB Classic',
    description: 'Traditional phpBB2 styling',
    colors: {
      background: '#ffffff',
      headerBackground: 'linear-gradient(to bottom, #dee3e7, #d1d7dc)',
      headerGradient: 'linear-gradient(to bottom, #dee3e7, #d1d7dc)',
      border: '#c5c5c5',
      text: '#000000',
      link: '#006699',
      linkHover: '#dd6900',
      button: '#006699',
      buttonHover: '#0088cc',
      tableHeader: 'linear-gradient(to bottom, #dee3e7, #d1d7dc)',
      tableRow: '#ffffff',
      tableRowHover: '#f7f8fa'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes for sensitive users',
    colors: {
      background: '#1a1a1a',
      headerBackground: 'linear-gradient(to bottom, #2d2d2d, #232323)',
      headerGradient: 'linear-gradient(to bottom, #2d2d2d, #232323)',
      border: '#404040',
      text: '#e0e0e0',
      link: '#4a9eff',
      linkHover: '#ff8c42',
      button: '#4a9eff',
      buttonHover: '#6bb0ff',
      tableHeader: 'linear-gradient(to bottom, #2d2d2d, #232323)',
      tableRow: '#1a1a1a',
      tableRowHover: '#252525'
    }
  },
  {
    id: 'sensory-friendly',
    name: 'Sensory Friendly',
    description: 'Low contrast, muted colors for comfort',
    colors: {
      background: '#f8f9fa',
      headerBackground: 'linear-gradient(to bottom, #e9ecef, #e1e5e8)',
      headerGradient: 'linear-gradient(to bottom, #e9ecef, #e1e5e8)',
      border: '#d6d9dc',
      text: '#495057',
      link: '#457b9d',
      linkHover: '#a68a64',
      button: '#457b9d',
      buttonHover: '#5a8cb1',
      tableHeader: 'linear-gradient(to bottom, #e9ecef, #e1e5e8)',
      tableRow: '#f8f9fa',
      tableRowHover: '#f1f3f4'
    }
  },
  {
    id: 'autism-awareness',
    name: 'Warm & Calming',
    description: 'Warm golden tones for comfort',
    colors: {
      background: '#fefcf6',
      headerBackground: 'linear-gradient(to bottom, #f4e8d0, #efdcc0)',
      headerGradient: 'linear-gradient(to bottom, #f4e8d0, #efdcc0)',
      border: '#d4c4a8',
      text: '#5d4e37',
      link: '#8b7355',
      linkHover: '#b8860b',
      button: '#8b7355',
      buttonHover: '#a0845c',
      tableHeader: 'linear-gradient(to bottom, #f4e8d0, #efdcc0)',
      tableRow: '#fefcf6',
      tableRowHover: '#f9f5eb'
    }
  }
];

/**
 * Apply a forum theme to the document
 */
export function applyForumTheme(theme: ForumTheme) {
  const root = document.documentElement;
  
  // Apply CSS custom properties for forum themes
  root.style.setProperty('--forum-bg', theme.colors.background);
  root.style.setProperty('--forum-header-bg', theme.colors.headerBackground);
  root.style.setProperty('--forum-border', theme.colors.border);
  root.style.setProperty('--forum-text', theme.colors.text);
  root.style.setProperty('--forum-link', theme.colors.link);
  root.style.setProperty('--forum-link-hover', theme.colors.linkHover);
  root.style.setProperty('--forum-button', theme.colors.button);
  root.style.setProperty('--forum-button-hover', theme.colors.buttonHover);
  root.style.setProperty('--forum-table-header', theme.colors.tableHeader);
  root.style.setProperty('--forum-table-row', theme.colors.tableRow);
  root.style.setProperty('--forum-table-row-hover', theme.colors.tableRowHover);
  
  // Store the selected theme
  localStorage.setItem('cozy-critter-forum-theme', theme.id);
}

/**
 * Get the current forum theme
 */
export function getCurrentForumTheme(): ForumTheme {
  const storedThemeId = localStorage.getItem('cozy-critter-forum-theme');
  const theme = forumThemes.find(t => t.id === storedThemeId);
  return theme || forumThemes[0]; // Default to classic theme
}

/**
 * Initialize forum theming on page load
 */
export function initializeForumTheme() {
  const currentTheme = getCurrentForumTheme();
  applyForumTheme(currentTheme);
}