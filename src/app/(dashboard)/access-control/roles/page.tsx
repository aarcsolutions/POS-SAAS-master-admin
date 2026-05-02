"use client";
import React, { useState } from 'react';
import { MoreHorizontal, Plus, Shield, BadgeCheck, Settings2, Users, Loader2, AlertCircle } from 'lucide-react';
import { RoleForm } from '@/components/roles/role-form';
import { RolePermissionsMapping } from '@/components/roles/role-permissions';
import { useRolesQuery, useDeleteRoleMutation } from '@/hooks/roles';
import { format } from 'date-fns';

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // Real data fetching
  const { data: response, isLoading, isError, error } = useRolesQuery({ page: 1, limit: 10 });
  const roles = response?.data?.roles || [];

  const handleOpenForm = (mode: 'create' | 'edit' | 'view', role?: any) => {
    setFormMode(mode);
    setSelectedRole(role ? {
      id: role.id,
      name: role.title,
      description: role.slug,
      priority: 1
    } : null);
    setIsFormOpen(true);
  };

  const deleteMutation = useDeleteRoleMutation();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the role "${title}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isFormOpen) {
    return (
      <RoleForm 
        mode={formMode}
        initialData={selectedRole}
        onClose={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#2e3a49]">Roles & Access Control</h1>
          <p className="mt-1 text-[13px] text-[#7a8594]">Manage system roles and granular permission mapping</p>
        </div>
        {activeTab === 'roles' && (
          <button 
            onClick={() => handleOpenForm('create')}
            className="inline-flex items-center gap-2 rounded-md bg-[#2e4fd5] px-3.5 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Role
          </button>
        )}
      </div>

      {/* Modern Tabs UI */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-[#f0f2f5] p-1">
        <button 
          onClick={() => setActiveTab('roles')}
          className={`rounded-md px-6 py-1.5 text-[13px] font-bold transition-all ${
            activeTab === 'roles' 
              ? 'bg-[#dce4ff] text-[#2e4fd5] shadow-sm' 
              : 'text-[#5a6a7a] hover:bg-white/50'
          }`}
        >
          Roles
        </button>
        <button 
          onClick={() => setActiveTab('permissions')}
          className={`rounded-md px-6 py-1.5 text-[13px] font-bold transition-all ${
            activeTab === 'permissions' 
              ? 'bg-[#dce4ff] text-[#2e4fd5] shadow-sm' 
              : 'text-[#5a6a7a] hover:bg-white/50'
          }`}
        >
          Role Permissions
        </button>
      </div>

      {activeTab === 'roles' ? (
        <>
          {/* Roles table */}
          <div className="rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_40px_rgba(30,64,120,0.06)] overflow-hidden min-h-[300px] flex flex-col">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a95a5] bg-[#fcfdfe] border-b border-[#f1f5f9]">
              <div className="col-span-6">Role Name</div>
              <div className="col-span-3">Created At</div>
              <div className="col-span-2">Permissions</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-[#7a8594]">
                <Loader2 className="h-8 w-8 animate-spin text-[#2e4fd5] mb-2" />
                <p className="text-[14px]">Fetching Roles...</p>
              </div>
            ) : isError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-[#d12d2d]">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="text-[14px] font-semibold">Failed to load roles</p>
                <p className="text-[12px] opacity-70">{(error as any)?.message || 'Service temporarily unavailable'}</p>
              </div>
            ) : roles.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-[#7a8594]">
                <Shield className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-[14px]">No roles found</p>
              </div>
            ) : (
              <div className="divide-y divide-[#eef2f7]">
                {roles.map((r: any, i) => (
                  <div key={r.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-[#fcfdfe] transition-colors group">
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f5f8] text-[#7a8594] group-hover:bg-[#eef2ff] group-hover:text-[#2e4fd5] transition-colors">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="text-[14px] font-semibold text-[#2e3a49]">{r.title}</div>
                    </div>
                    <div className="col-span-3 text-[13px] text-[#475569]">
                      {r.created_at ? format(new Date(r.created_at), 'MMM dd, yyyy') : '—'}
                    </div>
                    <div className="col-span-2">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#4053d3] bg-[#eef2ff]">Active Role</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <details className="relative inline-block">
                        <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1 text-[#6b7785] hover:bg-[#f2f6fb] hover:text-[#3e4754]">
                          <MoreHorizontal className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[13px] shadow-[0_16px_40px_rgba(30,64,120,0.12)]">
                          <button onClick={() => handleOpenForm('view', r)} className="w-full text-left block px-4 py-2 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">View</button>
                          <button onClick={() => handleOpenForm('edit', r)} className="w-full text-left block px-4 py-2 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">Edit</button>
                          <div className="my-1 border-t border-[#eef2f7]" />
                          <button 
                            type="button" 
                            onClick={() => handleDelete(r.id, r.title)} 
                            className="block w-full px-4 py-2 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]"
                          >
                            Delete
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Usage Analytics */}
          <div className="rounded-xl border border-[#e7edf5] bg-white p-5 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
            <h3 className="mb-4 text-[15px] font-semibold text-[#2e3a49]">Role Usage Analytics</h3>
            <p className="mb-6 text-[12px] text-[#8a95a5]">User distribution across defined roles within the platform ecosystem.</p>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Admin', value: 42, color: 'bg-[#dfe7ff] text-[#2e4fd5]' },
                { label: 'Owner', value: 22, color: 'bg-[#e9eef5] text-[#7a8594]' },
                { label: 'Manager', value: 31, color: 'bg-[#e9e6ff] text-[#6a5fd6]' },
                { label: 'Support', value: 5, color: 'bg-[#e8f3ff] text-[#2e7bd5]' },
              ].map((b, i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-28 w-full rounded-md ${b.color} relative overflow-hidden`}>
                    <div className="absolute bottom-2 left-2 text-[12px] font-semibold">{b.value}%</div>
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a95a5]">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <RolePermissionsMapping />
      )}
    </div>
  );
}
