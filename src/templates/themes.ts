// Theme configuration for all templates

export interface ThemeColors {
  // Main colors
  primary: string;        // Main accent (gold, silver, etc.)
  primaryDark: string;    // Darker shade of primary
  primaryLight: string;   // Lighter shade of primary
  
  // Background
  bgDark: string;         // Darkest background
  bgMedium: string;       // Medium background
  bgLight: string;        // Lightest background (for cards)
  bgGradientFrom: string;
  bgGradientVia: string;
  bgGradientTo: string;
  
  // Text
  textPrimary: string;    // Main text color
  textSecondary: string;  // Secondary/muted text
  textAccent: string;     // Accent text (usually same as primary)
  
  // UI Elements
  borderColor: string;
  buttonBg: string;
  buttonText: string;
  inputBg: string;
  inputBorder: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  colors: ThemeColors;
  // Pattern/texture
  patternOpacity: number;
  // Typography
  fontScript?: string;
  // Special features
  particleColor: string;
}

// Royal Maroon Theme - Traditional Indian Wedding
export const ROYAL_MAROON: ThemeConfig = {
  id: 'royal-maroon',
  name: 'Royal Maroon',
  description: 'Traditional Indian wedding theme with deep maroon and gold',
  thumbnail: '/themes/royal-maroon.jpg',
  colors: {
    primary: '#d4af37',
    primaryDark: '#8B6914',
    primaryLight: '#f5d67a',
    bgDark: '#1a0505',
    bgMedium: '#2a0000',
    bgLight: '#3a0000',
    bgGradientFrom: '#8B0000',
    bgGradientVia: '#5c0000',
    bgGradientTo: '#2a0000',
    textPrimary: '#f0d9b5',
    textSecondary: '#c9a86c',
    textAccent: '#d4af37',
    borderColor: '#d4af37',
    buttonBg: 'linear-gradient(to right, #8B6914, #d4af37)',
    buttonText: '#2a0000',
    inputBg: '#1a0505',
    inputBorder: 'rgba(212, 175, 55, 0.3)',
  },
  patternOpacity: 0.05,
  particleColor: '#d4af37',
};

// Royal Blue Theme - Elegant Blue and Silver
export const ROYAL_BLUE: ThemeConfig = {
  id: 'royal-blue',
  name: 'Royal Blue',
  description: 'Elegant theme with deep blue and silver accents',
  thumbnail: '/themes/royal-blue.jpg',
  colors: {
    primary: '#C0C0C0',
    primaryDark: '#808080',
    primaryLight: '#E8E8E8',
    bgDark: '#0a0a1a',
    bgMedium: '#0f1a3d',
    bgLight: '#1a2a5c',
    bgGradientFrom: '#1e3a8a',
    bgGradientVia: '#1e40af',
    bgGradientTo: '#0a0a1a',
    textPrimary: '#e0e7ff',
    textSecondary: '#a5b4fc',
    textAccent: '#C0C0C0',
    borderColor: '#C0C0C0',
    buttonBg: 'linear-gradient(to right, #808080, #C0C0C0)',
    buttonText: '#0a0a1a',
    inputBg: '#0a0a1a',
    inputBorder: 'rgba(192, 192, 192, 0.3)',
  },
  patternOpacity: 0.05,
  particleColor: '#C0C0C0',
};

// Sage Green Theme - Nature/Rustic Wedding
export const SAGE_GREEN: ThemeConfig = {
  id: 'sage-green',
  name: 'Sage Garden',
  description: 'Natural and earthy theme with sage green and cream',
  thumbnail: '/themes/sage-green.jpg',
  colors: {
    primary: '#9CAF88',
    primaryDark: '#6B8E5A',
    primaryLight: '#C5D5B5',
    bgDark: '#1a1f1a',
    bgMedium: '#2d3a2d',
    bgLight: '#3d4d3d',
    bgGradientFrom: '#4a5d4a',
    bgGradientVia: '#3a4d3a',
    bgGradientTo: '#1a1f1a',
    textPrimary: '#f5f5dc',
    textSecondary: '#c9c9a0',
    textAccent: '#9CAF88',
    borderColor: '#9CAF88',
    buttonBg: 'linear-gradient(to right, #6B8E5A, #9CAF88)',
    buttonText: '#1a1f1a',
    inputBg: '#1a1f1a',
    inputBorder: 'rgba(156, 175, 136, 0.3)',
  },
  patternOpacity: 0.04,
  particleColor: '#9CAF88',
};

// Blush Pink Theme - Romantic/Soft
export const BLUSH_PINK: ThemeConfig = {
  id: 'blush-pink',
  name: 'Blush Romance',
  description: 'Soft and romantic theme with blush pink and rose gold',
  thumbnail: '/themes/blush-pink.jpg',
  colors: {
    primary: '#B76E79',
    primaryDark: '#8B5A5A',
    primaryLight: '#E8B4BC',
    bgDark: '#1a1215',
    bgMedium: '#2d1f24',
    bgLight: '#3d2d33',
    bgGradientFrom: '#5c3d47',
    bgGradientVia: '#4a2d37',
    bgGradientTo: '#1a1215',
    textPrimary: '#fde8ec',
    textSecondary: '#d4a5ad',
    textAccent: '#B76E79',
    borderColor: '#B76E79',
    buttonBg: 'linear-gradient(to right, #8B5A5A, #B76E79)',
    buttonText: '#1a1215',
    inputBg: '#1a1215',
    inputBorder: 'rgba(183, 110, 121, 0.3)',
  },
  patternOpacity: 0.04,
  particleColor: '#B76E79',
};

// Purple Elegance Theme
export const PURPLE_ELEGANCE: ThemeConfig = {
  id: 'purple-elegance',
  name: 'Purple Elegance',
  description: 'Luxurious purple theme with gold accents',
  thumbnail: '/themes/purple-elegance.jpg',
  colors: {
    primary: '#d4af37',
    primaryDark: '#8B6914',
    primaryLight: '#f5d67a',
    bgDark: '#120a1a',
    bgMedium: '#1f1030',
    bgLight: '#2d1a45',
    bgGradientFrom: '#4a1a6b',
    bgGradientVia: '#3a1055',
    bgGradientTo: '#120a1a',
    textPrimary: '#f0e0ff',
    textSecondary: '#c9a0e0',
    textAccent: '#d4af37',
    borderColor: '#d4af37',
    buttonBg: 'linear-gradient(to right, #8B6914, #d4af37)',
    buttonText: '#120a1a',
    inputBg: '#120a1a',
    inputBorder: 'rgba(212, 175, 55, 0.3)',
  },
  patternOpacity: 0.05,
  particleColor: '#d4af37',
};

// All available themes
export const THEMES: ThemeConfig[] = [
  ROYAL_MAROON,
  ROYAL_BLUE,
  SAGE_GREEN,
  BLUSH_PINK,
  PURPLE_ELEGANCE,
];

// Get theme by ID
export function getTheme(themeId: string): ThemeConfig {
  return THEMES.find(t => t.id === themeId) || ROYAL_MAROON;
}
