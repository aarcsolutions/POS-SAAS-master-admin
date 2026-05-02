"use client";
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { ModuleForm } from '@/components/modules/module-form';

interface ModuleItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | string;
  icon: any;
  color: string;
}

import { Package, Zap, CreditCard, Globe, Bell, BarChart3, RefreshCcw, Shield } from 'lucide-react';

const MOCK_MODULES: ModuleItem[] = [
  { id: 'mod_inv_091', name: 'Inventory Core', slug: 'inventory', description: 'Real-time sync.', version: 'v2.4.1', status: 'Active', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { id: 'mod_loy_112', name: 'Loyalty Rewards', slug: 'loyalty', description: 'Points & rewards.', version: 'v1.8.8', status: 'Active', icon: Zap, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'mod_pay_205', name: 'Payment Gateway', slug: 'payments', description: 'Multi-currency.', version: 'v3.2.8', status: 'Active', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'mod_api_552', name: 'Quick-Checkout API', slug: 'checkout-api', description: 'Optimized checkout.', version: 'v3.0.2', status: 'Inactive', icon: Globe, color: 'bg-orange-50 text-orange-600' },
  { id: 'mod_not_442', name: 'Notification Service', slug: 'notifications', description: 'Alerts & messaging.', version: 'v1.0.5', status: 'Active', icon: Bell, color: 'bg-sky-50 text-sky-600' },
  { id: 'mod_rep_004', name: 'Advanced Reporting', slug: 'reporting', description: 'Financial BI.', version: 'v2.1.5', status: 'Active', icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
  { id: 'mod_eng_881', name: 'Reporting Engine', slug: 'report-engine', description: 'Auto-reporting.', version: 'v4.0.0', status: 'Active', icon: RefreshCcw, color: 'bg-rose-50 text-rose-600' },
  { id: 'mod_sec_109', name: 'OAuth Shield', slug: 'auth-shield', description: 'JWT & Biometrics.', version: 'v1.1.0', status: 'Maintenance', icon: Shield, color: 'bg-slate-50 text-slate-600' },
];

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);

  const handleOpenForm = (mode: 'create' | 'edit' | 'view', module?: ModuleItem) => {
    setFormMode(mode);
    setSelectedModule(module || null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <ModuleForm 
        mode={formMode}
        initialData={selectedModule ? {
          id: selectedModule.id,
          name: selectedModule.name,
          slug: selectedModule.slug,
          description: selectedModule.description,
          status: selectedModule.status,
          version: selectedModule.version
        } : undefined}
        onClose={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2e3a49]">Modules</h1>
          <p className="text-[14px] text-[#94a3b4] mt-1">Manage system modules and platform features</p>
        </div>
        <button 
          onClick={() => handleOpenForm('create')}
          className="flex items-center gap-2 bg-[#3758d5] text-white px-4 py-2.5 rounded-md font-semibold text-[14px] shadow-sm hover:bg-[#2f4fca] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Module
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#eef2f6] p-4 mb-6 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
          <input 
            type="text" 
            placeholder="Search by module name or slug..."
            className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-[#f1f5f9] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#eef2f6] overflow-hidden shadow-sm mb-6">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="bg-[#fcfdfe] border-b border-[#f1f5f9] text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider">
              <th className="px-6 py-4 text-[10px]">Module Identity</th>
              <th className="px-6 py-4 text-[10px]">Description</th>
              <th className="px-6 py-4 text-[10px]">Version</th>
              <th className="px-6 py-4 text-[10px]">Status</th>
              <th className="px-6 py-4 text-right text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {MOCK_MODULES.map((module) => (
              <tr key={module.id} className="hover:bg-[#fcfdfe] transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all group-hover:scale-110 ${module.color}`}>
                      <module.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#2e3a49] group-hover:text-[#2e4fd5] transition-colors">{module.name}</div>
                      <div className="text-[11px] text-[#94a3b4] font-mono uppercase tracking-tighter">{module.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-[300px]">
                  <div className="text-[13px] text-[#55606d] truncate">{module.description}</div>
                </td>
                <td className="px-6 py-4 transition-all">
                  <span className="text-[11px] font-bold bg-[#f1f5f9] text-[#64748b] px-2 py-1 rounded group-hover:bg-[#3758d5] group-hover:text-white">
                    {module.version}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      module.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                      module.status === 'Maintenance' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                    <span className={`text-[12px] font-bold ${
                      module.status === 'Active' ? 'text-emerald-600' : 
                      module.status === 'Maintenance' ? 'text-amber-600' : 'text-[#64748b]'
                    }`}>
                      {module.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <details className="relative inline-block">
                    <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1.5 text-[#94a3b4] hover:bg-[#f1f5f9] transition-all">
                      <MoreHorizontal className="h-4 w-4" />
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[13px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                      <button onClick={() => handleOpenForm('view', module)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Eye className="h-4 w-4 text-[#8a95a5]" /> View Details
                      </button>
                      <button onClick={() => handleOpenForm('edit', module)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit Module
                      </button>
                      <div className="my-1 border-t border-[#eef2f7]" />
                      <button type="button" className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">
                        <Trash2 className="h-4 w-4" /> Deactivate
                      </button>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between text-[13px] text-[#94a3b4]">
        <div>Showing 1-{MOCK_MODULES.length} of 28 modules</div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-[#eef2f6] rounded-md hover:bg-white text-[#64748b] disabled:opacity-50 transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-md bg-[#3758d5] text-white font-bold shadow-sm">1</button>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">2</button>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">3</button>
          </div>
          <button className="p-2 border border-[#eef2f6] rounded-md hover:bg-white text-[#64748b] transition-all">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
