"use client";
import React, { useState } from 'react';
import { Plus, Download, Filter, MoreHorizontal, Search, Eye, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { SubscriptionForm } from '@/components/subscriptions/subscription-form';
import { SubscriptionSuccess } from '@/components/subscriptions/subscription-success';

const CUSTOM_PLANS = [
  { id: '1', businessName: 'Velocity Dynamics', planName: 'Enterprise Growth 2.0', amount: '$4,250.00', status: 'Published', active: true, badgeColor: 'bg-emerald-100 text-emerald-700', icon: 'V', iconColor: 'bg-indigo-100 text-indigo-600' },
  { id: '2', businessName: 'Nova Health Systems', planName: 'Precision Medical Tier', amount: '$1,890.00', status: 'In Review', active: false, badgeColor: 'bg-amber-100 text-amber-700', icon: 'N', iconColor: 'bg-fuchsia-100 text-fuchsia-600' },
  { id: '3', businessName: 'Lithium Labs', planName: 'Data Heavy Alpha', amount: '$12,400.00', status: 'Published', active: true, badgeColor: 'bg-emerald-100 text-emerald-700', icon: 'L', iconColor: 'bg-blue-100 text-blue-600' },
  { id: '4', businessName: 'Apex Retail Group', planName: 'Multi-outlet Standard Plus', amount: '$750.00', status: 'Archived', active: false, badgeColor: 'bg-slate-100 text-slate-700', icon: 'A', iconColor: 'bg-purple-100 text-purple-600' }
];

const STANDARD_PLANS = [
  { id: '1', tier: 'Starter', monthly: '$49.00', annual: '$490.00', count: '1,248', status: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700', icon: 'S', iconColor: 'bg-slate-100 text-slate-600' },
  { id: '2', tier: 'Business', monthly: '$199.00', annual: '$1,990.00', count: '856', status: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700', icon: 'B', iconColor: 'bg-indigo-100 text-indigo-600' },
  { id: '3', tier: 'Enterprise', monthly: '$499.00', annual: '$4,990.00', count: '312', status: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700', icon: 'E', iconColor: 'bg-blue-100 text-blue-600' }
];

export const SubscriptionList = () => {
  const [activeTab, setActiveTab] = useState('All Plans');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const handleOpenForm = (mode: 'create' | 'edit' | 'view', plan?: any) => {
    setFormMode(mode);
    setSelectedPlan(plan || null);
    setIsFormOpen(true);
  };

  const handleDeletePlan = (planName: string) => {
    if (confirm(`Are you sure you want to delete "${planName}"?`)) {
      console.log('Deleting plan:', planName);
    }
  };

  if (successData) {
    return (
      <SubscriptionSuccess
        data={successData}
        onViewSubscriptions={() => setSuccessData(null)}
      />
    );
  }

  if (isFormOpen) {
    return (
      <SubscriptionForm 
        mode={formMode}
        initialData={selectedPlan}
        onClose={() => setIsFormOpen(false)}
        onSuccess={(data) => setSuccessData(data)}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#2e3a49] tracking-tight">Subscription Plans</h1>
          <p className="text-[14px] text-[#94a3b4] mt-1">Manage subscription tiers, custom plans, and billing configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleOpenForm('create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e2e8f0] text-[#475569] rounded-lg font-bold text-[13px] hover:bg-[#f8fafc] transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create New Plan
          </button>
          <button 
             onClick={() => handleOpenForm('create')}
             className="flex items-center gap-2 px-5 py-2.5 bg-[#2e4fd5] text-white rounded-lg font-bold text-[13px] hover:bg-[#2541c0] shadow-md shadow-[#2e4fd5]/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Custom Plan
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#eef2f6] p-4 mb-6 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
          <input
            type="text"
            placeholder="Search by plan name, business, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-md text-[14px] text-[#475569] placeholder:text-[#94a3b4] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Tabs & Actions */}
      <div className="flex justify-between items-center mb-8 bg-white p-2 rounded-xl border border-[#eef2f6] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-1">
          {['All Plans', 'Standard', 'Custom', 'Drafts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all ${
                activeTab === tab 
                ? 'bg-[#f0f4ff] text-[#2e4fd5]' 
                : 'text-[#64748b] hover:text-[#2e3a49] hover:bg-[#f8fafc]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pr-2">
          <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-full appearance-none rounded-md border border-[#e7edf5] bg-[#eff4f9] pl-3 pr-8 text-[13px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20"
            >
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="In Review">In Review</option>
              <option value="Archived">Archived</option>
              <option value="Live">Live</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4] pointer-events-none" />
          </div>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
            className="flex items-center gap-2 px-3 py-2 text-[#64748b] hover:text-[#2e3a49] text-[13px] font-bold transition-colors"
          >
            <Filter className="h-4 w-4" />
            Clear
          </button>
          <div className="w-[1px] h-4 bg-[#e2e8f0]"></div>
          <button className="flex items-center gap-2 px-4 py-2 text-[#64748b] hover:text-[#2e3a49] text-[13px] font-bold transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Custom Plans Table */}
      <div className="bg-white rounded-2xl border border-[#eef2f6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-bold text-[#2e3a49]">Custom Client Plans</h2>
          <div className="flex items-center gap-4 text-[13px] font-bold text-[#64748b]">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> 24 Active</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span> 3 Pending</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[11px] font-extrabold text-[#94a3b4] uppercase tracking-wider">
                <th className="px-8 py-4">Business Name</th>
                <th className="px-8 py-4">Custom Plan Name</th>
                <th className="px-8 py-4">Monthly Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Active</th>
                <th className="px-8 py-4 w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {CUSTOM_PLANS.filter((plan) => {
                const matchesSearch = !searchTerm ||
                  plan.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  plan.status.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = !statusFilter || plan.status === statusFilter;
                return matchesSearch && matchesStatus;
              }).map((plan) => (
                <tr key={plan.id} className="hover:bg-[#fcfdfe] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[14px] ${plan.iconColor}`}>
                        {plan.icon}
                      </div>
                      <span className="font-bold text-[14px] text-[#2e3a49]">{plan.businessName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[14px] text-[#475569] font-semibold">{plan.planName}</td>
                  <td className="px-8 py-5 text-[14px] text-[#475569] font-extrabold">{plan.amount}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border ${plan.badgeColor} border-current/20`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${plan.active ? 'bg-[#3758d5]' : 'bg-[#e2e8f0]'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${plan.active ? 'translate-x-4' : 'translate-x-[2px]'}`} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <details className="relative inline-block">
                      <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1.5 text-[#94a3b4] hover:bg-[#f1f5f9] transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[14px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                        <button onClick={() => handleOpenForm('view', plan)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                          <Eye className="h-4 w-4 text-[#8a95a5]" /> View Details
                        </button>
                        <button onClick={() => handleOpenForm('edit', plan)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                          <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit Plan
                        </button>
                        <div className="my-1 border-t border-[#eef2f7]" />
                        <button onClick={() => handleDeletePlan(plan.planName)} className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">
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
        <div className="px-8 py-4 bg-[#fcfdfe] border-t border-[#f1f5f9] flex justify-between items-center text-[13px] text-[#64748b] font-medium">
          Showing 4 of 27 custom plans 
          <div className="flex gap-1">
            <button className="w-7 h-7 flex justify-center items-center rounded-md border border-[#e2e8f0] text-[#94a3b4] hover:bg-[#f8fafc] transition-colors">&lt;</button>
            <button className="w-7 h-7 flex justify-center items-center rounded-md border border-[#e2e8f0] text-[#94a3b4] hover:bg-[#f8fafc] transition-colors">&gt;</button>
          </div>
        </div>
      </div>

      {/* Standard Plans Table */}
      <div className="bg-white rounded-2xl border border-[#eef2f6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-bold text-[#2e3a49]">Standard Subscription Plans</h2>
          <div className="flex items-center text-[13px] font-bold text-[#64748b]">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> 3 Tiers Live</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[11px] font-extrabold text-[#94a3b4] uppercase tracking-wider">
                <th className="px-8 py-4">Plan Tier</th>
                <th className="px-8 py-4">Monthly Price</th>
                <th className="px-8 py-4">Annual Price</th>
                <th className="px-8 py-4">Subscriber Count</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {STANDARD_PLANS.filter((plan) => {
                const matchesSearch = !searchTerm ||
                  plan.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  plan.status.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = !statusFilter || plan.status === statusFilter;
                return matchesSearch && matchesStatus;
              }).map((plan) => (
                <tr key={plan.id} className="hover:bg-[#fcfdfe] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[14px] ${plan.iconColor}`}>
                        {plan.icon}
                      </div>
                      <span className="font-bold text-[14px] text-[#2e3a49]">{plan.tier}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[14px] text-[#475569] font-extrabold">{plan.monthly}</td>
                  <td className="px-8 py-5 text-[14px] font-bold text-[#3758d5] cursor-pointer hover:underline">{plan.annual}</td>
                  <td className="px-8 py-5 text-[14px] text-[#475569] font-semibold">{plan.count}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border ${plan.badgeColor} border-current/20`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <details className="relative inline-block">
                      <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1.5 text-[#94a3b4] hover:bg-[#f1f5f9] transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[14px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                        <button onClick={() => handleOpenForm('view', plan)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                          <Eye className="h-4 w-4 text-[#8a95a5]" /> View Details
                        </button>
                        <button onClick={() => handleOpenForm('edit', plan)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                          <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit Plan
                        </button>
                        <div className="my-1 border-t border-[#eef2f7]" />
                        <button onClick={() => handleDeletePlan(plan.tier)} className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">
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
        <div className="px-8 py-4 bg-[#fcfdfe] border-t border-[#f1f5f9] flex justify-between items-center text-[13px] text-[#64748b] font-medium">
          Showing 3 of 3 standard plans 
          <div className="flex gap-1">
            <button className="w-7 h-7 flex justify-center items-center rounded-md border border-[#e2e8f0] text-[#94a3b4] opacity-50 cursor-not-allowed">&lt;</button>
            <button className="w-7 h-7 flex justify-center items-center rounded-md border border-[#e2e8f0] text-[#94a3b4] opacity-50 cursor-not-allowed">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
