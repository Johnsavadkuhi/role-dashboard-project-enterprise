import { lazy } from "react";
import { PERMISSIONS } from "@/constants/permissions";

const AdminDashboard = lazy(() => import("@/modules/admin/pages/AdminDashboard"));
const PentesterDashboard = lazy(() => import("@/modules/pentester/pages/PentesterDashboard"));
const DevOpsDashboard = lazy(() => import("@/modules/devops/pages/DevOpsDashboard"));
const RepresentativeDashboard = lazy(() => import("@/modules/representative/pages/RepresentativeDashboard"));
const QualityAssuranceDashboard = lazy(() => import("@/modules/qa/pages/QualityAssuranceDashboard"));
const Profile = lazy(() => import("@/pages/shared/Profile"));
const Settings = lazy(() => import("@/pages/shared/Settings"));

export const protectedRouteConfig = [
  { path: "/admin", element: AdminDashboard, permissions: [PERMISSIONS.ADMIN_DASHBOARD_READ] },
  { path: "/pentester", element: PentesterDashboard, permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ] },
  { path: "/devops", element: DevOpsDashboard, permissions: [PERMISSIONS.DEVOPS_DASHBOARD_READ] },
  { path: "/representative", element: RepresentativeDashboard, permissions: [PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ] },
  { path: "/qa", element: QualityAssuranceDashboard, permissions: [PERMISSIONS.QA_DASHBOARD_READ] },
  { path: "/profile", element: Profile, permissions: [] },
  { path: "/settings", element: Settings, permissions: [] },
];
