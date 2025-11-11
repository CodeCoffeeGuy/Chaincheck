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
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) => {
  // Use ref to store latest shortcuts without causing effect to re-run
  const shortcutsRef = useRef<KeyboardShortcut[]>(shortcuts);
  const enabledRef = useRef<boolean>(enabled);
  
  // Update refs when values change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);
  
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabledRef.current) return;

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
      for (const shortcut of currentShortcuts) {
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
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // Empty deps - use refs for all values
};
