import Link from 'next/link';

export default function ViewRolePage({ params }: { params: { id: string } }) {
  const title = decodeURIComponent(params.id.replace(/-/g, ' '));
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#2e3a49]">View Role</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#7a8594]">
          View administrative role and define granular access levels for specialized personnel within the POS ecosystem.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#e7edf5] bg-white p-6 shadow-[0_16px_40px_rgba(30,64,120,0.06)]">
        <h2 className="mb-5 text-[15px] font-semibold text-[#2e3a49]">Role Details</h2>

        {/* Role Name */}
        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Role Name</label>
          <input
            value={title || 'Regional Manager'}
            readOnly
            className="h-11 w-full cursor-default rounded-md border border-[#e7edf5] bg-[#eff4f9] px-3 text-[14px] text-[#475569]"
          />
        </div>

        {/* Description */}
        <div className="mb-1">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">Description</label>
          <textarea
            value={'Briefly describe the responsibilities and scope of this role...'}
            readOnly
            rows={5}
            className="w-full cursor-default rounded-md border border-[#e7edf5] bg-[#eff4f9] p-3 text-[14px] text-[#475569]"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end">
        <Link href="/access-control/roles" className="rounded-md bg-[#2e4fd5] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.28)] hover:bg-[#2447d3]">
          Close
        </Link>
      </div>
    </div>
  );
}
