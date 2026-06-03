"use client";
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Shield,
  Lock,
  FileText,
  ToggleLeft,
  Trash2,
  Database,
  UserCheck,
  CreditCard,
  Settings,
  Monitor,
  Pencil
} from 'lucide-react';
import { PermissionForm } from '@/components/permissions/permission-form';

interface PermissionItem {
  id: string;
  name: string;
  module: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | string;
  description: string;
  icon: any;
}

const MOCK_PERMISSIONS: PermissionItem[] = [
  { id: '1', name: 'system.auth.login', module: 'Authentication', action: 'READ', description: 'Manages initial system handshake and user session establishment.', icon: Lock },
  { id: '2', name: 'subscription.modify', module: 'Billing', action: 'UPDATE', description: 'Modify merchant tier levels and billing cycle configurations.', icon: FileText },
  { id: '3', name: 'module.feature.toggle', module: 'Maintenance', action: 'CREATE', description: 'Enable or disable system features.', icon: ToggleLeft },
  { id: '4', name: 'user.session.terminate', module: 'Security', action: 'DELETE', description: 'Force logout active user sessions.', icon: Trash2 },
  { id: '5', name: 'billing.invoice.generate', module: 'Billing', action: 'CREATE', description: 'Create manual billing invoices.', icon: CreditCard },
  { id: '6', name: 'stock.inventory.adjust', module: 'Inventory', action: 'UPDATE', description: 'Manually adjust product stock levels.', icon: Database },
  { id: '7', name: 'backup.system.create', module: 'Maintenance', action: 'CREATE', description: 'Trigger manual system data backup.', icon: Settings },
  { id: '8', name: 'api.endpoint.configure', module: 'System', action: 'UPDATE', description: 'Configure external API integration points.', icon: Monitor }
];

export default function PermissionsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPermission, setSelectedPermission] = useState<PermissionItem | null>(null);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'READ': return 'text-[#2e4fd5] bg-[#e9efff] border-[#d7e1ff]';
      case 'CREATE': return 'text-[#059669] bg-[#ecfdf5] border-[#d1fae5]';
      case 'UPDATE': return 'text-[#d97706] bg-[#fffbeb] border-[#fef3c7]';
      case 'DELETE': return 'text-[#dc2626] bg-[#fef2f2] border-[#fee2e2]';
      default: return 'text-[#64748b] bg-[#f8fafc] border-[#f1f5f9]';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'Authentication': return 'text-[#3758d5] bg-[#f0f4ff]';
      case 'Billing': return 'text-[#8b5cf6] bg-[#f5f3ff]';
      case 'Maintenance': return 'text-[#64748b] bg-[#f8fafc]';
      case 'Security': return 'text-[#475569] bg-[#f1f5f9]';
      default: return 'text-[#64748b] bg-[#f8fafc]';
    }
  };

  const handleOpenForm = (mode: 'create' | 'edit' | 'view', item?: PermissionItem) => {
    setFormMode(mode);
    setSelectedPermission(item || null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <PermissionForm 
        mode={formMode}
        initialData={selectedPermission}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => {
          console.log('Permission Action:', formMode, data);
          setIsFormOpen(false);
        }}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#94a3b4] text-[12px] mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span>Access Control</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2e3a49]">Permissions</h1>
          <p className="text-[14px] text-[#94a3b4] mt-1">Manage system permissions and access control</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#eef2f6] text-[#64748b] px-4 py-2 rounded-md font-semibold text-[13px] hover:bg-[#f8fafc] transition-all shadow-sm active:scale-95">
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <button 
            onClick={() => handleOpenForm('create')}
            className="flex items-center gap-2 bg-[#3758d5] text-white px-4 py-2.5 rounded-md font-semibold text-[13px] shadow-sm hover:bg-[#2f4fca] transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Permission
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#eef2f6] p-4 mb-6 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b4]" />
          <input 
            type="text" 
            placeholder="Search by permission name or module..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f5f9] rounded-md hover:bg-[#f8fafc] text-[#64748b] font-semibold text-[13px]">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#eef2f6] shadow-sm overflow-hidden mb-6 text-[13px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#fcfdfe] border-b border-[#f1f5f9] text-[11px] font-bold text-[#94a3b4] uppercase tracking-wider">
              <th className="px-6 py-4">Permission Name</th>
              <th className="px-6 py-4">Module</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {MOCK_PERMISSIONS.filter((perm) =>
              !searchTerm ||
              perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              perm.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
              perm.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
              perm.description.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((perm) => (
              <tr key={perm.id} className="hover:bg-[#fcfdfe] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#f0f4ff] text-[#3758d5] transition-all group-hover:scale-110">
                      <perm.icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-[#2e3a49] group-hover:text-[#2e4fd5] transition-colors">{perm.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-tight ${getModuleColor(perm.module)}`}>
                    {perm.module}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] border ${getActionColor(perm.action)}`}>
                    {perm.action}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[#55606d] max-w-sm line-clamp-2">{perm.description}</div>
                </td>
                <td className="px-6 py-5 text-right">
                  <details className="relative inline-block">
                    <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-md p-1.5 text-[#94a3b4] hover:bg-[#f1f5f9] transition-all">
                      <MoreHorizontal className="h-4 w-4" />
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-[#e6edf5] bg-white py-1 text-[13px] shadow-[0_16px_40px_rgba(30,64,120,0.12)] text-left">
                      <button onClick={() => handleOpenForm('view', perm)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Monitor className="h-4 w-4 text-[#8a95a5]" /> View Details
                      </button>
                      <button onClick={() => handleOpenForm('edit', perm)} className="flex items-center gap-2 w-full px-4 py-2.5 text-[#2e3a49] hover:bg-[#f6f9fd] hover:text-[#1f2a37] font-medium">
                        <Pencil className="h-4 w-4 text-[#8a95a5]" /> Edit Permission
                      </button>
                      <div className="my-1 border-t border-[#eef2f7]" />
                      <button type="button" className="flex items-center gap-2 w-full px-4 py-2.5 text-left font-medium text-[#d12d2d] hover:bg-[#fff5f5]">
                        <Trash2 className="h-4 w-4" /> Deactivate
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
        <div>Showing 1 to {MOCK_PERMISSIONS.length} of 124 results</div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-[#eef2f6] rounded-md hover:bg-white text-[#64748b] disabled:opacity-50 transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-md bg-[#3758d5] text-white font-bold shadow-sm">1</button>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">2</button>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">3</button>
            <span className="px-1 text-[11px]">...</span>
            <button className="h-8 w-8 rounded-md hover:bg-white border border-transparent hover:border-[#eef2f6] text-[#64748b] transition-all">25</button>
          </div>
          <button className="p-2 border border-[#eef2f6] rounded-md hover:bg-white text-[#64748b] transition-all">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
