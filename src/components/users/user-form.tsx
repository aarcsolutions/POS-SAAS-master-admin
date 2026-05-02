"use client";
import React, { useState } from 'react';
import { Shield, X, Loader2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';

interface UserFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
  };
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ mode, initialData, onClose, onSubmit }) => {
  const { setDraft, getDraft, clearDraft } = useFormDraftStore();
  const { setHasUnsavedChanges } = useUIStore();

  const FORM_ID = mode === 'create' ? 'user-create' : `user-edit-${initialData?.id || 'new'}`;

  const defaultData = React.useMemo(() => ({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    password: '',
    role: initialData?.role || 'MANAGER',
    isActive: initialData?.status === 'Active' || mode === 'create'
  }), [initialData, mode]);

  const [formData, setFormData] = useState(() => {
    if (mode !== 'view') {
      const savedDraft = getDraft(FORM_ID);
      if (savedDraft) return savedDraft;
    }
    return defaultData;
  });

  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (onSubmit) onSubmit(formData);
      clearDraft(FORM_ID);
      notifySuccess(
        mode === 'create' ? 'User Added' : 'User Updated', 
        `The profile for "${formData.name}" was saved successfully.`
      );
      onClose();
    } catch (err: any) {
      notifyError('Operation Failed', err.message || 'We could not save the user detail at this time.');
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

  const title = mode === 'create' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'View User';
  const buttonText = mode === 'create' ? 'Create User' : 'Save Changes';

  return (
    <div className="p-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2e3a49]">{title}</h1>
        <p className="text-[15px] text-[#94a3b4] mt-2">
          {mode === 'create' 
            ? 'Create a new administrative account with specific roles and permissions.' 
            : 'Modify user account details and access roles within the system.'}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-[#eef2f6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-10 space-y-10">
            {/* Grid for Inputs */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#2e3a49]">Full Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="e.g. Alexander Sterling"
                  className={`w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
                />
              </div>

              {/* Work Email */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#2e3a49]">Work Email <span className="text-rose-500">*</span></label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="alex@platform.com"
                  className={`w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#2e3a49]">Phone Number (Optional)</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
                />
              </div>

              {/* Password */}
              {!isReadOnly && (
                <div className="space-y-3">
                  <label className="text-[13px] font-bold text-[#2e3a49]">Password {mode === 'create' && <span className="text-rose-500">*</span>}</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder={mode === 'edit' ? "Leave blank to keep current" : "••••••••••••"}
                      className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
                    />
                    <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b4]" />
                  </div>
                </div>
              )}

              {/* Role Dropdown */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#2e3a49]">Role</label>
                <div className="relative">
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    disabled={isReadOnly}
                    className={`w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
                  >
                    <option value="SUPER ADMIN">Super Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                  {!isReadOnly && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="h-4 w-4 text-[#94a3b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#2e3a49]">Status</label>
                <div className="flex items-center gap-4 py-3">
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
                  <span className="text-[14px] font-semibold text-[#2e3a49]">
                    {formData.isActive ? 'Active Account' : 'Inactive Account'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-10 py-8 bg-[#fcfdfe] border-t border-[#f1f5f9] flex justify-end gap-4">
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
                disabled={saving}
                className="inline-flex items-center px-8 py-3 bg-[#2e4fd5] text-white rounded-xl font-bold text-[14px] hover:bg-[#2541c0] shadow-lg shadow-[#2e4fd5]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {saving ? 'Saving...' : buttonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
