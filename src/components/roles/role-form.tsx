"use client";
import React, { useState } from 'react';
import { Shield, X, Loader2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';
import { useCreateRoleMutation, useUpdateRoleMutation } from '@/hooks/roles';

interface RoleFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: {
    id?: string;
    name: string;
    description: string;
    priority: number;
  };
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ mode, initialData, onClose, onSubmit }) => {
  const { setDraft, getDraft, clearDraft } = useFormDraftStore();
  const { setHasUnsavedChanges } = useUIStore();

  const FORM_ID = mode === 'create' ? 'role-create' : `role-edit-new`;

  const defaultData = React.useMemo(() => ({
    name: initialData?.name || '',
    desc: initialData?.description || '',
    priority: initialData?.priority || 4
  }), [initialData]);

  const [formData, setFormData] = React.useState(() => {
    if (mode !== 'view') {
      const savedDraft = getDraft(FORM_ID);
      if (savedDraft) return savedDraft;
    }
    return defaultData;
  });

  const [saving, setSaving] = React.useState(false);
  const isReadOnly = mode === 'view';

  const isDirty = React.useMemo(() => {
    if (isReadOnly) return false;
    return JSON.stringify(formData) !== JSON.stringify(defaultData);
  }, [formData, defaultData, isReadOnly]);

  useUnsavedChanges(isDirty);

  React.useEffect(() => {
    if (!isReadOnly && isDirty) {
      setDraft(FORM_ID, formData);
    } else if (!isDirty) {
      clearDraft(FORM_ID);
    }
  }, [formData, isDirty, isReadOnly, setDraft, clearDraft, FORM_ID]);

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync({ title: formData.name });
      } else if (mode === 'edit' && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, title: formData.name });
      }
      
      clearDraft(FORM_ID);
      onClose();
    } catch (error: any) {
      // Error is handled in the hook's onError but we catch here to prevent onClose
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setHasUnsavedChanges(true, onClose);
    } else {
      onClose();
    }
  };

  const title = mode === 'create' ? 'Add New Role' : mode === 'edit' ? 'Edit Role' : 'View Role';
  const buttonText = mode === 'create' ? 'Create Role' : 'Save Changes';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">{title}</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">
          {mode === 'create' 
            ? 'Configure a new administrative role and define granular access levels for specialized personnel within the POS ecosystem.'
            : 'Modify the administrative role details and access parameters for the selected system profile.'}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-6 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <h2 className="mb-5 text-[15px] font-semibold text-[#2e3a49]">Role Details</h2>

        <form onSubmit={handleSubmit}>
          {/* Role Name */}
          <div className="mb-5">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Role Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              readOnly={isReadOnly}
              placeholder="e.g. Regional Manager"
              className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              readOnly={isReadOnly}
              rows={5}
              placeholder="Briefly describe the responsibilities and scope of this role..."
              className={`w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] p-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
            />
          </div>

          {/* System Priority */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">System Priority</label>
              <span className="rounded-full bg-[#f1edff] px-2 py-0.5 text-[11px] font-semibold text-[#7b6fdc]">Level {formData.priority}</span>
            </div>
            <div className="relative mt-2">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={formData.priority}
                disabled={isReadOnly}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                className={`w-full accent-[#2e4fd5] ${isReadOnly ? 'opacity-50 cursor-default' : ''}`}
              />
              <div className="mt-1 flex justify-between text-[11px] text-[#9aa7b4]">
                <span>Standard</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f1f5f9]">
            <button 
              type="button"
              onClick={handleCancelClick} 
              className="rounded-md bg-[#e5edf5] px-4 py-2 text-[13px] font-semibold text-[#516276] hover:bg-[#dfe7ef]"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button 
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : buttonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
