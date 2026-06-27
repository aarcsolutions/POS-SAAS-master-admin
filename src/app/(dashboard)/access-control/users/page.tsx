"use client";
import React, { useState, useEffect } from 'react';
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
  Trash2,
  ChevronDown
} from 'lucide-react';
import { UserForm } from '@/components/users/user-form';
import { usersApi } from '@/services/users';

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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll({ page, limit: 100 }) as any;
      console.log('Users API Response:', data);

      let usersArray = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (Array.isArray(data.data)) {
        usersArray = data.data;
      } else if (data.data?.data && Array.isArray(data.data.data)) {
        usersArray = data.data.data;
      } else if (data.data?.users && Array.isArray(data.data.users)) {
        usersArray = data.data.users;
      }

      // Transform API data to match UserItem interface
      const transformedUsers = usersArray.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.title || 'SUPPORT',
        status: user.is_active ? 'Active' : 'Inactive',
        createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A',
        avatar: user.name ? user.name.substring(0, 2).toUpperCase() : 'NA',
        phone: user.phone
      }));

      console.log('Transformed Users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchTerm ||
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

  const handleFormClose = () => {
    setIsFormOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      try {
        await usersApi.delete(id);
        await fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (isFormOpen) {
    return (
      <UserForm
        mode={formMode}
        initialData={selectedUser ? {
          id: selectedUser.id,
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
          status: selectedUser.status,
          phone: selectedUser.phone || '+1 (555) 000-0000'
        } : undefined}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
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
        <div className="relative min-w-[160px]">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white pl-4 pr-10 text-[13px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/10 focus:border-[#2e4fd5] transition-all shadow-sm"
          >
            <option value="">All Roles</option>
            <option value="SUPER ADMIN">Super Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="SUPPORT">Support</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
        </div>
        <div className="relative min-w-[160px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white pl-4 pr-10 text-[13px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/10 focus:border-[#2e4fd5] transition-all shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
        </div>
        <button
          onClick={() => { setSearchTerm(''); setRoleFilter(''); setStatusFilter(''); }}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]"
        >
          <Filter className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#eef2f6] overflow-hidden shadow-sm mb-6 text-[14px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#fcfdfe] border-b border-[#f1f5f9] text-[12px] font-bold text-[#94a3b4] uppercase tracking-wider">
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[#fcfdfe] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold text-[14px] shadow-sm overflow-hidden group-hover:from-[#3758d5] group-hover:to-[#2e4fd5] transition-all">
                      {user.avatar}
                    </div>
                    <span className="font-bold text-[#2e3a49] text-[14px] group-hover:text-[#2e4fd5] transition-colors">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[#55606d]">{user.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider ${getRoleStyle(user.role)}`}>
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
                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[14px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                      <button onClick={() => handleOpenForm('view', user)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Eye className="h-4 w-4 text-[#8a95a5]" /> View Details
                      </button>
                      <button onClick={() => handleOpenForm('edit', user)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit
                      </button>
                      <div className="my-1 border-t border-[#eef2f7]" />
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id, user.name)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]"
                      >
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f5f9] bg-white rounded-b-xl">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-[#64748b]">Total Users: <span className="text-[#2e3a49] font-bold">{filteredUsers.length}</span></span>
          <span className="text-[14px] font-medium text-[#94a3b4]">|</span>
          <span className="text-[14px] font-medium text-[#64748b]">Page {page} of {totalPages}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1 px-2">
            <span className="h-9 min-w-[36px] flex items-center justify-center rounded-lg bg-[#3758d5] text-white font-bold text-[14px]">
              {page}
            </span>
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg text-[#94a3b4] hover:bg-[#f1f5f9] hover:text-[#475569] disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
