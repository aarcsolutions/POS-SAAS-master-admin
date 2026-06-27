"use client";
import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Shield, BadgeCheck, Settings2, Users, Search, Filter, Eye, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { RoleForm } from '@/components/roles/role-form';
import { RolePermissionsMapping } from '@/components/roles/role-permissions';
import { rolesApi } from '@/services/roles';
import { format } from 'date-fns';

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesApi.getAll({ page, limit: 100 }) as any;
      console.log('Roles API Response:', data);

      let rolesArray = [];
      if (Array.isArray(data)) {
        rolesArray = data;
      } else if (Array.isArray(data.data)) {
        rolesArray = data.data;
      } else if (data.data?.data && Array.isArray(data.data.data)) {
        rolesArray = data.data.data;
      } else if (data.data?.roles && Array.isArray(data.data.roles)) {
        rolesArray = data.data.roles;
      }

      const transformedRoles = rolesArray.map((role: any) => ({
        id: role.id,
        title: role.title,
        slug: role.slug,
        created_at: role.created_at,
        status: role.is_active ? 'Active' : 'Inactive'
      }));

      console.log('Transformed Roles:', transformedRoles);
      setRoles(transformedRoles);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the role "${title}"? This action cannot be undone.`)) {
      try {
        await rolesApi.delete(id);
        await fetchRoles();
      } catch (error) {
        console.error('Failed to delete role:', error);
        alert('Failed to delete role. Please try again.');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    fetchRoles();
  };

  if (isFormOpen) {
    return (
      <RoleForm
        mode={formMode}
        initialData={selectedRole}
        onClose={handleFormClose}
      />
    );
  }

  const filteredRoles = roles.filter((r) => {
    const matchesSearch = !searchTerm ||
      (r.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.slug?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#2e3a49]">Roles & Access Control</h1>
          <p className="text-[14px] text-[#94a3b4] mt-1">Manage system roles and granular permission mapping</p>
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
          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-[#eef2f6] p-4 mb-6 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
              <input
                type="text"
                placeholder="Search by role name..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white pl-4 pr-10 text-[13px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/10 focus:border-[#2e4fd5] transition-all shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            </div>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]"
            >
              <Filter className="h-4 w-4" />
              Clear
            </button>
          </div>

          {/* Roles table */}
          <div className="rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_40px_rgba(30,64,120,0.06)] overflow-hidden min-h-[300px] flex flex-col">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a95a5] bg-[#fcfdfe] border-b border-[#f1f5f9]">
              <div className="col-span-6">Role Name</div>
              <div className="col-span-3">Created At</div>
              <div className="col-span-2">Permissions</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {filteredRoles.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-[#7a8594]">
                <Shield className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-[14px]">No roles found</p>
              </div>
            ) : (
              <div className="divide-y divide-[#eef2f7]">
                {paginatedRoles.map((r: any) => (
                  <div key={r.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-[#fcfdfe] transition-colors group">
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f5f8] text-[#7a8594] group-hover:bg-[#eef2ff] group-hover:text-[#2e4fd5] transition-colors">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="text-[14px] font-semibold text-[#2e3a49]">{r.title}</div>
                    </div>
                    <div className="col-span-3 text-[14px] text-[#475569]">
                      {r.created_at ? format(new Date(r.created_at), 'MMM dd, yyyy') : '—'}
                    </div>
                    <div className="col-span-2">
                      <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#4053d3] bg-[#eef2ff]">Active Role</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <details className="relative inline-block">
                        <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1 text-[#6b7785] hover:bg-[#f2f6fb] hover:text-[#3e4754]">
                          <MoreHorizontal className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[14px] shadow-[0_16px_40px_rgba(30,64,120,0.12)]">
                          <button onClick={() => handleOpenForm('view', r)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                            <Eye className="h-4 w-4 text-[#8a95a5]" /> View Details
                          </button>
                          <button onClick={() => handleOpenForm('edit', r)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                            <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit Role
                          </button>
                          <div className="my-1 border-t border-[#eef2f7]" />
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, r.title)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#f1f5f9] bg-white">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium text-[#64748b]">Total Roles: <span className="text-[#2e3a49] font-bold">{filteredRoles.length}</span></span>
              <span className="text-[14px] font-medium text-[#94a3b4]">|</span>
              <span className="text-[14px] font-medium text-[#64748b]">Page {page} of {totalPages}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1 px-2">
                <span className="h-9 min-w-[36px] flex items-center justify-center rounded-lg bg-[#3758d5] text-white font-bold text-[14px]">
                  {page}
                </span>
              </div>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
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
