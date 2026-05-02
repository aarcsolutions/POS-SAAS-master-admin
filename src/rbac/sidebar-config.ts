import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Layers, 
  CreditCard, 
  UserCog, 
  Grid2X2,
  Settings,
  HelpCircle
} from 'lucide-react';

export const SIDEBAR_CONFIG = {
  // Mapping module slugs to Lucide icons, groups, and correct paths
  "dashboard":     { icon: LayoutDashboard, group: "General", path: "/dashboard" },
  "tenants":       { icon: Users,           group: "Management", path: "/tenants" },
  "subscriptions": { icon: CreditCard,      group: "Management", path: "/subscriptions" },
  "roles":         { icon: Shield,           group: "Access Control", path: "/access-control/roles" },
  "users":         { icon: UserCog,          group: "Access Control", path: "/access-control/users" },
  "modules":       { icon: Layers,           group: "Access Control", path: "/access-control/modules" },
  "permissions":   { icon: Grid2X2,          group: "Access Control", path: "/access-control/permissions" },
  
  // Fallback for unknown modules
  "default":       { icon: Grid2X2,          group: "Others", path: "/" }
};

export type SidebarIconName = keyof typeof SIDEBAR_CONFIG;
