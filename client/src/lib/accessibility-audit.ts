// Accessibility Test Suite for Cozy Critters
// This is a basic accessibility validation script for manual testing

export function runAccessibilityAudit() {
  const issues: string[] = [];
  
  // Check for alt text on images
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });
  
  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (index === 0 && level !== 1) {
      issues.push('First heading should be h1');
    }
    if (level > lastLevel + 1) {
      issues.push(`Heading level jumps from h${lastLevel} to h${level}`);
    }
    lastLevel = level;
  });
  
  // Check for focus indicators
  const focusableElements = document.querySelectorAll(
    'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
  );
  
  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const id = input.id;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const label = id ? document.querySelector(`label[for="${id}"]`) : null;
    
    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Input ${index + 1} missing proper label`);
    }
  });
  
  // Check for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  if (skipLinks.length === 0) {
    issues.push('No skip links found for keyboard navigation');
  }
  
  // Check for aria-live regions for dynamic content
  const liveRegions = document.querySelectorAll('[aria-live]');
  
  // Check color contrast (basic check)
  const colorIssues = checkColorContrast();
  issues.push(...colorIssues);
  
  return {
    passed: issues.length === 0,
    issues,
    summary: {
      totalImages: images.length,
      totalHeadings: headings.length,
      totalFocusableElements: focusableElements.length,
      totalInputs: inputs.length,
      totalSkipLinks: skipLinks.length,
      totalLiveRegions: liveRegions.length
    }
  };
}

function checkColorContrast(): string[] {
  const issues: string[] = [];
  
  // Basic contrast check for common elements
  const textElements = document.querySelectorAll('p, span, button, input, textarea');
  
  textElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Basic check for transparent or same colors
    if (backgroundColor === color) {
      issues.push(`Element ${index + 1} may have insufficient color contrast`);
    }
  });
  
  return issues;
}

// Export for use in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).runAccessibilityAudit = runAccessibilityAudit;
}