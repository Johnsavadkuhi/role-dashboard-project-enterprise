import { useDispatch } from "react-redux";
import { Box, Flex, HStack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { openDrawer, toggleSidebar } from "@/features/ui/uiSlice";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n";
import NotificationCenter from "@/components/NotificationCenter";
import ProfileMenu from "@/components/ProfileMenu";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, roles } = useAuth();

  const { t } = useLanguage();

  return (
    <Flex
      as="header"
      h="72px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      align="center"
      justify="space-between"
      px={6}
      position="sticky"
      top={0}
      zIndex={5}
      boxShadow="sm"
    >
      <HStack gap={4} minW={0}>
        <Button
          variant="ghost"
          display={{ base: "inline-flex", md: "none" }}
          aria-label={t("nav.toggleSidebar")}
          onClick={() => dispatch(openDrawer())}
        >
          ☰
        </Button>
        <Button
          variant="ghost"
          display={{ base: "none", md: "inline-flex" }}
          aria-label={t("nav.toggleSidebar")}
          onClick={() => dispatch(toggleSidebar())}
        >
          ☰
        </Button>
        <Box minW={0}>
          <Text fontWeight="800" lineClamp={1}>
            {user?.name || "User"}
          </Text>
          <Wrap gap={2} mt={1}>
            {roles.map((role) => (
              <WrapItem key={role}>
                <Badge>{role}</Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </HStack>
      <HStack gap={3}>
        <LanguageSwitcher />
        <NotificationCenter />
        <ProfileMenu />
      </HStack>
    </Flex>
  );
}
