import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  hasUnsavedChanges: boolean;
  pendingUnsavedAction: (() => void) | null;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setHasUnsavedChanges: (val: boolean, pendingAction?: (() => void) | null) => void;
  clearUnsavedState: () => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  hasUnsavedChanges: false,
  pendingUnsavedAction: null,

  setHasUnsavedChanges: (val, pendingAction = null) => {
    set({ hasUnsavedChanges: val, pendingUnsavedAction: pendingAction });
  },

  clearUnsavedState: () => {
    set({ hasUnsavedChanges: false, pendingUnsavedAction: null });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification]
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
}));
