import { Link as RouterLink } from "react-router-dom";
import {
  Badge,
  Box,
  Button as ChakraButton,
  Flex,
  HStack,
  IconButton,
  Link as ChakraLink,
  Popover,
  Portal,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/i18n";
import type {
  AppNotification,
  NotificationConnectionStatus,
  NotificationPriority,
} from "@/types/notification";

const priorityStyles: Record<
  NotificationPriority,
  {
    color: string;
    bg: string;
    border: string;
    palette: "gray" | "blue" | "orange" | "red";
  }
> = {
  low: { color: "gray.600", bg: "gray.100", border: "gray.200", palette: "gray" },
  medium: { color: "blue.600", bg: "blue.50", border: "blue.100", palette: "blue" },
  high: { color: "orange.600", bg: "orange.50", border: "orange.100", palette: "orange" },
  critical: { color: "red.600", bg: "red.50", border: "red.100", palette: "red" },
};

const connectionColors: Record<NotificationConnectionStatus, string> = {
  idle: "gray.400",
  connecting: "orange.400",
  connected: "green.500",
  disconnected: "gray.400",
  error: "red.500",
};

function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function NotificationTypeIcon({ notification }: { notification: AppNotification }) {
  const type = notification.entity?.type || notification.type.split(".")[0];

  if (type === "project" || type === "deployment") {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
        <path
          d="M4 7.5h16M7 4v3.5M17 4v3.5M5 20h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path d="m9 14 2 2 4-5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (type === "vulnerability") {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
        <path
          d="M12 3 4.5 6v5.5c0 4.7 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.8 7.5-9.5V6L12 3Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M12 8v5M12 16.5v.1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.9"
        />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M5 21a7 7 0 0 1 14 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return <BellIcon size={18} />;
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (Math.abs(diffSeconds) < 60) return formatter.format(diffSeconds, "second");
  if (Math.abs(diffSeconds) < 3600)
    return formatter.format(Math.round(diffSeconds / 60), "minute");
  if (Math.abs(diffSeconds) < 86400)
    return formatter.format(Math.round(diffSeconds / 3600), "hour");
  if (Math.abs(diffSeconds) < 604800)
    return formatter.format(Math.round(diffSeconds / 86400), "day");

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => Promise<unknown>;
}) {
  const { t } = useLanguage();
  const style = priorityStyles[notification.priority];

  const handleMarkRead = async () => {
    try {
      await onMarkRead(notification.id);
    } catch {
      // Realtime state remains optimistic; the next server sync will reconcile failures.
    }
  };

  return (
    <Box
      bg={notification.isRead ? "white" : "blue.50/60"}
      borderBottomColor="gray.100"
      borderBottomWidth="1px"
      position="relative"
      px={{ base: 3, sm: 4 }}
      py={3.5}
      transition="background 0.2s ease"
      _hover={{ bg: notification.isRead ? "gray.50" : "blue.50" }}
    >
      {!notification.isRead && (
        <Box
          aria-hidden="true"
          bg="blue.500"
          borderRadius="full"
          h="7px"
          insetStart="7px"
          position="absolute"
          top="20px"
          w="7px"
        />
      )}

      <Flex align="flex-start" gap={3} ps={notification.isRead ? 0 : 2}>
        <Flex
          align="center"
          bg={style.bg}
          borderColor={style.border}
          borderRadius="xl"
          borderWidth="1px"
          color={style.color}
          flexShrink={0}
          h="40px"
          justify="center"
          w="40px"
        >
          <NotificationTypeIcon notification={notification} />
        </Flex>

        <Box flex="1" minW={0}>
          <Flex align="flex-start" gap={2} justify="space-between">
            <Box minW={0}>
              <Text
                color="gray.900"
                fontSize="sm"
                fontWeight={notification.isRead ? "700" : "800"}
                lineClamp={1}
              >
                {notification.title}
              </Text>
              {notification.actor?.name && (
                <Text color="gray.500" fontSize="xs" mt={0.5} truncate>
                  {notification.actor.name}
                  {notification.actor.role ? ` / ${notification.actor.role}` : ""}
                </Text>
              )}
            </Box>
            <Badge
              colorPalette={style.palette}
              flexShrink={0}
              size="sm"
              textTransform="capitalize"
              variant="subtle"
            >
              {notification.priority}
            </Badge>
          </Flex>

          <Text color="gray.600" fontSize="sm" lineClamp={2} lineHeight="1.55" mt={1.5}>
            {notification.message}
          </Text>

          <Flex align="center" gap={2} justify="space-between" mt={2.5}>
            <Text color="gray.400" fontSize="xs" fontWeight="600">
              {formatTime(notification.createdAt)}
            </Text>
            <HStack gap={1}>
              {!notification.isRead && (
                <IconButton
                  aria-label={t("common.read")}
                  color="gray.500"
                  h="28px"
                  minW="28px"
                  size="xs"
                  variant="ghost"
                  onClick={handleMarkRead}
                  _hover={{ bg: "green.50", color: "green.600" }}
                >
                  <CheckIcon />
                </IconButton>
              )}
              {notification.actionUrl && (
                <ChakraLink
                  asChild
                  borderRadius="lg"
                  color="blue.600"
                  fontSize="xs"
                  fontWeight="800"
                  px={2}
                  py={1}
                  _hover={{ bg: "blue.100", textDecoration: "none" }}
                >
                  <RouterLink to={notification.actionUrl}>
                    <HStack gap={1}>
                      <Text>{t("common.open")}</Text>
                      <ArrowIcon />
                    </HStack>
                  </RouterLink>
                </ChakraLink>
              )}
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default function NotificationCenter() {
  const { t } = useLanguage();
  const {
    connectionStatus,
    notifications,
    unreadCount,
    isLoading,
    isMarkingAllRead,
    markAllRead,
    markRead,
  } = useNotifications();

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch {
      // Realtime state remains optimistic; the next server sync will reconcile failures.
    }
  };

  return (
    <Popover.Root
      positioning={{ placement: "bottom-end", gutter: 8 }}
      lazyMount
      unmountOnExit
    >
      <Popover.Trigger asChild>
        <IconButton
          aria-label={t("notifications.aria", { count: unreadCount })}
          bg="transparent"
          border="none"
          borderRadius="full"
          color={unreadCount > 0 ? "blue.600" : "gray.600"}
          h="46px"
          minW="46px"
          position="relative"
          transition="all 0.2s ease"
          variant="ghost"
          _hover={{
            bg: "transparent",
            color: "blue.700",
            transform: "scale(1.05)",
          }}
          _open={{
            bg: "transparent",
            color: "blue.700",
            transform: "scale(1.05)",
          }}
          _focusVisible={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.25)" }}
        >
          <BellIcon />
          {unreadCount > 0 && (
            <Flex
              align="center"
              bg="red.500"
              borderColor="white"
              borderRadius="full"
              borderWidth="2px"
              color="white"
              fontSize="9px"
              fontWeight="800"
              h="20px"
              justify="center"
              minW="20px"
              position="absolute"
              px={1}
              right="-6px"
              top="-6px"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Flex>
          )}
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content
            bg="white"
            borderColor="gray.200"
            borderRadius="2xl"
            borderWidth="1px"
            boxShadow="0 24px 55px rgba(15, 23, 42, 0.18)"
            maxH="min(680px, calc(100vh - 96px))"
            overflow="hidden"
            width={{ base: "calc(100vw - 24px)", sm: "430px" }}
          >
            <Popover.Header
              borderBottomColor="gray.100"
              borderBottomWidth="1px"
              px={4}
              py={3.5}
            >
              <Flex align="center" gap={3} justify="space-between">
                <Box minW={0}>
                  <HStack gap={2}>
                    <Popover.Title color="gray.900" fontSize="md" fontWeight="800">
                      {t("notifications.title")}
                    </Popover.Title>
                    {unreadCount > 0 && (
                      <Badge colorPalette="blue" size="sm" variant="subtle">
                        {unreadCount}
                      </Badge>
                    )}
                  </HStack>
                  <HStack gap={1.5} mt={1}>
                    <Box
                      bg={connectionColors[connectionStatus]}
                      borderRadius="full"
                      h="7px"
                      w="7px"
                    />
                    <Text color="gray.500" fontSize="xs">
                      {t("notifications.realtimeStatus", { status: connectionStatus })}
                    </Text>
                  </HStack>
                </Box>

                {unreadCount > 0 && (
                  <ChakraButton
                    color="blue.600"
                    disabled={isMarkingAllRead}
                    fontSize="xs"
                    fontWeight="800"
                    h="32px"
                    px={2.5}
                    size="sm"
                    variant="ghost"
                    onClick={handleMarkAllRead}
                    _hover={{ bg: "blue.50" }}
                  >
                    {isMarkingAllRead ? <Spinner size="xs" /> : <CheckIcon />}
                    {t("notifications.markAllRead")}
                  </ChakraButton>
                )}
              </Flex>
            </Popover.Header>

            <Popover.Body p={0}>
              {isLoading ? (
                <VStack gap={3} justify="center" minH="220px">
                  <Spinner color="blue.500" size="md" />
                  <Text color="gray.500" fontSize="sm">
                    {t("common.loading")}
                  </Text>
                </VStack>
              ) : notifications.length === 0 ? (
                <VStack gap={3} justify="center" minH="280px" px={8} textAlign="center">
                  <Flex
                    align="center"
                    bg="blue.50"
                    borderColor="blue.100"
                    borderRadius="2xl"
                    borderWidth="1px"
                    color="blue.600"
                    h="64px"
                    justify="center"
                    w="64px"
                  >
                    <BellIcon size={28} />
                  </Flex>
                  <Box>
                    <Text color="gray.900" fontWeight="800">
                      {t("notifications.emptyTitle")}
                    </Text>
                    <Text color="gray.500" fontSize="sm" lineHeight="1.6" mt={1}>
                      {t("notifications.emptyDescription")}
                    </Text>
                  </Box>
                </VStack>
              ) : (
                <Box maxH="540px" overflowY="auto" overscrollBehavior="contain">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={markRead}
                    />
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
