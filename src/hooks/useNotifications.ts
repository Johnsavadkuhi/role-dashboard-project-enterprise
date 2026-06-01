import { useSelector } from "react-redux";
import {
  selectNotificationConnectionStatus,
  selectNotifications,
  selectUnreadNotificationCount,
} from "@/features/notifications/notificationsSlice";

export function useNotifications() {
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadNotificationCount);
  const connectionStatus = useSelector(selectNotificationConnectionStatus);

  return {
    notifications,
    unreadCount,
    connectionStatus,
    hasUnread: unreadCount > 0,
  };
}
