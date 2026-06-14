import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "@/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useGetMeQuery } from "@/services/authApi";

export default function AuthSessionSync() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { data: currentUser } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
    }
  }, [currentUser, dispatch]);

  return null;
}
