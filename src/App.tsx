import AppRoutes from "@/routes/AppRoutes";
import NotificationRealtimeBridge from "@/components/NotificationRealtimeBridge";

export default function App() {
  return (
    <>
      <NotificationRealtimeBridge />
      <AppRoutes />
    </>
  );
}
