import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    roles: auth.user?.roles || [],
    permissions: auth.user?.permissions || [],
  };
}
