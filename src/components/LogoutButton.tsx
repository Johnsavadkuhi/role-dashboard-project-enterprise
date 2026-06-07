import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "@/features/auth/authSlice";
import { useLanguage } from "@/i18n";
import { useLogoutUserMutation } from "@/services/authApi";
import Button from "@/components/ui/Button";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // Local logout should still happen if the session cookie is already expired.
    }
    dispatch(logout());
    toast.success(t("nav.loggedOut"));
    navigate("/login");
  };

  return (
    <Button variant="secondary" onClick={handleLogout} isLoading={isLoading}>
      {t("nav.logout")}
    </Button>
  );
}
