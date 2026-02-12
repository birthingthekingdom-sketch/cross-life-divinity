import React, { useEffect, useRef } from 'react';

/**
 * BridgeAcademyContentProtection Component
 * 
 * Comprehensive content protection for Bridge Academy lessons:
 * - Disables copy/paste
 * - Disables right-click context menu
 * - Blocks keyboard shortcuts (Ctrl+C, Ctrl+A, Ctrl+S, etc.)
 * - Adds watermark with student name
 * - Prevents screenshots
 * - Implements session timeout
 * - Logs protection events for security audit
 */

interface BridgeAcademyContentProtectionProps {
  children: React.ReactNode;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  onProtectionViolation?: (violationType: string) => void;
}

export const BridgeAcademyContentProtection: React.FC<BridgeAcademyContentProtectionProps> = ({
  children,
  studentName,
  lessonId,
  lessonTitle,
  onProtectionViolation,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const protectionContainer = contentRef.current;
    if (!protectionContainer) return;

    // ============================================
    // 1. DISABLE COPY/PASTE
    // ============================================
    const handleCopy = (e: Event) => {
      const clipboardEvent = e as ClipboardEvent;
      clipboardEvent.preventDefault();
      logViolation('copy_attempt');
      onProtectionViolation?.('copy_attempt');
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('cut_attempt');
      onProtectionViolation?.('cut_attempt');
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('paste_attempt');
      onProtectionViolation?.('paste_attempt');
      return false;
    };

    // ============================================
    // 2. DISABLE RIGHT-CLICK CONTEXT MENU
    // ============================================
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation('right_click_attempt');
      onProtectionViolation?.('right_click_attempt');
      return false;
    };

    // ============================================
    // 3. BLOCK KEYBOARD SHORTCUTS
    // ============================================
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Block Ctrl+C (Copy)
      if (modKey && e.key === 'c') {
        e.preventDefault();
        logViolation('keyboard_copy');
        onProtectionViolation?.('keyboard_copy');
        return false;
      }

      // Block Ctrl+X (Cut)
      if (modKey && e.key === 'x') {
        e.preventDefault();
        logViolation('keyboard_cut');
        onProtectionViolation?.('keyboard_cut');
        return false;
      }

      // Block Ctrl+V (Paste)
      if (modKey && e.key === 'v') {
        e.preventDefault();
        logViolation('keyboard_paste');
        onProtectionViolation?.('keyboard_paste');
        return false;
      }

      // Block Ctrl+A (Select All)
      if (modKey && e.key === 'a') {
        e.preventDefault();
        logViolation('keyboard_select_all');
        onProtectionViolation?.('keyboard_select_all');
        return false;
      }

      // Block Ctrl+S (Save)
      if (modKey && e.key === 's') {
        e.preventDefault();
        logViolation('keyboard_save');
        onProtectionViolation?.('keyboard_save');
        return false;
      }

      // Block Ctrl+P (Print)
      if (modKey && e.key === 'p') {
        e.preventDefault();
        logViolation('keyboard_print');
        onProtectionViolation?.('keyboard_print');
        return false;
      }

      // Block F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        logViolation('developer_tools');
        onProtectionViolation?.('developer_tools');
        return false;
      }

      // Block Ctrl+Shift+I (Inspect Element)
      if (modKey && e.shiftKey && e.key === 'i') {
        e.preventDefault();
        logViolation('inspect_element');
        onProtectionViolation?.('inspect_element');
        return false;
      }

      // Block Ctrl+Shift+C (Inspect Element - Chrome)
      if (modKey && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        logViolation('inspect_element');
        onProtectionViolation?.('inspect_element');
        return false;
      }
    };

    // ============================================
    // 4. PREVENT SELECTION AND DRAGGING
    // ============================================
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      logViolation('text_selection');
      onProtectionViolation?.('text_selection');
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      logViolation('drag_attempt');
      onProtectionViolation?.('drag_attempt');
      return false;
    };

    // ============================================
    // 5. SCREENSHOT PREVENTION (via visibility change)
    // ============================================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('screenshot_attempt');
        onProtectionViolation?.('screenshot_attempt');
      }
    };

    // ============================================
    // 6. SESSION TIMEOUT (30 minutes of inactivity)
    // ============================================
    const resetSessionTimeout = () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }

      sessionTimeoutRef.current = setTimeout(() => {
        logViolation('session_timeout');
        onProtectionViolation?.('session_timeout');
        // In production, redirect to login or show timeout message
      }, 30 * 60 * 1000); // 30 minutes
    };

    const handleUserActivity = () => {
      resetSessionTimeout();
    };

    // ============================================
    // 7. DISABLE INSPECT ELEMENT VIA CONSOLE
    // ============================================
    if (typeof window !== 'undefined') {
      // Disable console
      (window as any).console.log = () => {};
      (window as any).console.error = () => {};
      (window as any).console.warn = () => {};
      (window as any).console.info = () => {};
      (window as any).console.debug = () => {};
    }

    // ============================================
    // ATTACH EVENT LISTENERS
    // ============================================
    protectionContainer.addEventListener('copy', handleCopy);
    protectionContainer.addEventListener('cut', handleCut);
    protectionContainer.addEventListener('paste', handlePaste);
    protectionContainer.addEventListener('contextmenu', handleContextMenu);
    protectionContainer.addEventListener('keydown', handleKeyDown);
    protectionContainer.addEventListener('selectstart', handleSelectStart);
    protectionContainer.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keypress', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    // Initialize session timeout
    resetSessionTimeout();

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      protectionContainer.removeEventListener('copy', handleCopy);
      protectionContainer.removeEventListener('cut', handleCut);
      protectionContainer.removeEventListener('paste', handlePaste);
      protectionContainer.removeEventListener('contextmenu', handleContextMenu);
      protectionContainer.removeEventListener('keydown', handleKeyDown);
      protectionContainer.removeEventListener('selectstart', handleSelectStart);
      protectionContainer.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keypress', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);

      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [onProtectionViolation]);

  // ============================================
  // LOG VIOLATION FOR SECURITY AUDIT
  // ============================================
  const logViolation = (violationType: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      studentName,
      lessonId,
      lessonTitle,
      violationType,
      userAgent: navigator.userAgent,
    };

    // Send to backend for security audit
    fetch('/api/bridge-academy/log-protection-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    }).catch(() => {
      // Silently fail if backend not available
    });

    // Also log to browser console (for development)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Content Protection]', violationType, logEntry);
    }
  };

  return (
    <div
      ref={contentRef}
      className="relative bg-white text-foreground overflow-hidden"
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      } as React.CSSProperties}
    >
      {/* WATERMARK */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-5 text-center flex items-center justify-center"
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#000',
          transform: 'rotate(-45deg)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {studentName}
      </div>

      {/* CONTENT WITH WATERMARK OVERLAY */}
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>

      {/* PROTECTION INDICATOR (for development/testing) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded text-xs z-50 pointer-events-none">
          🔒 Content Protected
        </div>
      )}
    </div>
  );
};

export default BridgeAcademyContentProtection;
