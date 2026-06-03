"use client";
import React, { useState } from 'react';
import { Plus, X, Check, Shield, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';

interface PermissionFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const MODULES_LIST = [
  "Dashboard", "Invoices", "Quotations", "Service Details", "Products", "JobFiles",
  "Clients", "Subscription", "Dropdowns", "Users", "Permissions", "Modules", "Roles"
];

const BASE_ACTIONS = [
  { label: 'Create', key: 'CREATE' },
  { label: 'Read', key: 'READ' },
  { label: 'Update', key: 'UPDATE' },
  { label: 'Delete', key: 'DELETE' },
  { label: 'Read All', key: 'READALL' }
];

export const PermissionForm: React.FC<PermissionFormProps> = ({ mode, initialData, onClose, onSubmit }) => {
  const isReadOnly = mode === 'view';

  const { setDraft, getDraft, clearDraft } = useFormDraftStore();
  const { setHasUnsavedChanges } = useUIStore();

  const FORM_ID = mode === 'create' ? 'permission-create' : `permission-edit-${initialData?.id || 'new'}`;

  const defaultData = React.useMemo(() => ({
    name: initialData?.name || '',
    modules: initialData?.modules || (initialData?.module ? [initialData.module] : []),
    action: initialData?.actions || (initialData?.action ? [initialData.action] : []),
    description: initialData?.description || ''
  }), [initialData, mode]);

  const [formData, setFormData] = useState(() => {
    if (mode !== 'view') {
      const savedDraft = getDraft(FORM_ID);
      if (savedDraft) return savedDraft;
    }
    return defaultData;
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const toggleModule = (mod: string) => {
    if (isReadOnly) return;
    setFormData((prev: any) => ({
      ...prev,
      modules: prev.modules.includes(mod) 
        ? prev.modules.filter((m: string) => m !== mod) 
        : [...prev.modules, mod]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (onSubmit) onSubmit(formData);
      clearDraft(FORM_ID);
      notifySuccess(
        mode === 'create' ? 'Permission Created' : 'Permission Updated', 
        'The configuration has been successfully saved to the system.'
      );
    } catch (err: any) {
      notifyError('Failed to Save', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setHasUnsavedChanges(true, onClose);
    } else {
      onClose();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">
          {mode === 'create' ? 'Create New Permission' : mode === 'edit' ? 'Edit Permission' : 'Permission Details'}
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">
          {mode === 'create' ? 'Define system identity and module association for new access level.' : 'Modify or review permission configuration.'}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-6 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <h2 className="mb-5 text-[15px] font-semibold text-[#2e3a49]">Permission Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Permission Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. system.auth.login"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    readOnly={isReadOnly}
                    className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 pr-10 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
                  />
                  <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Assign Action</label>
                <div className="flex flex-wrap gap-2">
                  {BASE_ACTIONS.map(act => {
                    const isSelected = formData.action.includes(act.key);
                    return (
                      <button
                        key={act.key}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => {
                          const newActions = isSelected
                            ? formData.action.filter((a: string) => a !== act.key)
                            : [...formData.action, act.key];
                          setFormData({...formData, action: newActions})
                        }}
                        className={`px-4 py-2 rounded-md text-[12px] font-bold transition-all border ${
                          isSelected
                          ? 'bg-[#2e4fd5] border-[#2e4fd5] text-white'
                          : 'bg-white border-[#e7edf5] text-[#64748b] hover:border-[#cbd5e1]'
                        }`}
                      >
                        {act.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Module Group</label>
                <div className={`min-h-[44px] rounded-md border border-[#e7edf5] bg-[#eff4f9] p-2 flex flex-wrap gap-2 ${isReadOnly ? 'opacity-80' : ''}`}>
                  {formData.modules.length === 0 && <span className="text-[#94a3b4] text-[13px] px-1">Select one or more modules...</span>}
                  {formData.modules.map((m: string) => (
                    <span key={m} className={`px-2.5 py-1 flex items-center gap-1.5 rounded-md text-[11px] font-bold border ${isReadOnly ? 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]' : 'bg-[#3758d5] text-white border-[#3758d5]'}`}>
                      {m}
                      {!isReadOnly && <X className="h-3 w-3 cursor-pointer" onClick={() => toggleModule(m)} />}
                    </span>
                  ))}
                </div>

                {!isReadOnly && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {MODULES_LIST.filter(m => !formData.modules.includes(m)).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleModule(m)}
                        className="px-2 py-1 bg-white border border-[#eef2f6] rounded-md text-[10px] font-bold text-[#64748b] hover:bg-[#f0f4ff] hover:text-[#3758d5] hover:border-[#3758d5] transition-all"
                      >
                        + {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Key Status</label>
                <div className="flex items-center justify-between rounded-md border border-[#e7edf5] bg-[#eff4f9] p-3">
                  <span className="text-[13px] font-bold text-[#475569]">
                    {formData.name || 'UNNAMED_PERMISSION_KEY'}
                  </span>
                  <span className="text-[10px] bg-[#3758d5] text-white px-2 py-0.5 rounded-full font-extrabold uppercase">Locked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Internal Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              readOnly={isReadOnly}
              rows={5}
              placeholder="Provide context for system administrators about what this access point governs..."
              className={`w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] p-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 resize-none ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
            />
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
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Permission' : 'Save Changes')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
