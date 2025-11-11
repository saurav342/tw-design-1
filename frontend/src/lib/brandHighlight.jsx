import React from 'react';

/**
 * Highlights "Launch & Lift" brand name in text with solid color styling
 * @param {string} text - The text to process
 * @returns {React.ReactNode} - JSX with highlighted brand name
 */
export const highlightBrandName = (text) => {
  if (typeof text !== 'string') return text;
  
  // Match all variants: "Launch & Lift", "LaunchAndLift", "Launch&Lift", "Launch and Lift" (case insensitive)
  // Use a non-capturing group for split to preserve the matched text
  const brandPattern = /(Launch\s*[&]\s*Lift|LaunchAndLift|Launch&Lift|Launch\s+and\s+Lift)/gi;
  const parts = text.split(brandPattern);
  
  return parts.map((part, index) => {
    // Check if this part matches any variant of the brand name (case insensitive)
    // Use a new regex instance to avoid lastIndex issues
    const testPattern = /^Launch\s*[&]\s*Lift$|^LaunchAndLift$|^Launch&Lift$|^Launch\s+and\s+Lift$/i;
    if (testPattern.test(part)) {
      return (
        <span
          key={index}
          className="font-bold text-[#8b5cf6]"
        >
          Launch & Lift
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

/**
 * Replaces all variants of the brand name with standardized "Launch & Lift"
 * @param {string} text - The text to process
 * @returns {string} - Text with standardized brand name
 */
export const standardizeBrandName = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/LaunchAndLift/gi, 'Launch & Lift')
    .replace(/Launch&Lift/gi, 'Launch & Lift')
    .replace(/Launch and Lift/gi, 'Launch & Lift');
};

