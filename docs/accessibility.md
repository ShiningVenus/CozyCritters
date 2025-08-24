# Accessibility Notes

Cozy Critter aims to provide an inclusive experience for all users, with special attention to neurodivergent accessibility needs.

## Features

### Core Accessibility
- Built with Radix UI for ARIA and keyboard support
- Mobile-first responsive design
- Screen reader labels on core components
- Respects motion and contrast preferences
- Skip links for keyboard navigation
- High contrast mode support
- Proper focus management with visible indicators

### ND-Friendly Features
- **Four specialized themes**:
  - Default: Standard light theme
  - Dark Mode: Reduced eye strain for light sensitivity
  - Autism Awareness: Warm, calming golden tones
  - Sensory-Friendly: Low contrast, muted colors for sensory comfort
- **Font size controls**: 14px to 20px options for better readability
- **Spacing controls**: Compact to Spacious options for visual comfort
- **Persistent user preferences**: Settings saved locally
- **Clear, descriptive help text** for all interactive elements
- **No forced positivity** or invalidating messaging
- **Gentle color palettes** designed to avoid sensory overwhelm

### Mobile Accessibility
- Touch targets meet 44px minimum size on mobile
- Improved radio button scaling for easier interaction
- Responsive spacing adjustments for different screen sizes
- Mobile-optimized navigation

## Testing

- Basic checks are available by running `node scripts/accessibility-test.ts`
- A manual audit script is available: open the app in development and run `runAccessibilityAudit()` in the browser console
- Theme customizer allows real-time testing of accessibility preferences

## Color Contrast

All themes have been designed to meet WCAG contrast requirements:
- Default and Dark themes: Standard contrast ratios
- Autism Awareness theme: Enhanced warm contrast for better readability
- Sensory-Friendly theme: Gentle contrast that's still accessible

## Limitations

- Comprehensive skip link and color contrast reviews are ongoing
- Please report accessibility issues via GitHub issues
- Some advanced features may need further testing with assistive technologies

## Future Improvements

- Enhanced keyboard shortcuts
- More granular motion controls
- Additional sensory-friendly themes
- Voice control integration testing
