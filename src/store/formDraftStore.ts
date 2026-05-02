import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FormDraftState {
  drafts: Record<string, any>;
  setDraft: (formId: string, data: any) => void;
  clearDraft: (formId: string) => void;
  getDraft: (formId: string) => any | null;
}

export const useFormDraftStore = create<FormDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      
      setDraft: (formId: string, data: any) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [formId]: data,
          },
        }));
      },
      
      clearDraft: (formId: string) => {
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[formId];
          return { drafts: newDrafts };
        });
      },
      
      getDraft: (formId: string) => {
        return get().drafts[formId] || null;
      },
    }),
    {
      name: 'form-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
