"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { Building2, UserCircle, Settings, CreditCard, Check, ArrowRight, ArrowLeft, Loader2, Sparkles, ShieldCheck, FileCheck, Save, Eye } from 'lucide-react';
import { useWizard } from '@/hooks/use-wizard';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useTenantDetailsQuery, useCreateTenantMutation, useUpdateTenantMutation } from '@/hooks/tenants';

interface TenantWizardProps {
  onClose: () => void;
  mode?: 'create' | 'edit' | 'view';
  tenantId?: string;
}

const STEPSConfig = [
  { id: 1, title: 'Basic Information', subtitle: 'Tenant name, domain, and description', icon: Building2 },
  { id: 2, title: 'Master Admin', subtitle: 'Initial admin credentials setup', icon: UserCircle },
  { id: 3, title: 'Modules & Permissions', subtitle: 'Assign features and specific access', icon: ShieldCheck },
  { id: 4, title: 'Usage Boundaries', subtitle: 'Configure branches, seats, and regions', icon: Settings },
  { id: 5, title: 'Payment Setup', subtitle: 'Define billing cycle and custom amount', icon: CreditCard },
  { id: 6, title: 'Review & Launch', subtitle: 'Final summary before provisioning', icon: FileCheck },
];

export const TenantWizard: React.FC<TenantWizardProps> = ({ onClose, mode = 'create', tenantId }) => {
  const FORM_ID = 'tenant-wizard-draft';
  const { getDraft, setDraft, clearDraft } = useFormDraftStore();
  const { setHasUnsavedChanges } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isViewOnly = mode === 'view';
  const isEditMode = mode === 'edit';

  const defaultData = {
    tenantName: '',
    domain: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    modules: ['Dashboard'],
    permissions: {} as Record<string, string[]>,
    country: '',
    city: '',
    userSeats: '' as any,
    branchLicenses: '' as any,
    billingCycle: 'monthly',
    customAmount: '' as any,
  };

  // Fetch tenant data if editing or viewing
  const { data: tenantData, isLoading: isLoadingTenant } = useTenantDetailsQuery(tenantId || null);

  const createMutation = useCreateTenantMutation();
  const updateMutation = useUpdateTenantMutation();

  const initialLoad = useMemo(() => {
    if (tenantData?.data) return { ...defaultData, ...tenantData.data };
    
    // Only use draft in 'create' mode
    if (mode === 'create') {
      const draft = getDraft(FORM_ID);
      return draft ? { ...defaultData, ...draft } : defaultData;
    }
    
    return defaultData;
  }, [tenantData, mode]);

  const handleComplete = async (data: typeof defaultData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && tenantId) {
        await updateMutation.mutateAsync({ id: tenantId, payload: data });
      } else if (mode === 'create') {
        await createMutation.mutateAsync(data);
        clearDraft(FORM_ID);
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const wizard = useWizard({
    initialSteps: 6,
    initialData: initialLoad,
    onComplete: handleComplete,
  });

  const { currentStep, formData, updateData, nextStep, prevStep, isFirstStep, isLastStep, setFormData } = wizard;

  // Sync wizard data when tenant data arrives
  useEffect(() => {
    if (tenantData?.data) {
      setFormData(tenantData.data as any);
    }
  }, [tenantData, setFormData]);

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(defaultData) && !isViewOnly;
  }, [formData, defaultData, isViewOnly]);

  useUnsavedChanges(isDirty);

  useEffect(() => {
    if (mode === 'create') {
      if (isDirty) {
        setDraft(FORM_ID, formData);
      } else {
        clearDraft(FORM_ID);
      }
    }
  }, [formData, isDirty, setDraft, clearDraft, FORM_ID, mode]);

  const handleCancelClick = () => {
    if (isDirty) {
      setHasUnsavedChanges(true, onClose);
    } else {
      onClose();
    }
  };

  if (isLoadingTenant && (isEditMode || isViewOnly)) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-[#64748b]">
        <Loader2 className="h-10 w-10 animate-spin text-[#2e4fd5] mb-4" />
        <p className="font-bold">Fetching tenant particulars...</p>
      </div>
    );
  }

  const StepIcon = STEPSConfig[currentStep - 1].icon;
  const stepTitle = STEPSConfig[currentStep - 1].title;

  const headerTitle = isViewOnly ? 'View Tenant Particulars' : isEditMode ? 'Modify Tenant Profile' : 'Create New Tenant';
  const headerSubtitle = isViewOnly ? 'Reviewing full provisioning details' : isEditMode ? 'Updating live infrastructure compliance' : 'Provisioning a new isolated instance';

  return (
    <div className={`max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-500 ${isViewOnly ? 'pointer-events-none opacity-95' : ''}`}>
      
      <div className="flex justify-between items-start mb-8">
        <div className={isViewOnly ? 'pointer-events-auto' : ''}>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">{headerTitle}</h1>
          <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">{headerSubtitle}</p>
        </div>
        <button
          onClick={handleCancelClick}
          disabled={isSubmitting}
          className="rounded-md bg-[#e5edf5] px-4 py-2 text-[13px] font-semibold text-[#516276] hover:bg-[#dfe7ef] pointer-events-auto"
        >
          {isViewOnly ? 'Close' : 'Cancel'}
        </button>
      </div>

      <div className="flex gap-8 items-start">
        
        <div className="w-[300px] bg-white rounded-2xl p-6 shadow-sm border border-[#eef2f6] shrink-0 sticky top-6">
          <div className="space-y-8">
            {STEPSConfig.map((step, idx) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className="relative flex gap-4 cursor-default group">
                  {idx !== STEPSConfig.length - 1 && (
                    <div className={`absolute top-10 left-[19px] bottom-[-24px] w-0.5 ${isPast ? 'bg-[#3758d5]' : 'bg-[#e2e8f0]'}`} />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 shadow-sm z-10 
                    ${isActive ? 'bg-[#2e4fd5] border-[#2e4fd5] text-white shadow-[#2e4fd5]/30' 
                    : isPast ? 'bg-white border-[#3758d5] text-[#3758d5]' 
                    : 'bg-[#f8fafc] border-[#cbd5e1] text-[#94a3b4]'}`}
                  >
                    {isPast ? <Check className="w-5 h-5" strokeWidth={3} /> : <span className="text-[14px] font-bold">{step.id}</span>}
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className={`text-[14px] font-bold ${isActive || isPast ? 'text-[#2e3a49]' : 'text-[#94a3b4]'}`}>{step.title}</span>
                    <span className={`text-[12px] font-medium leading-tight mt-1 ${isActive ? 'text-[#64748b]' : 'text-[#cbd5e1]'}`}>{step.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6] min-h-[500px] flex flex-col">
          
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#f1f5f9]">
            <div className="p-3 bg-[#f0f4ff] rounded-xl text-[#3758d5]">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#2e3a49]">{stepTitle}</h2>
              <p className="text-[#94a3b4] text-[13px] font-medium mt-0.5">Please provide the required information below.</p>
            </div>
          </div>

          <div className="flex-1">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Tenant Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.tenantName}
                      onChange={e => updateData({ tenantName: e.target.value })}
                      placeholder="Enter tenant string name..."
                      className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] text-[#2e3a49] font-medium placeholder:font-normal focus:outline-none focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Domain (Optional)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.domain}
                        onChange={e => updateData({ domain: e.target.value })}
                        placeholder="e.g. yourbrand"
                        className="w-full pl-4 pr-28 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] text-[#2e3a49] font-medium focus:outline-none focus:bg-white transition-all text-right"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b4] font-semibold text-[13px]">.pos-ms.com</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => updateData({ description: e.target.value })}
                    placeholder="Enter a brief background or operational description for this tenant..."
                    className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] text-[#2e3a49] font-medium focus:outline-none focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Master Admin Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.adminName}
                    onChange={e => updateData({ adminName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] text-[#2e3a49] font-medium focus:outline-none focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Admin Email <span className="text-rose-500">*</span></label>
                    <input 
                      type="email" 
                      value={formData.adminEmail}
                      onChange={e => updateData({ adminEmail: e.target.value })}
                      placeholder="admin@tenant.com"
                      className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] text-[#2e3a49] font-medium focus:outline-none focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Temporary Password <span className="text-rose-500">*</span></label>
                    <input 
                      type="password" 
                      value={formData.adminPassword}
                      onChange={e => updateData({ adminPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] text-[#2e3a49] font-medium focus:outline-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 mt-4 bg-[#f8fafc] p-4 rounded-xl border border-[#eef2f6]">
                  <Sparkles className="w-5 h-5 text-[#3758d5] shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#64748b] font-medium leading-relaxed">
                    A setup link with this temporary password will automatically be sent to the admin email address provided above. Upon first login, they will be required to change it.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 fade-in">
                {['Dashboard', 'Invoices', 'Quotations', 'Products', 'Clients', 'Service Details'].map(mod => {
                  const isSelected = formData.modules.includes(mod);
                  const modPerms = formData.permissions[mod] || [];

                  return (
                    <div key={mod} className={`border rounded-2xl transition-colors overflow-hidden ${isSelected ? 'border-[#818cf8] bg-white shadow-sm' : 'border-[#e2e8f0] bg-[#f8fafc]'}`}>
                      <div 
                        onClick={() => {
                          const newMods = isSelected ? formData.modules.filter(m => m !== mod) : [...formData.modules, mod];
                          updateData({ modules: newMods });
                        }}
                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50"
                      >
                        <span className={`text-[14px] font-extrabold ${isSelected ? 'text-[#3758d5]' : 'text-[#475569]'}`}>{mod}</span>
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSelected ? 'bg-[#3758d5]' : 'bg-[#cbd5e1]'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isSelected ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="px-5 pb-5 pt-3 border-t border-[#f1f5f9] bg-[#fdfeff] animate-in slide-in-from-top-2 duration-300">
                          <p className="text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider mb-3">Allowed Actions for {mod}</p>
                          <div className="flex flex-wrap gap-2.5">
                            {['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT'].map(perm => {
                              const hasPerm = modPerms.includes(perm);
                              return (
                                <button
                                  key={perm}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newPerms = hasPerm ? modPerms.filter(p => p !== perm) : [...modPerms, perm];
                                    updateData({ permissions: { ...formData.permissions, [mod]: newPerms } });
                                  }}
                                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${hasPerm ? 'bg-[#eef2ff] text-[#3758d5] border-[#c7d2fe]' : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'}`}
                                >
                                  {perm}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Max User Seats <span className="text-[#3758d5] ml-1">*</span></span>
                    <input type="number" placeholder="e.g. 50" value={formData.userSeats} onChange={e => updateData({userSeats: e.target.value})} className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] font-bold text-[#2e3a49] focus:outline-none transition-all" />
                    <p className="text-[11px] text-[#94a3b4] mt-2">Maximum number of accounts they can create.</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Max Branches <span className="text-[#3758d5] ml-1">*</span></span>
                    <input type="number" placeholder="e.g. 5" value={formData.branchLicenses} onChange={e => updateData({branchLicenses: e.target.value})} className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] font-bold text-[#2e3a49] focus:outline-none transition-all" />
                    <p className="text-[11px] text-[#94a3b4] mt-2">Limit on physical or logical branches.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#f1f5f9]">
                  <div>
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Country Restriction</span>
                    <select value={formData.country} onChange={e => updateData({country: e.target.value})} className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] font-semibold text-[#475569] focus:outline-none appearance-none transition-all">
                      <option value="">Global / Any Country</option><option value="US">United States</option><option value="UK">United Kingdom</option><option value="PK">Pakistan</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2 block">City Restriction</span>
                    <input type="text" placeholder="e.g. New York (Leave blank for all)" value={formData.city} onChange={e => updateData({city: e.target.value})} className="w-full px-4 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-xl text-[14px] font-semibold text-[#475569] focus:outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 fade-in pt-2">
                
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-4">1. Select Billing Cycle</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'monthly', title: 'Monthly Billing', icon: '🗓️' },
                      { id: 'annually', title: 'Annual Billing', icon: '📅' },
                      { id: 'lumpsum', title: 'One-Time Lumpsum', icon: '💎' }
                    ].map(plan => (
                      <div 
                        key={plan.id}
                        onClick={() => updateData({ billingCycle: plan.id })}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                          formData.billingCycle === plan.id 
                          ? 'border-[#3758d5] bg-[#f0f4ff]' 
                          : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                        }`}
                      >
                        <div className="text-2xl mb-2">{plan.icon}</div>
                        <h3 className={`text-[13px] font-bold ${formData.billingCycle === plan.id ? 'text-[#3758d5]' : 'text-[#2e3a49]'}`}>{plan.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#f1f5f9]">
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-3">2. Set Custom Charge Amount <span className="text-rose-500">*</span></label>
                  <div className="relative max-w-[400px]">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[20px] font-black text-[#94a3b4]">$</span>
                    <input 
                      type="number" 
                      value={formData.customAmount}
                      onChange={e => updateData({ customAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border-2 border-[#e2e8f0] focus:border-[#3758d5] rounded-2xl text-[24px] font-black text-[#2e3a49] focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-[12px] text-[#94a3b4] mt-3 font-medium">This exact amount will be invoiced to the tenant based on the {formData.billingCycle} cycle.</p>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                <div className="grid grid-cols-2 gap-6 mb-2">
                  <div className="bg-[#f8fafc] p-6 rounded-2xl border border-[#eef2f6]">
                     <h4 className="text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider mb-3">Tenant Profile</h4>
                     <p className="text-[16px] font-black text-[#2e3a49]">{formData.tenantName || 'N/A'}</p>
                     <p className="text-[13px] font-semibold text-[#64748b] mt-1">{formData.domain || 'no-domain'}.pos-ms.com</p>
                  </div>
                  <div className="bg-[#f8fafc] p-6 rounded-2xl border border-[#eef2f6]">
                     <h4 className="text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider mb-3">Master Admin</h4>
                     <p className="text-[16px] font-black text-[#2e3a49]">{formData.adminName || 'N/A'}</p>
                     <p className="text-[13px] font-semibold text-[#64748b] mt-1">{formData.adminEmail || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-[#eef2f6] shadow-sm">
                  <h4 className="text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider mb-5">Provisioning Details</h4>
                  
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[14px] font-bold text-[#475569] capitalize">{formData.billingCycle} Subscription</span>
                    <span className="text-[24px] font-black text-[#3758d5]">${formData.customAmount || '0.00'}</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-5 border-y border-[#f1f5f9] text-center mb-5">
                     <div>
                       <p className="text-[10px] font-bold text-[#94a3b4] uppercase tracking-wider">Seats</p>
                       <p className="text-[15px] font-black text-[#2e3a49] mt-1">{formData.userSeats || '∞'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-[#94a3b4] uppercase tracking-wider">Branches</p>
                       <p className="text-[15px] font-black text-[#2e3a49] mt-1">{formData.branchLicenses || '∞'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-[#94a3b4] uppercase tracking-wider">Country</p>
                       <p className="text-[13px] font-bold text-[#2e3a49] mt-1.5">{formData.country || 'Global'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-[#94a3b4] uppercase tracking-wider">City</p>
                       <p className="text-[13px] font-bold text-[#2e3a49] mt-1.5">{formData.city || 'Any'}</p>
                     </div>
                  </div>

                  <div>
                     <p className="text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider mb-3">Selected Modules</p>
                     <div className="flex flex-wrap gap-2">
                        {formData.modules.length === 0 && <span className="text-[12px] text-[#64748b]">No active modules</span>}
                        {formData.modules.map(m => (
                          <span key={m} className="px-3 py-1 bg-[#f0f4ff] text-[#3758d5] border border-[#d7e1ff] rounded-lg text-[12px] font-bold">
                            {m} {formData.permissions[m]?.length ? `(${formData.permissions[m].length} perms)` : ''}
                          </span>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#f1f5f9] flex justify-between items-center mt-6 pointer-events-auto">
            <button
              onClick={prevStep}
              disabled={isFirstStep || isSubmitting}
              className="flex items-center gap-2 rounded-md bg-[#e5edf5] px-4 py-2 text-[13px] font-semibold text-[#516276] hover:bg-[#dfe7ef] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {!isLastStep ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && !formData.tenantName) return notifyError('Required Field', 'Tenant Name is mandatory.');
                  if (currentStep === 2 && (!formData.adminEmail || !formData.adminPassword)) return notifyError('Required Field', 'Admin Credentials are mandatory.');
                  if (currentStep === 4 && (!formData.userSeats || !formData.branchLicenses)) return notifyError('Usage Limit Required', 'Max Users and Branches are required.');
                  if (currentStep === 5 && !formData.customAmount) return notifyError('Payment Required', 'Please set a custom charge amount.');
                  nextStep();
                }}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] transition-all active:scale-95 disabled:opacity-70"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              !isViewOnly && (
                <button
                  onClick={() => handleComplete(formData)}
                  disabled={isSubmitting || (isEditMode && !isDirty)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] transition-all active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditMode ? <Save className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  {isSubmitting ? 'Processing...' : isEditMode ? 'Save Changes' : 'Launch Tenant'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
