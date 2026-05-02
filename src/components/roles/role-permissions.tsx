"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Loader2,
  ShieldAlert,
  Save
} from 'lucide-react';
import { useRolesQuery, useRolePermissionsQuery, useUpdatePermissionsMutation } from '@/hooks/roles';
import { Permission, ModuleWithPermissions } from '@/types/admin.types';

export const RolePermissionsMapping = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [localPermissions, setLocalPermissions] = useState<Record<string, boolean>>({});

  // Fetch Roles for the dropdown
  const { data: rolesResponse } = useRolesQuery({ page: 1, limit: 100 });
  const roles = rolesResponse?.data?.roles || [];

  // Set initial role if roles exist
  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  // Fetch Permissions for the selected role
  const { data: permsResponse, isLoading, isError } = useRolePermissionsQuery(selectedRoleId || null);
  const modules = permsResponse?.data?.modulesWithPermissions || [];

  const updateMutation = useUpdatePermissionsMutation();

  // Sync local state when API data changes
  useEffect(() => {
    if (modules.length > 0) {
      const initialPerms: Record<string, boolean> = {};
      modules.forEach(m => {
        m.permissions.forEach(p => {
          initialPerms[p.id] = p.is_allowed;
        });
      });
      setLocalPermissions(initialPerms);
      
      // Auto-open first module if none are open
      if (Object.keys(openModules).length === 0) {
        setOpenModules({ [modules[0].id]: true });
      }
    }
  }, [permsResponse, modules]);

  const toggleModule = (id: string) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePermission = (id: string) => {
    setLocalPermissions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    
    const payload = Object.entries(localPermissions).map(([permissionId, isAllowed]) => ({
      roleId: selectedRoleId,
      permissionId,
      isAllowed
    }));

    await updateMutation.mutateAsync(payload);
  };

  const filteredModules = useMemo(() => {
    return modules.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.permissions.some(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [modules, searchQuery]);

  const totalAllowed = Object.values(localPermissions).filter(v => v).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="rounded-[12px] border border-[#e7edf5] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Top Header Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-bold text-[#2e3a49]">Select Role</h3>
            <button 
              onClick={handleSave}
              disabled={updateMutation.isPending || !selectedRoleId}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#2e4fd5] px-6 py-2.5 text-[14px] font-bold text-white shadow-sm hover:bg-[#2447d3] transition-all disabled:opacity-50"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>

          <div className="relative mb-8">
            <select 
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full appearance-none rounded-[8px] border border-[#e7edf5] bg-[#fcfdfe] px-4 py-3 text-[14px] text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/10"
            >
              <option value="" disabled>Select a role...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a95a5] pointer-events-none" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-[16px] font-bold text-[#2e3a49]">Role Permissions</h4>
              <p className="text-[12px] text-[#8a95a5] mt-1">
                Currently editing permissions for: <span className="text-[#2e4fd5] font-semibold">
                  {roles.find(r => r.id === selectedRoleId)?.title || '...'}
                </span>
              </p>
            </div>
            <div className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              totalAllowed > 0 ? 'bg-[#eef2ff] text-[#2e4fd5]' : 'bg-gray-100 text-gray-400'
            }`}>
              {totalAllowed} Permissions Allowed
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a95a5]" />
            <input 
              type="text" 
              placeholder="Search modules or permissions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[8px] border border-[#e7edf5] bg-white py-3 pl-11 pr-4 text-[14px] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#2e4fd5]/10"
            />
          </div>

          {/* Module Accordions */}
          <div className="space-y-4 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 text-[#7a8594]">
                <Loader2 className="h-8 w-8 animate-spin text-[#2e4fd5] mb-2" />
                <p className="text-[14px]">Loading permissions matrix...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center p-20 text-[#d12d2d] border border-dashed border-[#e7edf5] rounded-xl">
                <ShieldAlert className="h-8 w-8 mb-2" />
                <p className="text-[14px] font-semibold">Failed to fetch permissions</p>
                <p className="text-[11px] opacity-70">Please check your internet connection or try a different role.</p>
              </div>
            ) : filteredModules.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-[#7a8594] border border-dashed border-[#e7edf5] rounded-xl">
                <Search className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-[14px]">No modules matching your search</p>
              </div>
            ) : (
              filteredModules.map((module) => {
                const modulePerms = module.permissions;
                const selectedCount = modulePerms.filter(p => localPermissions[p.id]).length;
                const isOpen = !!openModules[module.id];

                return (
                  <div key={module.id} className="rounded-[10px] border border-[#e7edf5] bg-[#fcfdfe] overflow-hidden transition-all duration-200">
                    <button 
                      onClick={() => toggleModule(module.id)}
                      className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-[#f8faff]"
                    >
                      <div className="flex items-center gap-3">
                        {isOpen ? <ChevronDown className="h-5 w-5 text-[#8a95a5]" /> : <ChevronRight className="h-5 w-5 text-[#8a95a5]" />}
                        <span className="text-[14px] font-bold text-[#2e3a49]">{module.title}</span>
                      </div>
                      <div className={`rounded-[6px] px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        selectedCount > 0 ? 'bg-[#2e4fd5] text-white' : 'bg-[#e2e8f0] text-[#8a95a5]'
                      }`}>
                        {selectedCount} Selected
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#e7edf5] bg-white p-5 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                          {modulePerms.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || module.title.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => {
                            const isAllowed = !!localPermissions[p.id];
                            return (
                              <div key={p.id} className="flex items-center justify-between group">
                                <span className={`text-[13px] font-medium transition-colors ${isAllowed ? 'text-[#2e3a49]' : 'text-[#8a95a5]'}`}>{p.title}</span>
                                <button 
                                  onClick={() => togglePermission(p.id)}
                                  className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
                                    isAllowed ? 'bg-[#2e4fd5]' : 'bg-[#e2e8f0]'
                                  }`}
                                >
                                  <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                    isAllowed ? 'translate-x-5' : 'translate-x-0'
                                  }`} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-[#e7edf5] px-6 py-4 bg-[#fcfdfe] rounded-b-[12px] flex items-center justify-between text-[13px] text-[#8a95a5]">
          <p>Total Modules: <span className="font-semibold text-[#2e3a49]">{modules.length}</span></p>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Changes are only saved once you click 'Save Changes'</span>
          </div>
        </div>
      </div>
    </div>
  );
};
