"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export function UnsavedChangesDialog() {
  const { hasUnsavedChanges, pendingUnsavedAction, clearUnsavedState } = useUIStore();

  if (!hasUnsavedChanges) return null;

  const handleDiscard = () => {
    if (pendingUnsavedAction) {
      pendingUnsavedAction();
    }
    clearUnsavedState();
  };

  const handleCancel = () => {
    // Keep working, just close dialog
    clearUnsavedState();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <AlertCircle className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Unsaved Changes</h2>
            <p className="text-sm text-slate-500">You have modified this form.</p>
          </div>
        </div>
        
        <p className="mb-6 text-sm text-slate-600">
          Continuing will discard any unsaved data. Are you sure you want to discard your changes and close this?
        </p>
        
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 sm:flex-none"
          >
            Keep Working
          </button>
          <button
            onClick={handleDiscard}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 sm:flex-none"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
