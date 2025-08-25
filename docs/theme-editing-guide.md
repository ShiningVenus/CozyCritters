# Theme Editing and Customization Guide

This guide explains how to edit and add themes in Cozy Critters on Linux Mint and Windows. Whether you want to make simple adjustments using the built-in interface or create entirely new themes, this guide covers everything you need to know.

## Table of Contents

- [Quick Start: Using the Built-in Theme Editor](#quick-start-using-the-built-in-theme-editor)
- [Platform-Specific Instructions](#platform-specific-instructions)
- [Built-in Theme Presets](#built-in-theme-presets)
- [Advanced: Manual Theme Editing](#advanced-manual-theme-editing)
- [Creating New Theme Presets](#creating-new-theme-presets)
- [Troubleshooting](#troubleshooting)
- [Backup and Restore](#backup-and-restore)

## Quick Start: Using the Built-in Theme Editor

Cozy Critters includes a user-friendly theme customization interface that doesn't require any technical knowledge.

### Accessing the Theme Editor

1. **From the main application:**
   - Open Cozy Critters in your web browser
   - Look for the theme/settings icon (usually in the top navigation)
   - Click on "Theme Customizer" or "Customize Appearance"

2. **Direct URL access:**
   - If running locally: `http://localhost:5173/theme-customizer`
   - If using a hosted version: `[your-domain]/theme-customizer`

### Basic Theme Editing

The theme editor is organized into three main sections:

#### 1. Theme Presets
Quick selection of pre-designed themes optimized for different needs:
- **Default**: Standard light theme with balanced colors
- **Dark Mode**: Easy on the eyes for low-light environments
- **Autism Awareness**: Warm, calming golden tones
- **Sensory-Friendly**: Low contrast, muted colors for sensory comfort

#### 2. Custom Colors
Fine-tune individual color elements:
- **Primary Color**: Main color used throughout the app (buttons, links)
- **Secondary Color**: Supporting color for less prominent elements
- **Accent Color**: Highlight color for important elements

#### 3. Typography & Layout
Adjust fonts, sizes, and spacing for comfort:
- **Font Family**: Choose from Inter, Arial, Georgia, Comic Sans, or Courier New
- **Font Size**: Select from Small (14px), Medium (16px), Large (18px), or Extra Large (20px)
- **Spacing**: Control visual spacing with Compact, Normal, Comfortable, or Spacious settings

### Making Changes

1. **Select a preset**: Click on any theme preset to apply it instantly
2. **Customize colors**: Click on color fields to open a color picker
3. **Adjust typography**: Use dropdown menus to change fonts and sizes
4. **Preview changes**: All changes are applied immediately
5. **Reset if needed**: Use the "Reset to default" button to revert all changes

Your preferences are automatically saved to your browser's local storage.

## Platform-Specific Instructions

### Linux Mint

#### Browser Requirements
- **Firefox (Recommended)**: Full compatibility with all theme features
- **Chromium/Chrome**: Full compatibility
- **Other browsers**: Basic functionality may work but isn't guaranteed

#### File Locations
If you're running Cozy Critters locally on Linux Mint:
- **Application files**: Usually in `~/CozyCritters/` or where you cloned the repository
- **Theme files**: `~/CozyCritters/client/src/index.css`
- **Component files**: `~/CozyCritters/client/src/components/theme/`

#### Development Setup
If you want to modify themes at the code level:
```bash
# Navigate to the project directory
cd ~/CozyCritters

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

#### Text Editor Recommendations
- **VS Code**: Best for development with extensions for CSS and TypeScript
- **Sublime Text**: Lightweight with good syntax highlighting
- **nano/vim**: For quick command-line edits

### Windows

#### Browser Requirements
- **Chrome/Edge (Recommended)**: Full compatibility with all theme features
- **Firefox**: Full compatibility
- **Internet Explorer**: Not supported

#### File Locations
If you're running Cozy Critters locally on Windows:
- **Application files**: Usually in `C:\Users\[Username]\CozyCritters\` or your chosen directory
- **Theme files**: `C:\Users\[Username]\CozyCritters\client\src\index.css`
- **Component files**: `C:\Users\[Username]\CozyCritters\client\src\components\theme\`

#### Development Setup
If you want to modify themes at the code level:
```cmd
# Navigate to the project directory
cd C:\Users\[Username]\CozyCritters

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

#### Text Editor Recommendations
- **VS Code**: Best for development with excellent Windows integration
- **Notepad++**: Free and lightweight for simple edits
- **Sublime Text**: Professional option with many features

## Built-in Theme Presets

### Default Theme
- **Best for**: General use, good readability
- **Colors**: Light background with green primary, warm secondary
- **Characteristics**: Balanced contrast, comfortable for extended use

### Dark Mode
- **Best for**: Low-light environments, reducing eye strain
- **Colors**: Dark background with light text
- **Characteristics**: High contrast while remaining comfortable

### Autism Awareness
- **Best for**: Users who prefer warm, calming colors
- **Colors**: Golden and warm orange tones
- **Characteristics**: Soft, non-aggressive color palette

### Sensory-Friendly
- **Best for**: Users sensitive to bright colors or high contrast
- **Colors**: Muted blues and grays with reduced contrast
- **Characteristics**: Low stimulation, gentle on the eyes

## Advanced: Manual Theme Editing

**Warning**: Manual editing requires basic knowledge of CSS and development tools. Always backup your files before making changes.

### Understanding the Theme System

Cozy Critters uses CSS custom properties (variables) for theming. All theme variables are defined in `client/src/index.css`.

#### Core Color Variables
```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(210 25% 7.8431%);
  --primary: hsl(124.2353 17.2840% 51.7647%);
  --secondary: hsl(47.0588 65.1515% 84.1176%);
  --accent: hsl(14.7059 69.1176% 63.5294%);
  /* ... more variables ... */
}
```

#### Typography Variables
```css
:root {
  --font-inter: 'Inter', sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
}
```

#### Spacing Variables
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Editing Theme Files

1. **Open the main CSS file**:
   - Location: `client/src/index.css`
   - Look for the `:root` section and theme class sections (`.dark`, `.autism-awareness`, etc.)

2. **Modify color values**:
   ```css
   /* Example: Change primary color to blue */
   --primary: hsl(200 80% 50%);
   ```

3. **Add new fonts**:
   ```css
   /* Add Google Fonts import at the top of the file */
   @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');
   
   /* Define the font variable */
   --font-roboto: 'Roboto', sans-serif;
   ```

4. **Test your changes**:
   - Save the file
   - Refresh your browser
   - Check that colors and fonts appear as expected

### Color Format Guide

Cozy Critters uses HSL (Hue, Saturation, Lightness) color format:
- **Hue**: 0-360 degrees (color wheel position)
- **Saturation**: 0-100% (color intensity)
- **Lightness**: 0-100% (brightness)

#### Common HSL Colors
```css
/* Red */    hsl(0 100% 50%)
/* Orange */ hsl(30 100% 50%)
/* Yellow */ hsl(60 100% 50%)
/* Green */  hsl(120 100% 50%)
/* Blue */   hsl(240 100% 50%)
/* Purple */ hsl(300 100% 50%)
```

#### Converting from Hex
If you have a hex color (like #3366CC), you can use online converters or browser developer tools to convert to HSL.

## Creating New Theme Presets

To create a completely new theme preset:

### Method 1: CSS Class (Recommended)

1. **Open `client/src/index.css`**

2. **Add a new theme class** after the existing ones:
   ```css
   .my-custom-theme {
     --background: hsl(210 20% 98%);
     --foreground: hsl(210 20% 15%);
     --primary: hsl(260 80% 60%);
     --secondary: hsl(320 60% 70%);
     --accent: hsl(45 90% 55%);
     /* ... define all other variables ... */
   }
   ```

3. **Update the theme context** in `client/src/contexts/theme-context.tsx`:
   ```typescript
   // Add your theme to the type
   type Theme = "light" | "dark" | "autism-awareness" | "my-custom-theme";
   
   // Add it to the validation in ThemeProvider
   if (stored === "light" || stored === "dark" || stored === "autism-awareness" || stored === "my-custom-theme") {
     return stored as Theme;
   }
   
   // Add it to the toggleTheme function
   const toggleTheme = () => {
     setTheme(prev => {
       if (prev === "light") return "dark";
       if (prev === "dark") return "autism-awareness";
       if (prev === "autism-awareness") return "my-custom-theme";
       return "light";
     });
   };
   ```

4. **Update the theme customizer** in `client/src/pages/ThemeCustomizer.tsx`:
   ```typescript
   // Add your theme to the preset options
   const presetOptions = [
     { label: "Default", value: "default", description: "Standard light theme" },
     { label: "Dark Mode", value: "dark", description: "Easy on sensitive eyes" },
     { label: "Autism Awareness", value: "autism-awareness", description: "Warm, calming golden tones" },
     { label: "My Custom Theme", value: "my-custom-theme", description: "Your custom description" },
     // ... other options
   ];
   ```

### Method 2: Using the Theme Editor

1. **Start with an existing preset** that's closest to what you want
2. **Use the theme customizer** to adjust colors, fonts, and spacing
3. **Note down your settings** for future reference
4. **Save your browser's localStorage** to preserve your custom theme

### Sharing Custom Themes

To share your custom theme with others:

1. **Export your CSS variables**:
   ```css
   .shared-theme-name {
     --background: hsl(your-values);
     --foreground: hsl(your-values);
     /* ... all your custom variables ... */
   }
   ```

2. **Share the CSS snippet** with installation instructions
3. **Consider creating a GitHub issue** in the Cozy Critters repository to suggest adding your theme as an official preset

## Troubleshooting

### Common Issues

#### Colors Not Changing
- **Check browser cache**: Hard refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Linux)
- **Verify CSS syntax**: Make sure all values are properly formatted
- **Check file save**: Ensure your changes were actually saved to the file

#### Fonts Not Loading
- **Check import statements**: Ensure Google Fonts imports are at the top of the CSS file
- **Verify font names**: Font names must match exactly, including quotes and case
- **Check network**: Some fonts may be blocked by ad blockers or network restrictions

#### Theme Not Persisting
- **Check browser settings**: Ensure localStorage is enabled
- **Clear browser data**: Sometimes corrupted localStorage needs to be cleared
- **Check for JavaScript errors**: Open browser developer tools and look for console errors

#### Development Server Issues
- **Port conflicts**: If localhost:5173 doesn't work, check if another service is using the port
- **Node.js version**: Ensure you're using Node.js 18 or later
- **Dependency issues**: Try deleting `node_modules` and running `npm install` again

### Platform-Specific Troubleshooting

#### Linux Mint
- **Permission issues**: Ensure you have write permissions to the theme files
- **File encoding**: Use UTF-8 encoding when saving CSS files
- **Case sensitivity**: Linux file systems are case-sensitive; check file and folder names

#### Windows
- **Path length limits**: Very long file paths can cause issues; try moving the project closer to the root
- **Antivirus interference**: Some antivirus software may block development servers
- **Line endings**: Git should handle this automatically, but CRLF vs LF can sometimes cause issues

### Getting Help

If you encounter issues not covered here:

1. **Check the browser console** for error messages
2. **Review the existing issues** in the GitHub repository
3. **Create a new issue** with:
   - Your operating system and browser
   - Exact error messages
   - Steps to reproduce the problem
   - Screenshots if applicable

## Backup and Restore

### Backing Up Your Themes

#### Browser Settings Backup
Your theme preferences are stored in your browser's localStorage. To backup:

1. **Open browser developer tools** (F12)
2. **Go to Application tab** → Storage → Local Storage
3. **Find entries starting with** `cozy-critter-theme`
4. **Copy the values** and save them in a text file

#### File-based Backup
If you've made manual edits:

1. **Copy the entire `client/src/index.css` file**
2. **Copy any modified component files**
3. **Store in a safe location** with a clear naming convention

### Restoring Themes

#### From Browser Backup
1. **Open browser developer tools**
2. **Navigate to localStorage**
3. **Recreate the saved entries** with their original values

#### From File Backup
1. **Replace the modified files** with your backup copies
2. **Restart the development server** if running locally
3. **Clear browser cache** to ensure changes take effect

### Version Control
If you're comfortable with Git:

```bash
# Create a branch for your theme changes
git checkout -b my-custom-themes

# Make your changes and commit them
git add client/src/index.css
git commit -m "Add my custom theme"

# Push to your fork for safekeeping
git push origin my-custom-themes
```

## Best Practices

### Accessibility Considerations
- **Maintain sufficient contrast** between text and background colors
- **Test with screen readers** if possible
- **Consider colorblind users** when choosing color combinations
- **Provide multiple ways to distinguish elements** (not just color)

### Performance Tips
- **Use CSS variables** instead of hardcoded values for consistency
- **Avoid complex gradients** or animations that might cause performance issues
- **Test on different devices** to ensure themes work well on various screen sizes

### Maintenance
- **Document your changes** with comments in the CSS
- **Test thoroughly** after browser updates
- **Keep backups** of working configurations
- **Update gradually** rather than making many changes at once

---

*This guide covers the essential aspects of theme editing in Cozy Critters. For developer-focused documentation, see [theme-customization.md](theme-customization.md). For questions or contributions, please visit the [GitHub repository](https://github.com/ShiningVenus/CozyCritters).*