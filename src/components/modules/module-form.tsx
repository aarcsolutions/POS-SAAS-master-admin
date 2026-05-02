"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Zap, X, Loader2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';

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
      await new Promise(resolve => setTimeout(resolve, 800));
      if (onSubmit) onSubmit(formData);
      clearDraft(FORM_ID); // Clear Drafts on Success
      notifySuccess(
        mode === 'create' ? 'Module Created' : 'Module Updated', 
        `The module settings for "${formData.name}" have been saved.`
      );
      onClose();
    } catch (err: any) {
      notifyError('Failed to Save', err.message || 'An error occurred while saving module configuration.');
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
    <div className="p-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2e3a49]">{title}</h1>
        <p className="text-[15px] text-[#94a3b4] mt-2">
          {mode === 'create' 
            ? 'Register a new system component and define its core parameters.' 
            : 'Update module configuration and system-level identifiers.'}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-[#eef2f6] shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-8">
            {/* Top Row: Name and Slug */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Module Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="e.g., Inventory Core"
                  className={`w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 ${isReadOnly ? 'opacity-80' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Slug</label>
                  {!isReadOnly && <span className="text-[10px] font-bold text-[#3758d5] uppercase tracking-wider">Read Only</span>}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.slug}
                    readOnly
                    className="w-full px-4 py-3 bg-[#eff4f8] border border-[#e2e8f0] rounded-lg text-[14px] text-[#2e4fd5] font-semibold focus:outline-none"
                  />
                  <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
                </div>
              </div>
            </div>

            {/* Description Row */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                readOnly={isReadOnly}
                placeholder="Brief explanation of module functionality..."
                rows={5}
                className={`w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 resize-none ${isReadOnly ? 'opacity-80' : ''}`}
              />
            </div>

            {/* Active Account Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-lg border border-[#e2e8f0] shadow-sm">
                  <Zap className="h-5 w-5 text-[#3758d5]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#2e3a49]">Active Status</div>
                  <div className="text-[12px] text-[#94a3b4]">Enable this module for global platform use immediately.</div>
                </div>
              </div>
              <div 
                onClick={() => !isReadOnly && setFormData({...formData, isActive: !formData.isActive})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isActive ? 'bg-[#3758d5]' : 'bg-[#e2e8f0]'
                } ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-[#fcfdfe] px-8 py-6 border-t border-[#f1f5f9] flex justify-end gap-3">
            <button 
              type="button"
              onClick={handleCancelClick}
              className="px-6 py-2.5 bg-[#e2e8f0] text-[#64748b] rounded-md font-bold text-[14px] hover:bg-[#cbd5e1] transition-all"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button 
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2.5 bg-[#3758d5] text-white rounded-md font-bold text-[14px] hover:bg-[#2f4fca] shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : (mode === 'create' ? 'Create Module' : 'Save Changes')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* System Note */}
      <div className="mt-8 relative pl-12 pr-6 py-6 bg-[#f8fafc] border-l-4 border-l-[#3758d5] rounded-xl">
        <div className="absolute left-4 top-6">
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#3758d5] text-[#3758d5] text-[12px] font-bold">i</div>
        </div>
        <div className="space-y-1">
          <span className="text-[13px] font-bold text-[#2e3a49]">System Note - </span>
          <span className="text-[13px] text-[#64748b]">Adding a new module will register it globally across the platform architecture.</span>
          <p className="text-[13px] text-[#64748b]">Ensure the unique slug matches the microservice identifier defined in the API gateway configuration.</p>
        </div>
      </div>
    </div>
  );
};
