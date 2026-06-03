import { ArrowUpRight, Users, Activity, ShieldCheck, Banknote, BadgeInfo, MoreHorizontal } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">Platform Ecosystem</h1>
        <p className="mt-1 text-[13px] text-[#7a8594]">Real-time oversight of multi-tenant architecture and revenue performance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Tenants', value: '1,429', delta: '+12%', icon: Users },
          { label: 'Active Subs', value: '94.2%', sub: '882/936 • Enterprise tier', icon: Activity },
          { label: 'System Health', value: '99.9%', sub: 'All clusters operational', icon: ShieldCheck },
          { label: 'Platform Revenue', value: '$2.4M', sub: '+$140k • This quarter', icon: Banknote },
        ].map((c, idx) => (
          <div key={idx} className="rounded-xl border border-[#e7edf5] bg-white p-5 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#8a95a5]">{c.label}</span>
              <c.icon className="h-4 w-4 text-[#8a95a5]" />
            </div>
            <div className="flex items-end justify-between">
              <div className="text-[28px] font-semibold text-[#263443]">{c.value}</div>
              {c.sub ? (
                <div className="text-right text-[13px] text-[#6e7b8a]">{c.sub}</div>
              ) : (
                <div className="flex items-center gap-1 text-[13px] text-[#14b87a]">
                  <ArrowUpRight className="h-4 w-4" /> {c.delta}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Growth card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-0 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <h3 className="text-[15px] font-semibold text-[#2e3a49]">Platform Growth</h3>
            <p className="text-[13px] text-[#8a95a5]">Tenant onboarding vs. revenue scaling (6M window)</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[12px] font-semibold text-[#4053d3]">Revenue</span>
            <span className="rounded-full bg-[#e9f2ff] px-3 py-1 text-[12px] font-semibold text-[#2e7bd5]">Tenants</span>
          </div>
        </div>
        <div className="mt-4 h-[280px] w-full">
          {/* Simple gradient line placeholder */}
          <svg viewBox="0 0 600 200" className="h-full w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b5bdb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b5bdb" stopOpacity="0" />
              </linearGradient>
              <filter id="s" x="-10" y="-10" width="120%" height="120%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>
            <path d="M0 170 C 80 160, 140 140, 200 130 C 260 120, 320 120, 380 140 C 440 160, 520 190, 600 178" stroke="#3b5bdb" strokeWidth="3" fill="none" filter="url(#s)" />
            <path d="M0 170 C 80 160, 140 140, 200 130 C 260 120, 320 120, 380 140 C 440 160, 520 190, 600 178 L 600 200 L 0 200 Z" fill="url(#g)" />
          </svg>
        </div>
      </div>

      {/* Tenant Performance */}
      <div className="rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-[15px] font-semibold text-[#2e3a49]">Tenant Performance</h3>
          <div className="flex items-center gap-3 text-[13px] text-[#6e7b8a]">
            <button className="rounded-md border border-[#e7edf5] bg-[#f6f9fd] px-3 py-1">All Tiers</button>
            <button className="rounded-md border border-[#e7edf5] bg-white px-3 py-1">Export Data</button>
          </div>
        </div>
        <div className="divide-y divide-[#eef2f7]">
          {[
            { badge: 'NL', name: 'Nova Logistics Corp', id: 'ID • 1-92084', plan: 'Enterprise', date: 'Oct 12, 2023', volume: '1.2M API calls', health: 98 },
            { badge: 'VA', name: 'Vantage Analytics', id: 'ID • 08652', plan: 'Growth', date: 'Jan 04, 2024', volume: '840k API calls', health: 85 },
            { badge: 'P6', name: 'Peak Solutions Ltd', id: 'ID • 11408', plan: 'Enterprise', date: 'Feb 28, 2024', volume: '2.4M API calls', health: 94 },
          ].map((t, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-5 py-4">
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#eef2ff] text-[13px] font-bold text-[#4053d3]">{t.badge}</div>
                <div>
                  <div className="text-[14px] font-semibold text-[#2e3a49]">{t.name}</div>
                  <div className="text-[13px] text-[#8a95a5]">{t.id}</div>
                </div>
              </div>
              <div className="col-span-2">
                <span className="rounded-md bg-[#eef2ff] px-2 py-1 text-[12px] font-semibold text-[#4053d3]">{t.plan}</span>
              </div>
              <div className="col-span-2 text-[14px] text-[#475569]">{t.date}</div>
              <div className="col-span-2 text-[14px] text-[#475569]">{t.volume}</div>
              <div className="col-span-1 flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-[#e6eef7]">
                  <div className="h-1.5 rounded-full bg-[#2e4fd5]" style={{ width: `${t.health}%` }} />
                </div>
                <span className="text-[13px] text-[#6e7b8a]">{t.health}%</span>
                <button className="ml-auto text-[#9aa7b4]"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#eef2f7] px-5 py-3 text-[12px] text-[#8593a3]">Showing 3 of 1,429 tenants</div>
      </div>
    </div>
  );
}
