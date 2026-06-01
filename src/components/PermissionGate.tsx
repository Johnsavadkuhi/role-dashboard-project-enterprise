import { usePermission } from "@/hooks/usePermission";

export default function PermissionGate({ permissions = [], children, fallback = null }) {
  const { hasAnyPermission } = usePermission();
  return hasAnyPermission(permissions) ? children : fallback;
}
