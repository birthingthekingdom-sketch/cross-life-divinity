import { useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

interface ContentProtectionProps {
  children: React.ReactNode;
  studentName?: string;
  className?: string;
}

/**
 * ContentProtection component wraps lesson content to prevent copying, screenshots, and unauthorized sharing
 * Features:
 * - Disables text selection and copying
 * - Adds student name watermark
 * - Disables right-click context menu
 * - Disables keyboard shortcuts (Ctrl+C, Cmd+C)
 * - Logs copy/screenshot attempts for trial users
 */
export function ContentProtection({ children, studentName, className = "" }: ContentProtectionProps) {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const displayName = studentName || user?.name || "Larry Fisher";

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Disable text selection
    const disableSelection = (e: Event) => {
      e.preventDefault();
    };

    // Disable right-click context menu
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts (Ctrl+C, Cmd+C)
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Ctrl+C or Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        return false;
      }
      // Ctrl+X or Cmd+X (cut)
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        e.preventDefault();
        return false;
      }
      // Ctrl+A or Cmd+A (select all)
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    contentElement.addEventListener("selectstart", disableSelection as EventListener);
    contentElement.addEventListener("contextmenu", disableContextMenu);
    contentElement.addEventListener("keydown", disableKeyboardShortcuts);
    contentElement.addEventListener("copy", disableSelection as EventListener);
    contentElement.addEventListener("cut", disableSelection as EventListener);

    // Apply CSS to prevent selection
    contentElement.style.userSelect = "none";
    (contentElement.style as any).webkitUserSelect = "none";
    (contentElement.style as any).msUserSelect = "none";
    (contentElement.style as any).MozUserSelect = "none";

    // Detect screenshot attempts (Ctrl+Shift+S, Cmd+Shift+4, etc.)
    const detectScreenshot = (e: KeyboardEvent) => {
      // Windows: Ctrl+Shift+S, Print Screen
      if ((e.ctrlKey && e.shiftKey && e.key === "s") || e.key === "PrintScreen") {
        e.preventDefault();
        logContentAccess("screenshot");
        return false;
      }
      // Mac: Cmd+Shift+4, Cmd+Shift+5
      if (e.metaKey && e.shiftKey && (e.key === "4" || e.key === "5")) {
        e.preventDefault();
        logContentAccess("screenshot");
        return false;
      }
    };

    contentElement.addEventListener("keydown", detectScreenshot);

    // Detect copy attempts
    const detectCopy = () => {
      logContentAccess("copy");
    };

    contentElement.addEventListener("copy", detectCopy);

    return () => {
      contentElement.removeEventListener("selectstart", disableSelection as EventListener);
      contentElement.removeEventListener("contextmenu", disableContextMenu);
      contentElement.removeEventListener("keydown", disableKeyboardShortcuts);
      contentElement.removeEventListener("copy", disableSelection as EventListener);
      contentElement.removeEventListener("cut", disableSelection as EventListener);
      contentElement.removeEventListener("keydown", detectScreenshot);
      contentElement.removeEventListener("copy", detectCopy);
    };
  }, []);

  // Log content access attempts (for trial tracking)
  const logContentAccess = (type: "copy" | "screenshot") => {
    // This could be sent to analytics or trial tracking endpoint
    console.log(`Content access attempt: ${type} by ${displayName}`);
  };

  return (
    <div
      ref={contentRef}
      className={`relative ${className}`}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      } as React.CSSProperties}
    >
      {/* Watermark */}
      <div
        className="fixed top-8 right-8 text-gray-400/20 text-xl font-semibold pointer-events-none z-0 transform -rotate-45"
        style={{
          fontSize: "24px",
          opacity: 0.15,
          whiteSpace: "nowrap",
        }}
      >
        {displayName}
      </div>

      {/* Content with watermark overlay */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle watermark text at bottom */}
      <div className="mt-8 pt-4 border-t border-gray-200/30 text-center text-xs text-gray-500/50">
        <p>This content is protected and licensed to {displayName}</p>
        <p>Unauthorized reproduction or distribution is prohibited</p>
      </div>
    </div>
  );
}
