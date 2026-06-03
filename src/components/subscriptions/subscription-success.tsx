"use client";
import React from 'react';
import { CheckCircle2, ArrowLeft, LayoutDashboard, DollarSign, Users, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubscriptionSuccessProps {
  data: any;
  onViewSubscriptions: () => void;
}

export const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({ data, onViewSubscriptions }) => {
  const router = useRouter();
  const planName = data?.name || 'Enterprise Architect';
  const annualPrice = data?.annualPrice ? `$${data.annualPrice}.00` : '$2,499.00';
  const monthlyPrice = data?.monthlyPrice ? `$${data.monthlyPrice}.00` : '$249.00';
  const userSeats = data?.userSeats || 'Unlimited';
  const branchLicenses = data?.branchLicenses || 'Unlimited';
  const features = data?.features?.length ? data.features : [
    '10 TB Cloud Object Storage',
    'High-Priority API Throughput',
    'SOC2 Compliance Tier Monitoring',
  ];

  return (
    <div className="min-h-full">
      <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="max-w-[560px] mx-auto pt-2">
          {/* Success Header */}
          <div className="text-center mb-5">
            {/* Animated Check Circle */}
            <div className="relative mb-4 inline-flex">
              <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200">
                <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-[24px] font-bold text-[#1e293b] tracking-tight mb-1">
              Plan Successfully Launched
            </h1>
            <p className="text-[13px] text-[#64748b] leading-relaxed max-w-[400px] mx-auto">
              The <span className="font-semibold text-[#2e4fd5]">{planName}</span> plan is now live and available for provisioning.
            </p>
          </div>

          {/* Plan Summary Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
            {/* Card Header with gradient */}
            <div className="h-1 bg-gradient-to-r from-[#2e4fd5] via-[#6366f1] to-[#8b5cf6]"></div>

            <div className="p-5">
              {/* Plan Title Row */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef2ff] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4f46e5]">
                  Live Production Plan
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active</span>
                </div>
              </div>

              {/* Plan Name */}
              <h2 className="text-[18px] font-bold text-[#1e293b] text-center mb-4">
                {planName}
              </h2>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b4] mb-0.5">Monthly</div>
                  <div className="text-[15px] font-bold text-[#1e293b]">{monthlyPrice}</div>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b4] mb-0.5">Annual</div>
                  <div className="text-[15px] font-bold text-[#1e293b]">{annualPrice}</div>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b4] mb-0.5">Seats</div>
                  <div className="text-[15px] font-bold text-[#1e293b]">{userSeats}</div>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b4] mb-0.5">Branches</div>
                  <div className="text-[15px] font-bold text-[#1e293b]">{branchLicenses}</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b4] mb-2">Included Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.slice(0, 6).map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-[#f8fafc] px-3 py-2">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                      </div>
                      <span className="text-[12px] font-medium text-[#475569] truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewSubscriptions}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2e4fd5] text-white rounded-xl font-semibold text-[13px] hover:bg-[#2541c0] shadow-lg shadow-[#2e4fd5]/20 transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              View Active Subscriptions
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#e2e8f0] text-[#475569] rounded-xl font-semibold text-[13px] hover:bg-[#f8fafc] hover:border-[#cbd5e1] shadow-sm transition-all active:scale-[0.98]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
