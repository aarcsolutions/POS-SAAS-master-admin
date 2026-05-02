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
    <div className="p-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#2e3a49] tracking-tight">
          {mode === 'create' ? 'Create New Permission' : mode === 'edit' ? 'Edit Permission' : 'Permission Details'}
        </h1>
        <p className="text-[15px] text-[#94a3b4] mt-1">
          {mode === 'create' ? 'Define system identity and module association for new access level.' : 'Modify or review permission configuration.'}
        </p>
      </div>

      {/* Main Single Form Container */}
      <div className="bg-white rounded-2xl border border-[#eef2f6] shadow-[0_20px_50px_rgba(30,64,120,0.04)] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
          {/* Two-Column Masonry-style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left Column */}
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Permission Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. system.auth.login"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    readOnly={isReadOnly}
                    className={`w-full pl-5 pr-12 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[14px] font-medium text-[#2e3a49] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 transition-all ${isReadOnly ? 'opacity-80' : 'hover:border-[#cbd5e1]'}`}
                  />
                  <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b4]" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Assign Action</label>
                <div className="flex flex-wrap gap-3">
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
                        className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all border shadow-sm ${
                          isSelected 
                          ? 'bg-[#2e4fd5] border-[#2e4fd5] text-white' 
                          : 'bg-white border-[#eef2f6] text-[#64748b] hover:border-[#cbd5e1]'
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
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Module Group (Multi-Select)</label>
                <div className={`p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl min-h-[54px] flex flex-wrap gap-2 transition-all ${isReadOnly ? 'opacity-80' : 'hover:border-[#cbd5e1]'}`}>
                  {formData.modules.length === 0 && <span className="text-[#94a3b4] text-[14px] px-1">Select one or more modules...</span>}
                  {formData.modules.map((m: string) => (
                    <span key={m} className={`px-3 py-1 flex items-center gap-2 rounded-lg text-[12px] font-bold border ${isReadOnly ? 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]' : 'bg-[#3758d5] text-white border-[#3758d5]'}`}>
                      {m}
                      {!isReadOnly && <X className="h-3 w-3 cursor-pointer" onClick={() => toggleModule(m)} />}
                    </span>
                  ))}
                </div>
                
                {!isReadOnly && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {MODULES_LIST.filter(m => !formData.modules.includes(m)).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleModule(m)}
                        className="px-2.5 py-1.5 bg-[#fcfdfe] border border-[#eef2f6] rounded-lg text-[10px] font-bold text-[#64748b] hover:bg-[#f0f4ff] hover:text-[#3758d5] hover:border-[#3758d5] transition-all"
                      >
                        + {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Key Status</label>
                  <Info className="h-3.5 w-3.5 text-[#3758d5]" />
                </div>
                <div className="p-5 bg-[#f0f4ff]/50 border border-[#d7e1ff] rounded-2xl flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#3758d5] tracking-tight group-hover:text-[#2e4fd5] transition-colors">
                      {formData.name || 'UNNAMED_PERMISSION_KEY'}
                    </span>
                    <span className="text-[10px] text-[#94a3b4] font-medium mt-0.5 italic">Unique system identifier key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#3758d5] text-white px-3 py-1 rounded-full font-extrabold tracking-tighter uppercase">LOCKED</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Internal Description */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#2e3a49] uppercase tracking-wider">Internal Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              readOnly={isReadOnly}
              rows={5}
              placeholder="Provide context for system administrators about what this access point governs..."
              className={`w-full px-6 py-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[14px] leading-relaxed text-[#55606d] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 resize-none transition-all ${isReadOnly ? 'opacity-80' : 'hover:border-[#cbd5e1]'}`}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-10 border-t border-[#f1f5f9] flex justify-end items-center gap-4">
            <button 
              type="button" 
              onClick={handleCancelClick} 
              className="px-8 py-3 bg-[#e2e8f0] text-[#64748b] rounded-xl font-bold text-[14px] hover:bg-[#cbd5e1] transition-all"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 bg-[#2e4fd5] text-white rounded-xl font-bold text-[14px] hover:bg-[#2541c0] shadow-lg shadow-[#2e4fd5]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Permission' : 'Save Changes')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
