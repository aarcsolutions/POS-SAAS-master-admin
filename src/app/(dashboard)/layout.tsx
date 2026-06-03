"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { SIDEBAR_CONFIG } from '@/rbac/sidebar-config';
import { ADMIN_LINK_PERM } from '@/rbac/link-permissions';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useLogoutMutation } from '@/hooks/auth';
import { getSidebarModules } from '@/data/mockSidebarData';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { permissions, user, modulesWithPermisssions, logout } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  const navClasses = (path: string) =>
    `flex items-center gap-3 rounded-md px-3 py-2 ${
      path === '/dashboard' // Special case for dashboard root
        ? pathname === path
          ? 'font-semibold text-[#2e4fd5] bg-[#e9efff]'
          : 'text-[#3e4754] hover:bg-[#f2f6fb]'
        : pathname.startsWith(path) && path !== '/'
        ? 'font-semibold text-[#2e4fd5] bg-[#e9efff]'
        : path === '/' && pathname === '/'
        ? 'font-semibold text-[#2e4fd5] bg-[#e9efff]'
        : 'text-[#3e4754] hover:bg-[#f2f6fb]'
    }`;

  // KSR-Style Dynamic Filter:
  // Check if the route's required permission exists in the user's flat permission array.
  const isRouteAllowed = (route: string) => {
    const requiredPerm = ADMIN_LINK_PERM[route];
    if (!requiredPerm) return true; // Public or unmapped routes
    return permissions.includes(requiredPerm);
  };

  return (
    <div className="flex h-screen bg-[#f7f9fc] text-[#313b47]">
      <Toaster position="top-center" />
      {/* Sidebar */}
      {/* ADDED overflow-y-auto to fix the black screen UI issue when sidebar items overflow */}
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#e7edf5] bg-white/90 backdrop-blur-sm overflow-y-auto">
        <div className="px-5 pt-6 pb-4">
          <div className="mb-6">
            <div className="text-[13px] font-semibold text-[#2e3a49]">POS Architect</div>
            <div className="text-[11px] font-medium text-[#94a3b4]">Master Control</div>
          </div>
          <nav className="space-y-1 text-[14px]">
            {getSidebarModules().map((module) => {
              const slug = module.module_slug;
              const config = SIDEBAR_CONFIG[slug as keyof typeof SIDEBAR_CONFIG] || SIDEBAR_CONFIG.default;
              
              // Only show if it has a valid path (or use default)
              const path = config.path !== '/' ? config.path : `/${slug.toLowerCase()}`;
              
              const Icon = config.icon;
              return (
                <Link 
                  key={slug} 
                  className={navClasses(path)} 
                  href={path}
                >
                  <Icon className="h-4 w-4" /> 
                  <span className="capitalize">{module.module_name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-[#e7edf5] bg-[#f6f9fd] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2e4fd5] text-white text-xs font-bold">
                {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#2e3a49] truncate max-w-[140px]">
                  {user?.name || 'Loading...'}
                </div>
                <div className="text-[11px] text-[#94a3b4]">
                  {user?.role || 'User'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-10 border-b border-[#e7edf5] bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between px-8">
            <div className="relative w-[520px]">
              <input
                placeholder="Search businesses, transactions, or logs..."
                className="h-9 w-full rounded-md border border-[#e7edf5] bg-[#eff4f9] px-4 text-[13px] text-[#64748b] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/20"
              />
            </div>
            <div className="flex items-center gap-3 text-[#607084]">
              <a className="text-[13px] font-semibold hover:text-[#2e4fd5]" href="#">Support</a>
              <button className="rounded-md border border-[#e7edf5] bg-white p-1.5 hover:bg-[#f6f9fd] transition-colors" title="Settings">
                <Settings className="h-4 w-4" />
              </button>
              <button 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 rounded-md border border-[#e7edf5] bg-white px-2 py-1.5 text-[12px] font-bold text-[#64748b] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <LogOut className={`h-3.5 w-3.5 ${logoutMutation.isPending ? 'animate-spin' : ''}`} />
                {logoutMutation.isPending ? 'Exiting...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-[1600px] flex-1 overflow-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
