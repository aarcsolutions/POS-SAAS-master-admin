'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Search, Save, MoreHorizontal } from 'lucide-react';

type Action = 'read' | 'create' | 'update' | 'delete' | 'readall';

type ModulePerm = {
  key: string;
  actions: Action[];
};

type ModuleGroup = {
  name: string;
  items: ModulePerm[];
};

const seed: ModuleGroup[] = [
  {
    name: 'Abc',
    items: [
      { key: 'convertToJobFile', actions: ['readall'] },
      { key: 'read', actions: [] },
      { key: 'delete', actions: [] },
      { key: 'readall', actions: ['readall'] },
    ],
  },
  {
    name: 'Clients',
    items: [
      { key: 'client.list', actions: ['read'] },
      { key: 'client.create', actions: ['create'] },
      { key: 'client.update', actions: ['update'] },
    ],
  },
  {
    name: 'Dropdowns',
    items: [
      { key: 'dropdown.manage', actions: [] },
    ],
  },
  {
    name: 'Invoices',
    items: [
      { key: 'invoice.read', actions: ['read'] },
      { key: 'invoice.create', actions: ['create'] },
    ],
  },
  {
    name: 'Job_files',
    items: [
      { key: 'job.read', actions: ['read'] },
      { key: 'job.update', actions: [] },
    ],
  },
  {
    name: 'Job_files',
    items: [
      { key: 'job.read', actions: ['read'] },
      { key: 'job.update', actions: [] },
    ],
  },
  {
    name: 'Inventory',
    items: [
      { key: 'inventory.view', actions: ['read'] },
      { key: 'inventory.manage', actions: ['create', 'update'] },
    ],
  },
];

export default function RolePermissionsPage() {
  const [role, setRole] = useState('Master Admin');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({ Abc: true });
  const [grants, setGrants] = useState<Record<string, Set<Action>>>(() => {
    const map: Record<string, Set<Action>> = {};
    seed.forEach(g => g.items.forEach(i => (map[i.key] = new Set(i.actions))));
    return map;
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return seed;
    const q = query.toLowerCase();
    return seed
      .map(g => ({
        ...g,
        items: g.items.filter(i => i.key.toLowerCase().includes(q)),
      }))
      .filter(g => g.items.length > 0);
  }, [query]);

  const toggle = (key: string, act: Action) => {
    setGrants(prev => {
      const next = { ...prev };
      const set = new Set(next[key] ?? []);
      set.has(act) ? set.delete(act) : set.add(act);
      next[key] = set;
      return next;
    });
  };

  const countSelected = (items: ModulePerm[]) =>
    items.reduce((acc, i) => acc + (grants[i.key]?.size ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#2e3a49]">Role Permissions Matrix</h1>
        <p className="mt-1 text-[13px] text-[#7a8594]">Assign detailed module permissions to specific roles</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <a href="/access-control/roles" className="rounded-md border border-[#e7edf5] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#718198] hover:bg-[#f8fbff]">Roles</a>
          <button className="rounded-md bg-[#e9efff] px-3 py-1.5 text-[12px] font-semibold text-[#2e4fd5]">Permissions Matrix</button>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-[#2e4fd5] px-3.5 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3]"><Save className="h-4 w-4"/> Save Changes</button>
      </div>

      {/* Role selector and permissions search */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-5 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <div className="mb-5 grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-8">
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Select Role</label>
            <div className="relative">
              <select value={role} onChange={e => setRole(e.target.value)} className="h-10 w-full rounded-md border border-[#e7edf5] bg-white px-3 text-[13px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20">
                {['Master Admin','Owner','Manager','Support'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Role Permissions</label>
            <div className="text-[12px] text-[#4d6ae3]">Currently editing permissions for: <span className="font-semibold">{role}</span></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-[#94a3b4]" />
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search modules..." className="h-10 w-full rounded-md border border-[#e7edf5] bg-[#f6f9fd] pl-9 pr-3 text-[13px] text-[#64748b] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20" />
          </div>
        </div>

        {/* Modules accordion */}
        <div className="space-y-3">
          {filtered.map(group => {
            const opened = !!open[group.name];
            return (
              <div key={group.name} className="rounded-lg border border-[#e7edf5]">
                <button onClick={() => setOpen(o => ({ ...o, [group.name]: !opened }))} className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    {opened ? <ChevronDown className="h-4 w-4 text-[#7a8594]" /> : <ChevronRight className="h-4 w-4 text-[#7a8594]" />}
                    <span className="text-[14px] font-semibold text-[#2e3a49]">{group.name}</span>
                  </div>
                  <span className="rounded-full bg-[#f6f9fd] px-2.5 py-0.5 text-[11px] font-semibold text-[#7a8594]">{countSelected(group.items)} selected</span>
                </button>
                {opened && (
                  <div className="divide-y divide-[#eef2f7]">
                    {group.items.map(item => (
                      <div key={item.key} className="grid grid-cols-12 items-center px-4 py-3">
                        <div className="col-span-4 text-[13px] text-[#2e3a49]">{item.key}</div>
                        <div className="col-span-8 grid grid-cols-5 gap-3">
                          {(['readall','create','read','update','delete'] as Action[]).map((a) => (
                            <label key={a} className="flex items-center justify-between gap-2 rounded-md border border-[#eef2f7] bg-[#fbfdff] px-3 py-2 text-[12px] text-[#64748b]">
                              <span className="capitalize">{a}</span>
                              <input
                                type="checkbox"
                                checked={grants[item.key]?.has(a) ?? false}
                                onChange={() => toggle(item.key, a)}
                                className="h-4 w-7 cursor-pointer appearance-none rounded-full bg-[#e6eef7] outline-none transition checked:bg-[#2e4fd5]"
                                style={{ boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.6)' }}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
