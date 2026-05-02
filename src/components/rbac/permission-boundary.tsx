"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ADMIN_LINK_PERM } from '@/rbac/link-permissions';

interface PermissionBoundaryProps {
  pathname: string;
  children: React.ReactNode;
}

export const PermissionBoundary: React.FC<PermissionBoundaryProps> = ({ 
  pathname, 
  children 
}) => {
  const router = useRouter();
  const { hasPermission, isAuthenticated } = useAuthStore();

  const requiredPermission = ADMIN_LINK_PERM[pathname];

  // If page doesn't require permission, or user is super admin, or has permission
  if (!requiredPermission || hasPermission(requiredPermission)) {
    return <>{children}</>;
  }

  // Handle unauthorized access
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-[#2e3a49]">Access Denied</h2>
      <p className="mt-2 text-[#94a3b4]">You do not have permission to view this page.</p>
      <button 
        onClick={() => router.push('/dashboard')}
        className="mt-6 rounded-md bg-[#2e4fd5] px-4 py-2 text-white transition hover:bg-[#2542b9]"
      >
        Return to Dashboard
      </button>
    </div>
  );
};
