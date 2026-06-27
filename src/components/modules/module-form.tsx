"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Zap, X, Loader2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';
import { modulesApi } from '@/services/modules';

interface ModuleFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    description: string;
    version?: string;
    status: string;
  };
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({ mode, initialData, onClose, onSubmit }) => {
  const { setDraft, getDraft, clearDraft } = useFormDraftStore();
  const { setHasUnsavedChanges } = useUIStore();
  
  // Unique Draft ID depending on context
  const FORM_ID = mode === 'create' ? 'module-create' : `module-edit-${initialData?.id || 'new'}`;

  // Original pristine data
  const defaultData = useMemo(() => ({
    name: initialData?.name || '',
    slug: initialData?.slug || 'mod_new_' + Math.floor(Math.random() * 1000),
    description: initialData?.description || '',
    isActive: initialData?.status === 'Active' || mode === 'create'
  }), [initialData, mode]);

  // Try fetching draft on mount
  const [formData, setFormData] = useState(() => {
    if (mode !== 'view') {
      const savedDraft = getDraft(FORM_ID);
      if (savedDraft) return savedDraft;
    }
    return defaultData;
  });

  const [saving, setSaving] = useState(false);
  const isReadOnly = mode === 'view';

  // Dirty State Checker
  const isDirty = useMemo(() => {
    if (isReadOnly) return false;
    return JSON.stringify(formData) !== JSON.stringify(defaultData);
  }, [formData, defaultData, isReadOnly]);

  // Bind Browser refresh blocker
  useUnsavedChanges(isDirty);

  // Sync dirty draft to LocalStorage
  useEffect(() => {
    if (!isReadOnly && isDirty) {
      setDraft(FORM_ID, formData);
    } else if (!isDirty) {
      clearDraft(FORM_ID);
    }
  }, [formData, isDirty, isReadOnly, setDraft, clearDraft, FORM_ID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        is_active: formData.isActive
      };

      console.log('Module Form Payload:', payload);

      if (mode === 'create') {
        await modulesApi.create(payload);
      } else if (mode === 'edit' && initialData?.id) {
        await modulesApi.update(initialData.id, payload);
      }

      clearDraft(FORM_ID);
      notifySuccess(
        mode === 'create' ? 'Module Created' : 'Module Updated',
        `The module settings for "${formData.name}" have been saved.`
      );
      onClose();
    } catch (err: any) {
      console.error('Module save error:', err);
      notifyError('Failed to Save', err.response?.data?.message || err.message || 'An error occurred while saving module configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setHasUnsavedChanges(true, onClose);
    } else {
      onClose();
    }
  };

  const title = mode === 'create' ? 'Add New Module' : mode === 'edit' ? 'Edit Module' : 'View Module';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">{title}</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">
          {mode === 'create'
            ? 'Register a new system component and define its core parameters.'
            : 'Update module configuration and system-level identifiers.'}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-6 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <h2 className="mb-5 text-[15px] font-semibold text-[#2e3a49]">Module Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Top Row: Name and Slug */}
          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Module Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                readOnly={isReadOnly}
                placeholder="e.g., Inventory Core"
                className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Slug</label>
                {!isReadOnly && <span className="text-[10px] font-bold text-[#3758d5] uppercase tracking-wider">Read Only</span>}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#2e4fd5] font-semibold focus:outline-none"
                />
                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              readOnly={isReadOnly}
              placeholder="Brief explanation of module functionality..."
              rows={5}
              className={`w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] p-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 resize-none ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
            />
          </div>

          {/* Active Status Toggle */}
          <div className="mb-8 flex items-center justify-between rounded-md border border-[#e7edf5] bg-[#eff4f9] p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-[#3758d5]" />
              <div>
                <div className="text-[14px] font-bold text-[#2e3a49]">Active Status</div>
                <div className="text-[12px] text-[#94a3b4]">Enable this module for global platform use immediately.</div>
              </div>
            </div>
            <div
              onClick={() => !isReadOnly && setFormData({...formData, isActive: !formData.isActive})}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                formData.isActive ? 'bg-[#3758d5]' : 'bg-[#e2e8f0]'
              } ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                formData.isActive ? 'translate-x-4' : 'translate-x-[2px]'
              }`} />
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
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : (mode === 'create' ? 'Create Module' : 'Save Changes')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
