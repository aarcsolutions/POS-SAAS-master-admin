"use client";
import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  MoreVertical, 
  PlusSquare, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Loader2,
  Trash2,
  Edit2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { TenantWizard } from '@/components/tenants/tenant-wizard';
import { useTenantsQuery, useDeleteTenantMutation } from '@/hooks/tenants';
import { format } from 'date-fns';

export const TenantList = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: response, isLoading, isError } = useTenantsQuery({ page, limit: 10, search });
  const tenants = response?.data?.tenants || [];
  const pagination = response?.data?.pagination;

  const deleteMutation = useDeleteTenantMutation();

  const handleOpenWizard = (mode: 'create' | 'edit' | 'view', id?: string) => {
    setWizardMode(mode);
    setSelectedTenantId(id);
    setIsWizardOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete tenant "${name}"? This action cannot be undone.`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isWizardOpen) {
    return (
      <TenantWizard 
        mode={wizardMode}
        tenantId={selectedTenantId}
        onClose={() => {
          setIsWizardOpen(false);
          setSelectedTenantId(undefined);
        }} 
      />
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#2e3a49] tracking-tight">Tenant Management</h1>
          <p className="text-[#64748b] text-[14px] mt-1">Tenant oversight and infrastructure compliance monitoring.</p>
        </div>
        <button 
          onClick={() => handleOpenWizard('create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#3758d5] text-white rounded-lg font-bold text-[13px] hover:bg-[#2f4fca] shadow-md shadow-[#3758d5]/20 transition-all active:scale-95"
        >
          <PlusSquare className="h-4 w-4" />
          Onboard New Tenant
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-3 mb-6 border border-[#eef2f6] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
            <input 
              type="text" 
              placeholder="Search by name, ID, or owner..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-transparent rounded-lg text-[13px] text-[#475569] placeholder:text-[#94a3b4] focus:outline-none focus:bg-white focus:border-[#e2e8f0] transition-colors"
            />
          </div>

          <button className="flex items-center justify-between gap-2 px-4 py-2 bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] rounded-lg text-[13px] font-semibold text-[#475569] transition-colors min-w-[130px]">
            <span>Status: All</span>
            <ChevronDown className="h-4 w-4 text-[#94a3b4]" />
          </button>
        </div>

        <button className="ml-3 flex items-center justify-center p-2.5 bg-[#3758d5] text-white rounded-lg hover:bg-[#2f4fca] transition-colors shadow-sm">
          <Filter className="h-4 w-4 fill-current" />
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-[#eef2f6] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#64748b]">
            <Loader2 className="h-10 w-10 animate-spin text-[#3758d5] mb-4" />
            <p className="font-bold">Syncing tenant data...</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-rose-500 p-10">
            <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
            <p className="font-bold text-lg">Infrastructure Link Failed</p>
            <p className="text-[13px] opacity-70">Unable to fetch tenant records from the control plane.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#fcfdfe] text-[11px] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">
                  <th className="px-6 py-4 w-[280px]">Business Name</th>
                  <th className="px-6 py-4 w-[240px]">Owner / Admin</th>
                  <th className="px-6 py-4 w-[160px]">Created at</th>
                  <th className="px-6 py-4 w-[180px]">Billing Cycle</th>
                  <th className="px-6 py-4 w-[140px]">Status</th>
                  <th className="px-6 py-4 w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex flex-shrink-0 items-center justify-center font-bold text-[14px] bg-indigo-50 text-indigo-600`}>
                          {tenant.tenantName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] text-[#2e3a49] leading-tight">{tenant.tenantName}</span>
                          <span className="text-[11px] font-medium text-[#94a3b4] mt-0.5">{tenant.domain}.pos-ms.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[13px] text-[#475569]">{tenant.adminName}</span>
                        <span className="text-[12px] text-[#94a3b4] mt-0.5">{tenant.adminEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[13px] text-[#475569]">
                        {tenant.created_at ? format(new Date(tenant.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-[#eef2ff] text-[#4f46e5]">
                        {tenant.billingCycle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tenant.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span className={`text-[11px] font-extrabold uppercase tracking-wide ${tenant.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tenant.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenWizard('view', tenant.id)}
                          className="p-2 text-[#94a3b4] hover:text-[#3758d5] hover:bg-[#f1f5f9] rounded-lg transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenWizard('edit', tenant.id)}
                          className="p-2 text-[#94a3b4] hover:text-[#3758d5] hover:bg-[#f1f5f9] rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tenant.id, tenant.tenantName)}
                          className="p-2 text-[#94a3b4] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && (
          <div className="px-6 py-4 border-t border-[#f1f5f9] flex justify-between items-center bg-white mt-auto">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-[#64748b]">Total Tenants: <span className="text-[#2e3a49] font-bold">{pagination.total}</span></span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-1 px-2">
                  <span className="h-9 min-w-[36px] flex items-center justify-center rounded-lg bg-[#3758d5] text-white font-bold text-[14px]">
                    {page}
                  </span>
                  {pagination.nextPage && (
                     <button onClick={() => setPage(page + 1)} className="h-9 min-w-[36px] flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] font-bold text-[14px]">
                       {page + 1}
                     </button>
                  )}
                </div>

                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                  className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
