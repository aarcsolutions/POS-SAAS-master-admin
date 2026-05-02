"use client";
import React, { useState } from 'react';
import { Plus, Download, Filter, MoreVertical, Search, Bell, HelpCircle, Eye, Pencil, Trash2 } from 'lucide-react';
import { SubscriptionForm } from '@/components/subscriptions/subscription-form';

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

  const handleOpenForm = (mode: 'create' | 'edit' | 'view', plan?: any) => {
    setFormMode(mode);
    setSelectedPlan(plan || null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <SubscriptionForm 
        mode={formMode}
        initialData={selectedPlan}
        onClose={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* Top Navigation Search/Icons Simulation (Optional if layout handles it) */}
      <div className="flex justify-between items-center mb-10 h-10">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
          <input 
            type="text" 
            placeholder="Search across all systems..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9] border border-transparent rounded-lg text-[13px] text-[#475569] placeholder:text-[#94a3b4] focus:outline-none focus:bg-white focus:border-[#e2e8f0] transition-colors"
          />
        </div>
        <div className="flex items-center gap-4 text-[#64748b]">
          <Bell className="h-5 w-5 hover:text-[#2e3a49] cursor-pointer transition-colors" />
          <HelpCircle className="h-5 w-5 hover:text-[#2e3a49] cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[28px] font-bold text-[#2e3a49] tracking-tight">Subscription Plans</h1>
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
        <div className="flex items-center gap-2 pr-2">
          <button className="flex items-center gap-2 px-4 py-2 text-[#64748b] hover:text-[#2e3a49] text-[13px] font-bold transition-colors">
            <Filter className="h-4 w-4" />
            Filter
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
          <div className="flex items-center gap-4 text-[12px] font-bold text-[#64748b]">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> 24 Active</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span> 3 Pending</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[10px] font-extrabold text-[#94a3b4] uppercase tracking-wider">
                <th className="px-8 py-4">Business Name</th>
                <th className="px-8 py-4">Custom Plan Name</th>
                <th className="px-8 py-4">Monthly Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Active</th>
                <th className="px-8 py-4 w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {CUSTOM_PLANS.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#fcfdfe] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] ${plan.iconColor}`}>
                        {plan.icon}
                      </div>
                      <span className="font-bold text-[13px] text-[#2e3a49]">{plan.businessName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[13px] text-[#475569] font-semibold">{plan.planName}</td>
                  <td className="px-8 py-5 text-[13px] text-[#475569] font-extrabold">{plan.amount}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${plan.badgeColor} border-current/20`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${plan.active ? 'bg-[#3758d5]' : 'bg-[#e2e8f0]'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${plan.active ? 'translate-x-4' : 'translate-x-[2px]'}`} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-[#94a3b4] hover:text-[#3758d5] transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-[#fcfdfe] border-t border-[#f1f5f9] flex justify-between items-center text-[12px] text-[#64748b] font-medium">
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
          <div className="flex items-center text-[12px] font-bold text-[#64748b]">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> 3 Tiers Live</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[10px] font-extrabold text-[#94a3b4] uppercase tracking-wider">
                <th className="px-8 py-4">Plan Tier</th>
                <th className="px-8 py-4">Monthly Price</th>
                <th className="px-8 py-4">Annual Price</th>
                <th className="px-8 py-4">Subscriber Count</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {STANDARD_PLANS.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#fcfdfe] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] ${plan.iconColor}`}>
                        {plan.icon}
                      </div>
                      <span className="font-bold text-[13px] text-[#2e3a49]">{plan.tier}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[13px] text-[#475569] font-extrabold">{plan.monthly}</td>
                  <td className="px-8 py-5 text-[13px] font-bold text-[#3758d5] cursor-pointer hover:underline">{plan.annual}</td>
                  <td className="px-8 py-5 text-[13px] text-[#475569] font-semibold">{plan.count}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${plan.badgeColor} border-current/20`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-[#94a3b4] hover:text-[#3758d5] transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-[#fcfdfe] border-t border-[#f1f5f9] flex justify-between items-center text-[12px] text-[#64748b] font-medium">
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
