import { io, type Socket } from "socket.io-client";
import type { AppNotification } from "@/types/notification";

type NotificationSocketHandlers = {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (message: string) => void;
  onNotification?: (notification: AppNotification) => void;
  onNotificationUpdated?: (notification: AppNotification) => void;
  onNotificationDeleted?: (id: string) => void;
  onNotificationsSync?: (notifications: AppNotification[]) => void;
  onUnreadCount?: (count: number) => void;
};

type ConnectOptions = {
  userId: string;
  roles: string[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";

class NotificationSocket {
  private socket?: Socket;

  connect(options: ConnectOptions, handlers: NotificationSocketHandlers) {
    this.disconnect();

    this.socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 8000,
      timeout: 12000,
      auth: {
        userId: options.userId,
        roles: options.roles,
      },
    });

    this.socket.on("connect", () => {
      handlers.onConnect?.();
      this.socket?.emit("notifications:subscribe", {
        userId: options.userId,
        roles: options.roles,
      });
    });

    this.socket.on("disconnect", (reason) => handlers.onDisconnect?.(reason));
    this.socket.on("connect_error", (error) => handlers.onError?.(error.message));
    this.socket.on("notification:new", (notification: AppNotification) =>
      handlers.onNotification?.(notification)
    );
    this.socket.on("notification:updated", (notification: AppNotification) =>
      handlers.onNotificationUpdated?.(notification)
    );
    this.socket.on("notification:deleted", (payload: { id: string }) =>
      handlers.onNotificationDeleted?.(payload.id)
    );
    this.socket.on("notifications:sync", (notifications: AppNotification[]) =>
      handlers.onNotificationsSync?.(notifications)
    );
    this.socket.on("notifications:unread_count", (payload: { count: number }) =>
      handlers.onUnreadCount?.(payload.count)
    );
  }

  markRead(id: string) {
    this.socket?.emit("notification:mark_read", { id });
  }

  markAllRead() {
    this.socket?.emit("notifications:mark_all_read");
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = undefined;
  }
}

export const notificationSocket = new NotificationSocket();
