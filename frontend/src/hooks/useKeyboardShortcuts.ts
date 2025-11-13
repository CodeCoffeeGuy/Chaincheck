import { useEffect, useRef } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

/**
 * Custom hook for keyboard shortcuts
 * @param shortcuts Array of keyboard shortcut definitions
 * @param enabled Whether shortcuts are enabled (default: true)
 */
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[] = [],
  enabled: boolean = true
) => {
  // Always call hooks unconditionally (Rules of Hooks)
  const shortcutsRef = useRef<KeyboardShortcut[]>(shortcuts || []);
  const enabledRef = useRef<boolean>(enabled);
  
  // Update refs when values change
  useEffect(() => {
    if (shortcuts && Array.isArray(shortcuts)) {
      shortcutsRef.current = shortcuts;
    }
  }, [shortcuts]);
  
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    // Early return if disabled
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Use ref to get latest shortcuts
      const currentShortcuts = shortcutsRef.current;
      if (!currentShortcuts || !Array.isArray(currentShortcuts)) {
        return;
      }

      for (const shortcut of currentShortcuts) {
        if (!shortcut || !shortcut.key) continue;

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        
        // Handle Cmd on Mac or Ctrl on Windows/Linux
        const modifierMatch =
          shortcut.ctrlKey || shortcut.metaKey
            ? event.ctrlKey || event.metaKey
            : !event.ctrlKey && !event.metaKey;
        
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatch && modifierMatch && shiftMatch && altMatch) {
          event.preventDefault();
          if (typeof shortcut.action === "function") {
            try {
              shortcut.action();
            } catch (error) {
              // Silently fail during HMR to prevent breaking the app
              if (import.meta.env.DEV) {
                console.warn('Keyboard shortcut action failed:', error);
              }
            }
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]); // Only re-run when enabled changes
};
