import { create } from 'zustand';

interface Subscription {
  id: string;
  name: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: Date;
  endDate: Date;
  price: number;
  tenantId: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  createSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Add your fetch logic here
      const subscriptions: Subscription[] = [];
      set({ subscriptions, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions' 
      });
    }
  },

  createSubscription: async (subscription: Omit<Subscription, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      // Add your create logic here
      const newSubscription: Subscription = {
        ...subscription,
        id: Date.now().toString(),
      };
      set((state) => ({
        subscriptions: [...state.subscriptions, newSubscription],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create subscription'
      });
    }
  },

  updateSubscription: async (id: string, subscription: Partial<Subscription>) => {
    set({ isLoading: true, error: null });
    try {
      // Add your update logic here
      set((state) => ({
        subscriptions: state.subscriptions.map(sub => 
          sub.id === id ? { ...sub, ...subscription } : sub
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update subscription'
      });
    }
  },

  deleteSubscription: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Add your delete logic here
      set((state) => ({
        subscriptions: state.subscriptions.filter(sub => sub.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete subscription'
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
