'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRolePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState(4); // 1-5 like the reference Level 4

  const onCancel = () => router.push('/access-control/roles');
  const onCreate = () => {
    // TODO: wire to API
    router.push('/access-control/roles');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">Add New Role</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">
          Configure a new administrative role and define granular access levels for specialized personnel within the POS ecosystem.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-6 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <h2 className="mb-5 text-[15px] font-semibold text-[#2e3a49]">Role Details</h2>

        {/* Role Name */}
        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Role Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Regional Manager"
            className="h-11 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={5}
            placeholder="Briefly describe the responsibilities and scope of this role..."
            className="w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] p-3 text-[14px] text-[#475569] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20"
          />
        </div>

        {/* System Priority */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">System Priority</label>
            <span className="rounded-full bg-[#f1edff] px-2 py-0.5 text-[11px] font-semibold text-[#7b6fdc]">Level {priority}</span>
          </div>
          <div className="relative mt-2">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              className="w-full accent-[#2e4fd5]"
            />
            <div className="mt-1 flex justify-between text-[11px] text-[#9aa7b4]">
              <span>Standard</span>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3">
        <button onClick={onCancel} className="rounded-md bg-[#e5edf5] px-4 py-2 text-[13px] font-semibold text-[#516276] hover:bg-[#dfe7ef]">
          Cancel
        </button>
        <button onClick={onCreate} className="rounded-md bg-[#2e4fd5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3]">
          Create Role
        </button>
      </div>
    </div>
  );
}
