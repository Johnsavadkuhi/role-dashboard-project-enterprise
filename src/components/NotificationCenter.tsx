import { Link as RouterLink } from "react-router-dom";
import {
  Badge,
  Box,
  HStack,
  IconButton,
  Link as ChakraLink,
  Popover,
  Portal,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  allNotificationsMarkedRead,
  notificationMarkedRead,
} from "@/features/notifications/notificationsSlice";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationSocket } from "@/services/notificationSocket";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/services/notificationsApi";
import type { AppNotification, NotificationPriority } from "@/types/notification";
import Button from "@/components/ui/Button";

const priorityColor: Record<NotificationPriority, "gray" | "blue" | "orange" | "red"> = {
  low: "gray",
  medium: "blue",
  high: "orange",
  critical: "red",
};

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

function NotificationItem({ notification }: { notification: AppNotification }) {
  const dispatch = useDispatch();
  const [markRead] = useMarkNotificationReadMutation();

  const handleMarkRead = async () => {
    dispatch(notificationMarkedRead(notification.id));
    notificationSocket.markRead(notification.id);
    try {
      await markRead(notification.id).unwrap();
    } catch {
      // Realtime state remains optimistic; the next server sync will reconcile failures.
    }
  };

  return (
    <Box
      borderBottom="1px solid"
      borderColor="gray.100"
      bg={notification.isRead ? "white" : "blue.50"}
      px={4}
      py={3}
    >
      <HStack justify="space-between" align="start" gap={3}>
        <Box minW={0}>
          <HStack gap={2} align="center" mb={1}>
            <Text fontWeight="800" fontSize="sm" lineClamp={1}>
              {notification.title}
            </Text>
            <Badge colorPalette={priorityColor[notification.priority]} size="sm">
              {notification.priority}
            </Badge>
          </HStack>
          <Text color="gray.600" fontSize="sm" lineClamp={2}>
            {notification.message}
          </Text>
          <Text color="gray.500" fontSize="xs" mt={2}>
            {formatTime(notification.createdAt)}
          </Text>
        </Box>
        {!notification.isRead && (
          <Button variant="ghost" size="sm" onClick={handleMarkRead}>
            Read
          </Button>
        )}
      </HStack>
      {notification.actionUrl && (
        <ChakraLink
          asChild
          color="blue.600"
          fontSize="sm"
          fontWeight="700"
          mt={2}
          display="inline-flex"
        >
          <RouterLink to={notification.actionUrl}>Open</RouterLink>
        </ChakraLink>
      )}
    </Box>
  );
}

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { connectionStatus, notifications, unreadCount } = useNotifications();
  const [markAllRead, { isLoading }] = useMarkAllNotificationsReadMutation();

  const handleMarkAllRead = async () => {
    dispatch(allNotificationsMarkedRead());
    notificationSocket.markAllRead();
    try {
      await markAllRead().unwrap();
    } catch {
      // Realtime state remains optimistic; the next server sync will reconcile failures.
    }
  };

  return (
    <Popover.Root positioning={{ placement: "bottom-end" }} lazyMount unmountOnExit>
      <Popover.Trigger asChild>
        <IconButton
          aria-label={`Notifications, ${unreadCount} unread`}
          colorPalette="blue"
          variant="subtle"
          position="relative"
        >
          <BellIcon />
          {unreadCount > 0 && (
            <Badge
              colorPalette="red"
              variant="solid"
              position="absolute"
              top="-1"
              right="-1"
              minW="5"
              h="5"
              px="1"
              justifyContent="center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width={{ base: "calc(100vw - 32px)", sm: "420px" }}
            maxH="640px"
            overflow="hidden"
          >
            <Popover.Header>
              <HStack justify="space-between" gap={3}>
                <Box>
                  <Popover.Title fontWeight="800">Notifications</Popover.Title>
                  <Text color="gray.500" fontSize="xs">
                    Realtime status: {connectionStatus}
                  </Text>
                </Box>
                <Button
                  variant="ghost"
                  size="sm"
                  isLoading={isLoading}
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </Button>
              </HStack>
            </Popover.Header>
            <Separator />
            <Popover.Body p={0}>
              {notifications.length === 0 ? (
                <VStack align="stretch" gap={1} p={4}>
                  <Text fontWeight="700">No notifications</Text>
                  <Text color="gray.600" fontSize="sm">
                    New project, review, report, and system events will appear here.
                  </Text>
                </VStack>
              ) : (
                <Box maxH="480px" overflowY="auto">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </Box>
              )}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
