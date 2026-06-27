"use client";
import React, { useState, useEffect } from 'react';
import { Shield, X, Loader2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';
import { usersApi } from '@/services/users';
import { rolesApi } from '@/services/roles';

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
  const [roles, setRoles] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const FORM_ID = mode === 'create' ? 'user-create' : `user-edit-${initialData?.id || 'new'}`;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const data = await rolesApi.getAll() as any;
      setRoles(data.data?.roles || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  const getRoleIdByTitle = (title: string) => {
    const role = roles.find(r => r.title === title);
    return role?.id || '';
  };

  const defaultData = React.useMemo(() => ({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    password: '',
    role: initialData?.role || 'MANAGER',
    isActive: initialData?.status === 'Active' || mode === 'create'
  }), [initialData, mode, roles]);

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
      const roleId = getRoleIdByTitle(formData.role);

      if (mode === 'create') {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleId: roleId
        };
        await usersApi.create(payload);
      } else if (mode === 'edit' && initialData?.id) {
        const payload = {
          id: initialData.id,
          name: formData.name,
          email: formData.email,
          roleId: roleId
        };
        if (formData.password) {
          (payload as any).password = formData.password;
        }
        await usersApi.update(initialData.id, payload);
      }

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">{title}</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">
          {mode === 'create'
            ? 'Create a new administrative account with specific roles and permissions.'
            : 'Modify user account details and access roles within the system.'}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-6 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <h2 className="mb-5 text-[15px] font-semibold text-[#2e3a49]">User Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Grid for Inputs */}
          <div className="grid grid-cols-2 gap-6 mb-5">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                readOnly={isReadOnly}
                placeholder="e.g. Alexander Sterling"
                className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                readOnly={isReadOnly}
                placeholder="alex@platform.com"
                className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                readOnly={isReadOnly}
                placeholder="+1 (555) 000-0000"
                className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
              />
            </div>

            {/* Password */}
            {!isReadOnly && (
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={mode === 'edit' ? "Leave blank to keep current" : "••••••••••••"}
                    className="h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20"
                  />
                  <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
                </div>
              </div>
            )}

            {/* Role Dropdown */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Role</label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  disabled={isReadOnly}
                  className={`h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20 ${isReadOnly ? 'cursor-default opacity-80' : ''}`}
                >
                  <option value="SUPER ADMIN">Super Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="SUPPORT">Support</option>
                </select>
                {!isReadOnly && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-[#94a3b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                )}
              </div>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Status</label>
              <div className="flex items-center gap-3 h-11">
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
                <span className="text-[13px] font-semibold text-[#475569]">
                  {formData.isActive ? 'Active Account' : 'Inactive Account'}
                </span>
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
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : buttonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
