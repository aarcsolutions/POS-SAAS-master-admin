"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Shield, Layers, CreditCard, Settings, UserCog, Grid2X2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navClasses = (path: string) =>
    `flex items-center gap-3 rounded-md px-3 py-2 ${
      pathname.startsWith(path)
        ? 'font-semibold text-[#2e4fd5] bg-[#e9efff]'
        : 'text-[#3e4754] hover:bg-[#f2f6fb]'
    }`;
  return (
    <div className="flex h-screen bg-[#f7f9fc] text-[#313b47]">
      {/* Sidebar */}
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#e7edf5] bg-white/90 backdrop-blur-sm">
        <div className="px-5 pt-6 pb-4">
          <div className="mb-6">
            <div className="text-[13px] font-semibold text-[#2e3a49]">POS Architect</div>
            <div className="text-[11px] font-medium text-[#94a3b4]">Master Control</div>
          </div>
          <nav className="space-y-1 text-[14px]">
            <Link className={navClasses('/dashboard')} href="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> Global Dashboard
            </Link>
            <Link className={navClasses('/tenants')} href="/tenants">
              <Users className="h-4 w-4" /> Tenant Management
            </Link>
            <Link className={navClasses('/subscriptions')} href="/subscriptions">
              <CreditCard className="h-4 w-4" /> Subscription Plans
            </Link>
            <Link className={navClasses('/access-control/roles')} href="/access-control/roles">
              <Shield className="h-4 w-4" /> Roles
            </Link>
            <Link className={navClasses('/access-control/users')} href="/access-control/users">
              <UserCog className="h-4 w-4" /> Users
            </Link>
            <Link className={navClasses('/access-control/modules')} href="/access-control/modules">
              <Layers className="h-4 w-4" /> Modules
            </Link>
            <Link className={navClasses('/access-control/permissions')} href="/access-control/permissions">
              <Grid2X2 className="h-4 w-4" /> Permissions
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-[#e7edf5] bg-[#f6f9fd] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2e4fd5] text-white text-xs font-bold">AM</div>
              <div>
                <div className="text-[13px] font-semibold text-[#2e3a49]">Alex Mercer</div>
                <div className="text-[11px] text-[#94a3b4]">Master Admin</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-10 border-b border-[#e7edf5] bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-6">
            <div className="relative w-[520px]">
              <input
                placeholder="Search businesses, transactions, or logs..."
                className="h-9 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-4 text-[13px] text-[#64748b] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20"
              />
            </div>
            <div className="flex items-center gap-3 text-[#607084]">
              <a className="text-[13px] font-semibold hover:text-[#2e4fd5]" href="#">Support</a>
              <button className="rounded-md border border-[#e7edf5] bg-white p-1.5 hover:bg-[#f6f9fd]"><Settings className="h-4 w-4" /></button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-[1200px] flex-1 overflow-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
