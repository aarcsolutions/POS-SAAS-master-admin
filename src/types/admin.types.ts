/**
 * Centralized Admin Types (KSR-Parity)
 */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface Role {
  id: string;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
}

export interface RolesListResponse {
  statusCode: number;
  status: boolean;
  message: string;
  heading: string;
  data: {
    roles: Role[];
    pagination: Pagination;
  };
}

export interface RoleDetailResponse {
  statusCode: number;
  status: boolean;
  message: string;
  heading: string;
  data: Role;
}

// --- Permissions Matrix Types ---

export interface Permission {
  id: string;
  title: string;
  slug: string;
  is_allowed: boolean;
}

export interface ModuleWithPermissions {
  id: string;
  title: string;
  slug: string;
  permissions: Permission[];
}

export interface RolePermissionsResponse {
  statusCode: number;
  status: boolean;
  message: string;
  heading: string;
  data: {
    modulesWithPermissions: ModuleWithPermissions[];
  };
}

export interface UpdatePermissionPayload {
  roleId: string;
  permissionId: string;
  isAllowed: boolean;
}

// --- Tenant Module Types ---

export interface Tenant {
  id: string;
  tenantName: string;
  domain: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
  modules: string[];
  permissions: Record<string, string[]>;
  country: string;
  city: string;
  userSeats: number;
  branchLicenses: number;
  billingCycle: string;
  customAmount: number;
  is_active: boolean;
  created_at: string;
}

export interface TenantListResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    tenants: Tenant[];
    pagination: Pagination;
  };
}

export interface TenantDetailResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: Tenant;
}
