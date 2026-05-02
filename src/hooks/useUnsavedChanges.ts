"use client";

import { useEffect } from 'react';

/**
 * Custom Hook to handle Unsaved Changes Warn/Guard.
 * It strictly uses native browser events for refresh/close.
 * @param isDirty boolean - true if form has unsaved changes.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    // 1. Handling Browser Refresh / Tab Close (Native Behavior)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // The return string is needed for legacy browsers, modern browsers show a generic message
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
}
