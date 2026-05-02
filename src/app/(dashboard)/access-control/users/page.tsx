"use client";
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Download,
  MoreHorizontal,
  Mail,
  Shield,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { UserForm } from '@/components/users/user-form';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER ADMIN' | 'MANAGER' | 'SUPPORT' | string;
  status: 'Active' | 'Inactive' | 'Suspended' | string;
  createdAt: string;
  avatar: string;
  phone?: string;
}

const MOCK_USERS: UserItem[] = [
  { id: '1', name: 'Marcus Aurelius', email: 'm.aurelius@architect.io', role: 'SUPER ADMIN', status: 'Active', createdAt: 'Oct 12, 2023', avatar: 'MA' },
  { id: '2', name: 'Elena Vance', email: 'e.vance@architect.io', role: 'MANAGER', status: 'Active', createdAt: 'Nov 05, 2023', avatar: 'EV' },
  { id: '3', name: 'Julian Casablancas', email: 'j.casablancas@architect.io', role: 'SUPPORT', status: 'Inactive', createdAt: 'Dec 14, 2023', avatar: 'JC' },
  { id: '4', name: 'Sarah Connor', email: 's.connor@architect.io', role: 'MANAGER', status: 'Active', createdAt: 'Jan 02, 2024', avatar: 'SC' },
  { id: '5', name: 'John Doe', email: 'j.doe@architect.io', role: 'SUPPORT', status: 'Active', createdAt: 'Jan 15, 2024', avatar: 'JD' },
  { id: '6', name: 'Alex Rivera', email: 'a.rivera@architect.io', role: 'MANAGER', status: 'Suspended', createdAt: 'Feb 03, 2024', avatar: 'AR' },
  { id: '7', name: 'Linda May', email: 'l.may@architect.io', role: 'SUPER ADMIN', status: 'Active', createdAt: 'Feb 11, 2024', avatar: 'LM' }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'SUPER ADMIN': return 'text-[#6366f1] bg-[#eef2ff]';
      case 'MANAGER': return 'text-[#a855f7] bg-[#f5f3ff]';
      case 'SUPPORT': return 'text-[#3b82f6] bg-[#eff6ff]';
      default: return 'text-[#64748b] bg-[#f8fafc]';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-600';
      case 'Suspended': return 'text-rose-600';
      case 'Inactive': return 'text-[#64748b]';
      default: return 'text-[#64748b]';
    }
  };

  const handleOpenForm = (mode: 'create' | 'edit' | 'view', user?: UserItem) => {
    setFormMode(mode);
    setSelectedUser(user || null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <UserForm 
        mode={formMode}
        initialData={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
          status: selectedUser.status,
          phone: selectedUser.phone || '+1 (555) 000-0000'
        } : undefined}
        onClose={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2e3a49]">Users</h1>
          <p className="text-[14px] text-[#94a3b4] mt-1">Manage system users across all platforms and branches</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#eef2f6] text-[#64748b] px-4 py-2 rounded-md font-semibold text-[13px] hover:bg-[#f8fafc] transition-all shadow-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => handleOpenForm('create')}
            className="flex items-center gap-2 bg-[#3758d5] text-white px-4 py-2.5 rounded-md font-semibold text-[13px] shadow-sm hover:bg-[#2f4fca] transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#eef2f6] p-4 mb-6 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
          <input 
            type="text" 
            placeholder="Search by name, email or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#eef2f6] overflow-hidden shadow-sm mb-6 text-[13px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#fcfdfe] border-b border-[#f1f5f9] text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider">
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-[#fcfdfe] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold text-[13px] shadow-sm overflow-hidden group-hover:from-[#3758d5] group-hover:to-[#2e4fd5] transition-all">
                      {user.avatar}
                    </div>
                    <span className="font-bold text-[#2e3a49] text-[14px] group-hover:text-[#2e4fd5] transition-colors">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[#55606d]">{user.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${getRoleStyle(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Suspended' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                    <span className={`font-bold ${getStatusStyle(user.status)}`}>{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[#64748b]">{user.createdAt}</td>
                <td className="px-6 py-5 text-right">
                  <details className="relative inline-block">
                    <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1.5 text-[#94a3b4] hover:bg-[#f1f5f9] transition-all">
                      <MoreHorizontal className="h-4 w-4" />
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[13px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                      <button onClick={() => handleOpenForm('view', user)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Eye className="h-4 w-4 text-[#8a95a5]" /> View
                      </button>
                      <button onClick={() => handleOpenForm('edit', user)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit
                      </button>
                      <div className="my-1 border-t border-[#eef2f7]" />
                      <button type="button" className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between text-[13px] text-[#94a3b4]">
        <div>Showing 1-{MOCK_USERS.length} of 1,284 users</div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-[#eef2f6] rounded-md hover:bg-white text-[#64748b] disabled:opacity-50 transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-md bg-[#3758d5] text-white font-semibold shadow-sm">1</button>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">2</button>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">3</button>
            <span className="px-2">...</span>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">129</button>
          </div>
          <button className="p-2 border border-[#eef2f6] rounded-md hover:bg-white text-[#64748b] transition-all">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
