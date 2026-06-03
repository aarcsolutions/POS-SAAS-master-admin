"use client";
import React, { useState } from 'react';
import { Loader2, Sparkles, Banknote, CheckCircle2, MapPin, Users } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/notify';
import { useFormDraftStore } from '@/store/formDraftStore';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { useUIStore } from '@/store/uiStore';

interface SubscriptionFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onSuccess?: (data: any) => void;
}

const ENTITLEMENTS = [
  'Advanced Inventory Management',
  'Multi-branch Cloud Sync',
  'AI-Powered Revenue Forecasts',
  '24/7 Priority Concierge Support',
  'White-label POS Interface',
  'Custom API Webhooks'
];

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ mode, initialData, onClose, onSubmit, onSuccess }) => {
  const isReadOnly = mode === 'view';
  const { setDraft, getDraft, clearDraft } = useFormDraftStore();
  const { setHasUnsavedChanges } = useUIStore();

  const FORM_ID = mode === 'create' ? 'sub-plan-create' : `sub-plan-edit-${initialData?.id || 'new'}`;

  const defaultData = React.useMemo(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    monthlyPrice: initialData?.monthlyPrice || '',
    annualPrice: initialData?.annualPrice || '',
    features: initialData?.features || [],
    country: initialData?.country || '',
    city: initialData?.city || '',
    userSeats: initialData?.userSeats || '',
    branchLicenses: initialData?.branchLicenses || ''
  }), [initialData, mode]);

  const [formData, setFormData] = useState(() => {
    if (!isReadOnly) {
      const savedDraft = getDraft(FORM_ID);
      if (savedDraft) return savedDraft;
    }
    return defaultData;
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const handleCancelClick = () => {
    if (isDirty) {
      setHasUnsavedChanges(true, onClose);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Premium feel
      if (onSubmit) onSubmit(formData);
      if (onSuccess) onSuccess(formData);
      clearDraft(FORM_ID);
      notifySuccess(
        mode === 'create' ? 'Subscription Plan Created' : 'Subscription Plan Updated', 
        `The ${formData.name || 'plan'} has been successfully configured.`
      );
      onClose();
    } catch (err: any) {
      notifyError('Failed to Save', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = (feat: string) => {
    if (isReadOnly) return;
    setFormData((prev: any) => ({
      ...prev,
      features: prev.features.includes(feat) 
        ? prev.features.filter((f: string) => f !== feat) 
        : [...prev.features, feat]
    }));
  };

  return (
    <div className="min-h-full">
      <form onSubmit={handleSubmit} className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-10">
        
        {/* Header Block */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">
              {mode === 'create' ? 'Create Subscription Plan' : mode === 'edit' ? 'Edit Subscription Plan' : 'Subscription Details'}
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">Define structural constraints and commercial value for a new service level.</p>
          </div>

          <div className="flex gap-3">
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
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isLoading ? 'Processing...' : (mode === 'create' ? 'Launch Plan' : 'Save Changes')}
              </button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div>
          {/* Identity & Pitch */}
          <SectionWrapper icon={Sparkles} title="Identity & Pitch">
            <div className="space-y-6">
              <div>
                <InputLabel>Plan Name</InputLabel>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="e.g. Enterprise Global"
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#2e3a49] font-medium placeholder:text-[#94a3b4] placeholder:font-normal focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <InputLabel>Plan Description</InputLabel>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  readOnly={isReadOnly}
                  rows={3}
                  placeholder="Describe the core value proposition for this tier..."
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#2e3a49] font-medium placeholder:text-[#94a3b4] placeholder:font-normal focus:outline-none focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </SectionWrapper>

          {/* Revenue Model */}
          <SectionWrapper icon={Banknote} title="Revenue Model">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <InputLabel>Monthly Price ($)</InputLabel>
                <input 
                  type="number" 
                  value={formData.monthlyPrice}
                  onChange={e => setFormData({...formData, monthlyPrice: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="$ 0.00"
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#2e3a49] font-medium placeholder:text-[#94a3b4] placeholder:font-normal focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <InputLabel>Annual Price ($)</InputLabel>
                <input 
                  type="number" 
                  value={formData.annualPrice}
                  onChange={e => setFormData({...formData, annualPrice: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="$ 0.00"
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#2e3a49] font-medium placeholder:text-[#94a3b4] placeholder:font-normal focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>
          </SectionWrapper>

          {/* Entitlements & Features */}
          <SectionWrapper icon={CheckCircle2} title="Entitlements & Features">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {ENTITLEMENTS.map(feat => (
                <label key={feat} className={`flex items-center gap-3 ${isReadOnly ? 'opacity-80' : 'cursor-pointer hover:opacity-80'} transition-opacity`}>
                  <div className={`w-5 h-5 rounded border ${formData.features.includes(feat) ? 'bg-[#3758d5] border-[#3758d5]' : 'bg-white border-[#cbd5e1]'} flex items-center justify-center transition-colors shadow-sm`}>
                    {formData.features.includes(feat) && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[14px] font-medium text-[#475569]">{feat}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    disabled={isReadOnly}
                    checked={formData.features.includes(feat)}
                    onChange={() => toggleFeature(feat)}
                  />
                </label>
              ))}
            </div>
          </SectionWrapper>

          {/* Address */}
          <SectionWrapper icon={MapPin} title="Address">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <InputLabel>Country</InputLabel>
                <select 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#475569] font-medium focus:outline-none focus:bg-white transition-all appearance-none"
                >
                  <option value="">e.g. United states</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <div>
                <InputLabel>City</InputLabel>
                <select 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  disabled={isReadOnly}
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#475569] font-medium focus:outline-none focus:bg-white transition-all appearance-none"
                >
                  <option value="">City Name</option>
                  <option value="NY">New York</option>
                  <option value="LDN">London</option>
                  <option value="TOR">Toronto</option>
                </select>
              </div>
            </div>
          </SectionWrapper>

          {/* Operational Limits */}
          <SectionWrapper icon={Users} title="Operational Limits">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <InputLabel>User Seats</InputLabel>
                <input 
                  type="text" 
                  value={formData.userSeats}
                  onChange={e => setFormData({...formData, userSeats: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="e.g. 20.."
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#2e3a49] font-medium placeholder:text-[#94a3b4] placeholder:font-normal focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <InputLabel>Branch Licenses</InputLabel>
                <input 
                  type="text" 
                  value={formData.branchLicenses}
                  onChange={e => setFormData({...formData, branchLicenses: e.target.value})}
                  readOnly={isReadOnly}
                  placeholder="e.g. 05"
                  className="w-full px-4 py-3 bg-[#e2e8f0]/40 border border-[#e2e8f0] focus:border-[#cbd5e1] rounded-lg text-[15px] text-[#2e3a49] font-medium placeholder:text-[#94a3b4] placeholder:font-normal focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>
          </SectionWrapper>

        </div>
      </form>
    </div>
  );
};

const SectionWrapper = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl p-6 md:p-8 mb-6 border border-[#eef2f6] shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="h-5 w-5 text-[#3758d5]" />
      <h2 className="text-[16px] font-bold text-[#2e3a49]">{title}</h2>
    </div>
    {children}
  </div>
);

const InputLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
    {children}
  </label>
);
