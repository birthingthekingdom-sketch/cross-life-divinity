/**
 * Haptic feedback utilities for mobile devices
 * Provides tactile feedback for user interactions
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

/**
 * Trigger haptic feedback on supported devices
 */
export function triggerHaptic(style: HapticStyle = 'light') {
  // Check if Vibration API is supported
  if (!('vibrate' in navigator)) {
    return;
  }

  // Map haptic styles to vibration patterns
  const patterns: Record<HapticStyle, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    selection: 5,
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [30, 100, 30, 100, 30]
  };

  const pattern = patterns[style];
  
  try {
    if (Array.isArray(pattern)) {
      navigator.vibrate(pattern);
    } else {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Silently fail if vibration is not supported or blocked
    console.debug('Haptic feedback not available:', error);
  }
}

/**
 * Add haptic feedback to button clicks
 */
export function addHapticToButton(element: HTMLElement, style: HapticStyle = 'light') {
  element.addEventListener('click', () => {
    triggerHaptic(style);
  }, { passive: true });
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    selection: () => triggerHaptic('selection'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error')
  };
}
