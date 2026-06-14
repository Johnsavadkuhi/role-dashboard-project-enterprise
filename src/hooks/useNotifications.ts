import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch } from "@/app/store";
import {
  allNotificationsMarkedRead,
  notificationConnectionChanged,
  notificationDeleted,
  notificationMarkedRead,
  notificationReceived,
  notificationsCleared,
  notificationsLoaded,
  notificationUpdated,
  selectNotificationConnectionStatus,
  selectNotifications,
  selectUnreadNotificationCount,
  unreadCountReceived,
} from "@/features/notifications/notificationsSlice";
import { useAuth } from "@/hooks/useAuth";
import { notificationSocket } from "@/services/notificationSocket";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/services/notificationsApi";
import type { AppNotification } from "@/types/notification";

const shouldToast = (notification: AppNotification) =>
  notification.priority === "high" || notification.priority === "critical";

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, roles, user } = useAuth();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadNotificationCount);
  const connectionStatus = useSelector(selectNotificationConnectionStatus);
  const {
    data: initialNotifications,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, { skip: !isAuthenticated });
  const [markNotificationRead, markReadState] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead, markAllReadState] =
    useMarkAllNotificationsReadMutation();
  const [deleteNotificationRequest, deleteState] = useDeleteNotificationMutation();

  useEffect(() => {
    if (initialNotifications) {
      dispatch(notificationsLoaded(initialNotifications));
    }
  }, [dispatch, initialNotifications]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      notificationSocket.disconnect();
      dispatch(notificationsCleared());
      return;
    }

    if (isLoading) return;

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
  }, [dispatch, isAuthenticated, isLoading, roles, user?.id]);

  const markRead = useCallback(
    async (id: string) => {
      dispatch(notificationMarkedRead(id));
      notificationSocket.markRead(id);
      try {
        return await markNotificationRead(id).unwrap();
      } catch (requestError) {
        refetch();
        throw requestError;
      }
    },
    [dispatch, markNotificationRead, refetch]
  );

  const markAllRead = useCallback(async () => {
    dispatch(allNotificationsMarkedRead());
    notificationSocket.markAllRead();
    try {
      return await markAllNotificationsRead().unwrap();
    } catch (requestError) {
      refetch();
      throw requestError;
    }
  }, [dispatch, markAllNotificationsRead, refetch]);

  const removeNotification = useCallback(
    async (id: string) => {
      dispatch(notificationDeleted(id));
      try {
        return await deleteNotificationRequest(id).unwrap();
      } catch (requestError) {
        refetch();
        throw requestError;
      }
    },
    [deleteNotificationRequest, dispatch, refetch]
  );

  return {
    notifications,
    unreadCount,
    connectionStatus,
    hasUnread: unreadCount > 0,
    error,
    isLoading,
    isFetching,
    isMarkingRead: markReadState.isLoading,
    isMarkingAllRead: markAllReadState.isLoading,
    isDeleting: deleteState.isLoading,
    markRead,
    markAllRead,
    removeNotification,
    refetch,
  };
}
