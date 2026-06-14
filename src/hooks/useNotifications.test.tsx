import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { setupStore } from "@/app/store";
import { useNotifications } from "@/hooks/useNotifications";
import { adminAuthState } from "@/test/testUsers";
import type { AppNotification } from "@/types/notification";

const socketMock = vi.hoisted(() => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  markRead: vi.fn(),
  markAllRead: vi.fn(),
}));

vi.mock("@/services/notificationSocket", () => ({
  notificationSocket: socketMock,
}));

describe("useNotifications", () => {
  it("connects to the backend socket and consumes notification events", async () => {
    const store = setupStore({ auth: adminAuthState });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const notification: AppNotification = {
      id: "socket-notification",
      type: "project.created",
      title: "Project created",
      message: "A project was created from the backend socket.",
      priority: "medium",
      isRead: false,
      createdAt: "2026-06-14T08:00:00.000Z",
    };

    const { result, unmount } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => expect(socketMock.connect).toHaveBeenCalledOnce());
    expect(socketMock.connect.mock.calls[0][0]).toEqual({
      userId: adminAuthState.user.id,
      roles: adminAuthState.user.roles,
    });

    const handlers = socketMock.connect.mock.calls[0][1];
    act(() => handlers.onConnect());
    expect(result.current.connectionStatus).toBe("connected");

    act(() => handlers.onNotification(notification));
    expect(
      result.current.notifications.find((item) => item.id === notification.id)
    ).toEqual(notification);
    expect(result.current.unreadCount).toBeGreaterThan(0);

    act(() => handlers.onUnreadCount(7));
    expect(result.current.unreadCount).toBe(7);

    unmount();
    expect(socketMock.disconnect).toHaveBeenCalled();
  });
});
