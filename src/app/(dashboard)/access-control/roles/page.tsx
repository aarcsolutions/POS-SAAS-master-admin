import Link from 'next/link';
import { MoreHorizontal, Plus, Shield, BadgeCheck } from 'lucide-react';

export default function RolesPage() {
  const roles = [
    { name: 'Super Administrator', icon: <Shield className="h-4 w-4" />, created: 'Oct 12, 2023', perms: 142, color: 'text-[#4053d3] bg-[#eef2ff]' },
    { name: 'Business Owner', icon: <BadgeCheck className="h-4 w-4" />, created: 'Oct 24, 2023', perms: 84, color: 'text-[#4a6cd3] bg-[#ecf2ff]' },
    { name: 'Store Manager', icon: <Shield className="h-4 w-4" />, created: 'Nov 02, 2023', perms: 45, color: 'text-[#7b6fdc] bg-[#f1edff]' },
    { name: 'Support Agent', icon: <Shield className="h-4 w-4" />, created: 'Nov 15, 2023', perms: 28, color: 'text-[#2aa78a] bg-[#e9f7f2]' },
    { name: 'Technical Support', icon: <Shield className="h-4 w-4" />, created: 'Nov 20, 2023', perms: 15, color: 'text-[#3b82f6] bg-[#eaf3ff]' },
    { name: 'Compliance Officer', icon: <Shield className="h-4 w-4" />, created: 'Dec 01, 2023', perms: 32, color: 'text-[#22c55e] bg-[#e9f9ef]' },
    { name: 'Billing Manager', icon: <Shield className="h-4 w-4" />, created: 'Dec 05, 2023', perms: 22, color: 'text-[#fb923c] bg-[#fff1e8]' },
  ];

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#2e3a49]">Roles</h1>
          <p className="mt-1 text-[13px] text-[#7a8594]">Manage user roles and permissions</p>
        </div>
        <Link href="/access-control/roles/create" className="inline-flex items-center gap-2 rounded-md bg-[#2e4fd5] px-3.5 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3]">
          <Plus className="h-4 w-4" /> Add Role
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className="rounded-md bg-[#e9efff] px-3 py-1.5 text-[12px] font-semibold text-[#2e4fd5]">Roles</button>
        <a href="/access-control/permissions" className="rounded-md border border-[#e7edf5] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#718198] hover:bg-[#f8fbff]">Role Permissions</a>
      </div>

      {/* Roles table */}
      <div className="rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a95a5]">
          <div className="col-span-6">Role Name</div>
          <div className="col-span-3">Created At</div>
          <div className="col-span-2">Permissions Count</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="divide-y divide-[#eef2f7]">
          {roles.map((r, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-5 py-4">
              <div className="col-span-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f5f8] text-[#7a8594]">
                  {r.icon}
                </div>
                <div className="text-[14px] font-semibold text-[#2e3a49]">{r.name}</div>
              </div>
              <div className="col-span-3 text-[13px] text-[#475569]">{r.created}</div>
              <div className="col-span-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.color}`}>{r.perms} Permissions</span>
              </div>
              <div className="col-span-1 text-right">
                <details className="relative inline-block">
                  <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1 text-[#6b7785] hover:bg-[#f2f6fb] hover:text-[#3e4754]">
                    <MoreHorizontal className="h-4 w-4" />
                  </summary>
                  <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[13px] shadow-[0_16px_40px_rgba(30,64,120,0.12)]">
                    <Link href={`/access-control/roles/${toSlug(r.name)}`} className="block px-4 py-2 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">View</Link>
                    <Link href={`/access-control/roles/${toSlug(r.name)}/edit`} className="block px-4 py-2 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">Edit</Link>
                    <div className="my-1 border-t border-[#eef2f7]" />
                    <button type="button" className="block w-full px-4 py-2 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">Delete</button>
                  </div>
                </details>
              </div>
            </div>
          ))}
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
    </div>
  );
}
