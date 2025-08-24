// Accessibility Test Suite for Cozy Critters
// This is a basic accessibility validation script for manual testing

export interface AccessibilityAuditResult {
  passed: boolean;
  issues: string[];
  summary: {
    totalImages: number;
    totalHeadings: number;
    totalFocusableElements: number;
    totalInputs: number;
    totalSkipLinks: number;
    totalLiveRegions: number;
  };
}

/**
 * Check all images for alt text accessibility
 */
function checkImageAltText(): string[] {
  const issues: string[] = [];
  const images = document.querySelectorAll('img');
  
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });
  
  return issues;
}

/**
 * Check for proper heading hierarchy
 */
function checkHeadingHierarchy(): string[] {
  const issues: string[] = [];
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
  
  return issues;
}

/**
 * Check form inputs for proper labeling
 */
function checkFormLabels(): string[] {
  const issues: string[] = [];
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
  
  return issues;
}

/**
 * Check for keyboard navigation support
 */
function checkKeyboardNavigation(): string[] {
  const issues: string[] = [];
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  
  if (skipLinks.length === 0) {
    issues.push('No skip links found for keyboard navigation');
  }
  
  return issues;
}

/**
 * Check color contrast (basic implementation)
 */
function checkColorContrast(): string[] {
  const issues: string[] = [];
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

/**
 * Gather element counts for summary
 */
function getElementCounts() {
  const images = document.querySelectorAll('img');
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const focusableElements = document.querySelectorAll(
    'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
  );
  const inputs = document.querySelectorAll('input, textarea, select');
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  const liveRegions = document.querySelectorAll('[aria-live]');
  
  return {
    totalImages: images.length,
    totalHeadings: headings.length,
    totalFocusableElements: focusableElements.length,
    totalInputs: inputs.length,
    totalSkipLinks: skipLinks.length,
    totalLiveRegions: liveRegions.length
  };
}

/**
 * Main accessibility audit function - runs all checks
 */
export function runAccessibilityAudit(): AccessibilityAuditResult {
  const issues: string[] = [];
  
  // Run all accessibility checks
  issues.push(...checkImageAltText());
  issues.push(...checkHeadingHierarchy());
  issues.push(...checkFormLabels());
  issues.push(...checkKeyboardNavigation());
  issues.push(...checkColorContrast());
  
  return {
    passed: issues.length === 0,
    issues,
    summary: getElementCounts()
  };
}

// Export individual check functions for targeted testing
export {
  checkImageAltText,
  checkHeadingHierarchy,
  checkFormLabels,
  checkKeyboardNavigation,
  checkColorContrast,
  getElementCounts
};

// Export for use in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).runAccessibilityAudit = runAccessibilityAudit;
}