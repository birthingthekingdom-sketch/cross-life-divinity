/**
 * Color utility functions for course cards and UI elements
 */

// Function to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Function to convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Function to determine if a color is light or dark
export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Function to darken a color by reducing brightness
export function darkenColor(hex: string, percent: number = 30): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - (percent / 100);
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);
  
  return rgbToHex(r, g, b);
}

// Function to reduce saturation
export function desaturateColor(hex: string, percent: number = 40): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const gray = Math.round((rgb.r + rgb.g + rgb.b) / 3);
  const factor = 1 - (percent / 100);
  
  const r = Math.round(rgb.r * factor + gray * (percent / 100));
  const g = Math.round(rgb.g * factor + gray * (percent / 100));
  const b = Math.round(rgb.b * factor + gray * (percent / 100));
  
  return rgbToHex(r, g, b);
}

// Get a muted version of the color (darker and less saturated for better appearance)
export function getMutedColor(hex: string): string {
  return desaturateColor(darkenColor(hex, 20), 30);
}
