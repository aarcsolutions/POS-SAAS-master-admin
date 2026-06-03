"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  PlusSquare, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Loader2,
  Trash2,
  Pencil,
  Eye,
  AlertCircle
} from 'lucide-react';
import { TenantWizard } from '@/components/tenants/tenant-wizard';
import { format } from 'date-fns';

const MOCK_TENANTS = [
  { id: '1', tenantName: 'Nova Logistics Corp', domain: 'nova-logistics', adminName: 'Marcus Chen', adminEmail: 'm.chen@nova-logistics.com', billingCycle: 'Annual', is_active: true, created_at: '2023-10-12T00:00:00Z' },
  { id: '2', tenantName: 'Vantage Analytics', domain: 'vantage-analytics', adminName: 'Sarah Blake', adminEmail: 's.blake@vantage.com', billingCycle: 'Monthly', is_active: true, created_at: '2024-01-04T00:00:00Z' },
  { id: '3', tenantName: 'Peak Solutions Ltd', domain: 'peak-solutions', adminName: 'James Okoro', adminEmail: 'j.okoro@peak.co.uk', billingCycle: 'Quarterly', is_active: true, created_at: '2024-02-28T00:00:00Z' },
  { id: '4', tenantName: 'Aurora Retail Group', domain: 'aurora-retail', adminName: 'Lisa Park', adminEmail: 'l.park@aurora.com', billingCycle: 'Annual', is_active: false, created_at: '2023-08-15T00:00:00Z' },
  { id: '5', tenantName: 'Meridian Health', domain: 'meridian-health', adminName: 'Dr. A. Patel', adminEmail: 'admin@meridian.health', billingCycle: 'Monthly', is_active: true, created_at: '2024-03-10T00:00:00Z' },
  { id: '6', tenantName: 'Summit Finance', domain: 'summit-finance', adminName: 'Robert West', adminEmail: 'r.west@summit.io', billingCycle: 'Annual', is_active: true, created_at: '2023-12-20T00:00:00Z' },
];

export const TenantList = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filteredTenants = MOCK_TENANTS.filter((t) =>
    !search ||
    t.tenantName.toLowerCase().includes(search.toLowerCase()) ||
    t.domain.toLowerCase().includes(search.toLowerCase()) ||
    t.adminName.toLowerCase().includes(search.toLowerCase()) ||
    t.adminEmail.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenWizard = (mode: 'create' | 'edit' | 'view', id?: string) => {
    setWizardMode(mode);
    setSelectedTenantId(id);
    setIsWizardOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete tenant "${name}"? This action cannot be undone.`)) {
      console.log('Delete tenant:', id);
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
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#2e3a49] tracking-tight">Tenant Management</h1>
          <p className="text-[14px] text-[#94a3b4] mt-1">Tenant oversight and infrastructure compliance monitoring.</p>
        </div>
        <button 
          onClick={() => handleOpenWizard('create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#3758d5] text-white rounded-lg font-bold text-[13px] hover:bg-[#2f4fca] shadow-md shadow-[#3758d5]/20 transition-all active:scale-95"
        >
          <PlusSquare className="h-4 w-4" />
          Onboard New Tenant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#eef2f6] p-4 mb-6 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-md text-[14px] text-[#475569] placeholder:text-[#94a3b4] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-[#eef2f6] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#fcfdfe] text-[12px] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#f1f5f9]">
                  <th className="px-6 py-4 w-[280px]">Business Name</th>
                  <th className="px-6 py-4 w-[240px]">Owner / Admin</th>
                  <th className="px-6 py-4 w-[160px]">Created at</th>
                  <th className="px-6 py-4 w-[180px]">Billing Cycle</th>
                  <th className="px-6 py-4 w-[140px]">Status</th>
                  <th className="px-6 py-4 w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex flex-shrink-0 items-center justify-center font-bold text-[14px] bg-indigo-50 text-indigo-600`}>
                          {tenant.tenantName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] text-[#2e3a49] leading-tight">{tenant.tenantName}</span>
                          <span className="text-[12px] font-medium text-[#94a3b4] mt-0.5">{tenant.domain}.pos-ms.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[14px] text-[#475569]">{tenant.adminName}</span>
                        <span className="text-[13px] text-[#94a3b4] mt-0.5">{tenant.adminEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[14px] text-[#475569]">
                        {tenant.created_at ? format(new Date(tenant.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#eef2ff] text-[#4f46e5]">
                        {tenant.billingCycle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tenant.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span className={`text-[12px] font-extrabold uppercase tracking-wide ${tenant.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tenant.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <details className="relative inline-block">
                        <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1.5 text-[#94a3b4] hover:bg-[#f1f5f9] transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[14px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                          <button onClick={() => handleOpenWizard('view', tenant.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                            <Eye className="h-4 w-4 text-[#8a95a5]" /> View Details
                          </button>
                          <button onClick={() => handleOpenWizard('edit', tenant.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                            <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit Tenant
                          </button>
                          <div className="my-1 border-t border-[#eef2f7]" />
                          <button onClick={() => handleDelete(tenant.id, tenant.tenantName)} className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#f1f5f9] flex justify-between items-center bg-white mt-auto">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-medium text-[#64748b]">Total Tenants: <span className="text-[#2e3a49] font-bold">{filteredTenants.length}</span></span>
          </div>

          <div className="flex items-center gap-6">
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
                disabled={page >= Math.ceil(filteredTenants.length / 10)}
                className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
