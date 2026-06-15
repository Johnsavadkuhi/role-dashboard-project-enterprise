import { Avatar, Box, Button, Flex, Menu, Portal, Spinner, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "@/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n";
import { useLogoutUserMutation } from "@/services/authApi";

function ChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4a1.7 1.7 0 0 0 1.87-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.37.31.7.6 1 .3.29.68.5 1.1.6h.1v4h-.1c-.42.1-.8.31-1.1.6-.29.3-.5.68-.6 1.1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M10 17l5-5-5-5M15 12H3M15 4h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function ProfileMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, roles } = useAuth();
  const { t } = useLanguage();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const displayName = user?.name || t("common.user");
  const accountLabel = user?.username
    ? `@${user.username}`
    : roles[0] || t("common.user");

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
    <Menu.Root
      positioning={{ placement: "bottom-end", gutter: 8 }}
      lazyMount
      unmountOnExit
    >
      <Menu.Trigger asChild>
        <Button
          aria-label={`${t("sidebar.account")}: ${displayName}`}
          bg="white"
          borderColor="gray.200"
          borderRadius="xl"
          borderWidth="1px"
          boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
          h="46px"
          minW={{ base: "46px", lg: "184px" }}
          p={{ base: 0, lg: 1.5 }}
          transition="all 0.2s ease"
          variant="outline"
          _hover={{
            bg: "blue.50",
            borderColor: "blue.200",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.10)",
          }}
          _open={{
            bg: "blue.50",
            borderColor: "blue.300",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.12)",
          }}
        >
          <Flex align="center" gap={2.5} w="full">
            <Box flexShrink={0} position="relative">
              <Avatar.Root colorPalette="blue" size="sm">
                <Avatar.Fallback name={displayName} fontWeight="800" />
                <Avatar.Image src={user?.avatarUrl} alt={displayName} />
              </Avatar.Root>
              <Box
                aria-hidden="true"
                bg="green.500"
                borderColor="white"
                borderRadius="full"
                borderWidth="2px"
                bottom="-1px"
                h="10px"
                position="absolute"
                right="-1px"
                w="10px"
              />
            </Box>

            <Box
              display={{ base: "none", lg: "block" }}
              flex="1"
              minW={0}
              textAlign="start"
            >
              <Text
                color="gray.800"
                fontSize="sm"
                fontWeight="800"
                lineHeight="1.2"
                truncate
              >
                {displayName}
              </Text>
              <Text color="gray.500" fontSize="xs" fontWeight="600" mt={0.5} truncate>
                {accountLabel}
              </Text>
            </Box>

            <Box color="gray.400" display={{ base: "none", lg: "block" }} flexShrink={0}>
              <ChevronIcon />
            </Box>
          </Flex>
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="white"
            borderColor="gray.200"
            borderRadius="2xl"
            borderWidth="1px"
            boxShadow="0 20px 45px rgba(15, 23, 42, 0.16)"
            minW="280px"
            overflow="hidden"
            p={2}
          >
            <Flex align="center" gap={3} px={2.5} py={2.5}>
              <Box flexShrink={0} position="relative">
                <Avatar.Root colorPalette="blue" size="md">
                  <Avatar.Fallback name={displayName} fontWeight="800" />
                  <Avatar.Image src={user?.avatarUrl} alt={displayName} />
                </Avatar.Root>
                <Box
                  bg="green.500"
                  borderColor="white"
                  borderRadius="full"
                  borderWidth="2px"
                  bottom="0"
                  h="11px"
                  position="absolute"
                  right="0"
                  w="11px"
                />
              </Box>
              <Box minW={0}>
                <Text color="gray.900" fontSize="sm" fontWeight="800" truncate>
                  {displayName}
                </Text>
                <Text color="gray.500" fontSize="xs" mt={0.5} truncate>
                  {accountLabel}
                </Text>
              </Box>
            </Flex>

            <Menu.Separator borderColor="gray.100" my={1.5} />

            <Menu.Item
              borderRadius="xl"
              cursor="pointer"
              gap={3}
              minH="44px"
              value="profile"
              onClick={() => navigate("/profile")}
              _highlighted={{ bg: "blue.50", color: "blue.700" }}
            >
              <Flex align="center" color="blue.600" justify="center" w="24px">
                <ProfileIcon />
              </Flex>
              <Text flex="1" fontSize="sm" fontWeight="700">
                {t("sidebar.profile")}
              </Text>
            </Menu.Item>

            <Menu.Item
              borderRadius="xl"
              cursor="pointer"
              gap={3}
              minH="44px"
              value="settings"
              onClick={() => navigate("/settings")}
              _highlighted={{ bg: "blue.50", color: "blue.700" }}
            >
              <Flex align="center" color="gray.500" justify="center" w="24px">
                <SettingsIcon />
              </Flex>
              <Text flex="1" fontSize="sm" fontWeight="700">
                {t("sidebar.settings")}
              </Text>
            </Menu.Item>

            <Menu.Separator borderColor="gray.100" my={1.5} />

            <Menu.Item
              borderRadius="xl"
              color="red.600"
              cursor={isLoading ? "wait" : "pointer"}
              disabled={isLoading}
              gap={3}
              minH="44px"
              value="logout"
              onClick={handleLogout}
              _highlighted={{ bg: "red.50", color: "red.700" }}
            >
              <Flex align="center" justify="center" w="24px">
                {isLoading ? <Spinner size="xs" /> : <LogoutIcon />}
              </Flex>
              <Text flex="1" fontSize="sm" fontWeight="700">
                {t("nav.logout")}
              </Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
