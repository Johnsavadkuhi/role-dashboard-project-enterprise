import { useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  notificationConnectionChanged,
  notificationDeleted,
  notificationReceived,
  notificationsCleared,
  notificationsLoaded,
  notificationUpdated,
  unreadCountReceived,
} from "@/features/notifications/notificationsSlice";
import { useAuth } from "@/hooks/useAuth";
import { notificationSocket } from "@/services/notificationSocket";
import { useGetNotificationsQuery } from "@/services/notificationsApi";
import type { AppNotification } from "@/types/notification";

const shouldToast = (notification: AppNotification) => {
  return notification.priority === "high" || notification.priority === "critical";
};

export default function NotificationRealtimeBridge() {
  const dispatch = useDispatch();
  const { isAuthenticated, roles, user } = useAuth();
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (notifications) dispatch(notificationsLoaded(notifications));
  }, [dispatch, notifications]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      notificationSocket.disconnect();
      dispatch(notificationsCleared());
      return;
    }

    dispatch(notificationConnectionChanged({ status: "connecting" }));
    notificationSocket.connect(
      { userId: user.id, roles },
      {
        onConnect: () => dispatch(notificationConnectionChanged({ status: "connected" })),
        onDisconnect: () =>
          dispatch(notificationConnectionChanged({ status: "disconnected" })),
        onError: (message) =>
          dispatch(notificationConnectionChanged({ status: "error", error: message })),
        onNotification: (notification) => {
          dispatch(notificationReceived(notification));
          if (shouldToast(notification)) toast(notification.title);
        },
        onNotificationUpdated: (notification) =>
          dispatch(notificationUpdated(notification)),
        onNotificationDeleted: (id) => dispatch(notificationDeleted(id)),
        onNotificationsSync: (items) => dispatch(notificationsLoaded(items)),
        onUnreadCount: (count) => dispatch(unreadCountReceived(count)),
      }
    );

    return () => notificationSocket.disconnect();
  }, [dispatch, isAuthenticated, roles, user?.id]);

  return null;
}
