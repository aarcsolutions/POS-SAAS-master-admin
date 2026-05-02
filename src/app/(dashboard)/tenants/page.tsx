import { TenantList } from "@/components/tenants/tenant-list";

export const metadata = {
  title: 'Tenant Management - Pos-ms',
  description: 'Tenant oversight and infrastructure compliance monitoring',
};

export default function TenantsPage() {
  return <TenantList />;
}
