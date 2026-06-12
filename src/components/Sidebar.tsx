import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  CloseButton,
  Drawer,
  Flex,
  HStack,
  Link as ChakraLink,
  Portal,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { sidebarItems, type SidebarItem } from "@/config/sidebarItems";
import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";
import { closeDrawer, openDrawer } from "@/features/ui/uiSlice";
import { usePermission } from "@/hooks/usePermission";
import { useLanguage } from "@/i18n";
import { getDashboardPathByRoles } from "@/utils/dashboard";
import { hasPermissionGrant } from "@/utils/permissionGrants";

type IconName = SidebarItem["icon"];

const sectionOrder = [
  "Dashboards",
  "Admin",
  "Security Manager",
  "Pentester",
  "DevOps",
  "Representative",
  "Quality Manager",
  "Quality Assurance",
  "Workspace",
  "Account",
];

const roleFeatureSections: Array<{
  icon: SidebarItem["icon"];
  permission: string;
  role: string;
  section: string;
  sectionKey: SidebarItem["sectionKey"];
}> = [
  {
    icon: "folder",
    permission: PERMISSIONS.ADMIN_ALL,
    role: ROLES.ADMIN,
    section: "Admin",
    sectionKey: "sidebar.admin",
  },
  {
    icon: "shield",
    permission: PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ,
    role: ROLES.SECURITY_PROJECT_MANAGER,
    section: "Security Manager",
    sectionKey: "sidebar.roleSecurityManager",
  },
  {
    icon: "target",
    permission: PERMISSIONS.PENTEST_DASHBOARD_READ,
    role: ROLES.PENTESTER,
    section: "Pentester",
    sectionKey: "sidebar.rolePentester",
  },
  {
    icon: "server",
    permission: PERMISSIONS.DEVOPS_DASHBOARD_READ,
    role: ROLES.DEVOPS,
    section: "DevOps",
    sectionKey: "sidebar.roleDevops",
  },
  {
    icon: "briefcase",
    permission: PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ,
    role: ROLES.REPRESENTATIVE,
    section: "Representative",
    sectionKey: "sidebar.roleRepresentative",
  },
  {
    icon: "clipboard",
    permission: PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ,
    role: ROLES.QUALITY_PROJECT_MANAGER,
    section: "Quality Manager",
    sectionKey: "sidebar.roleQualityManager",
  },
  {
    icon: "check",
    permission: PERMISSIONS.QA_DASHBOARD_READ,
    role: ROLES.QA,
    section: "Quality Assurance",
    sectionKey: "sidebar.roleQa",
  },
];

const iconPaths: Record<string, string[]> = {
  briefcase: [
    "M10 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",
    "M4 7h20v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z",
    "M4 12h20",
  ],
  check: ["M20 7 10 17l-5-5", "M4 4h20v20H4V4Z"],
  clipboard: ["M9 5h10", "M9 9h10", "M9 13h6", "M6 3h16v20H6V3Z"],
  folder: ["M3 7h7l2 2h13v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"],
  layout: ["M4 5h20v16H4V5Z", "M4 10h20", "M11 10v11"],
  plus: ["M12 5v14", "M5 12h14", "M3 3h18v18H3V3Z"],
  server: ["M5 5h18v6H5V5Z", "M5 15h18v6H5v-6Z", "M8 8h.01", "M8 18h.01"],
  settings: [
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    "M4 12h2m12 0h2M12 4v2m0 12v2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4",
  ],
  shield: ["M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z"],
  target: [
    "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    "M12 12h.01",
  ],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 22a8 8 0 0 1 16 0"],
  users: [
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M17 10a3 3 0 1 0 0-6",
    "M3 22a7 7 0 0 1 12 0",
    "M15 18a6 6 0 0 1 6 4",
  ],
};

function NavIcon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="16"
    >
      {(iconPaths[name] || iconPaths.folder).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

function groupItems(items: SidebarItem[]) {
  const grouped = items.reduce<Record<string, SidebarItem[]>>((groups, item) => {
    groups[item.section] = groups[item.section] || [];
    groups[item.section].push(item);
    return groups;
  }, {});

  return Object.entries(grouped).sort(([a], [b]) => {
    const aIndex = sectionOrder.indexOf(a);
    const bIndex = sectionOrder.indexOf(b);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}

function NavigationPanel({
  onNavigate,
  sections,
}: {
  onNavigate?: () => void;
  sections: Array<[string, SidebarItem[]]>;
}) {
  const { t } = useLanguage();
  const location = useLocation();
  const activePath = `${location.pathname}${location.search}`;

  return (
    <Flex direction="column" h="full" minH={0} className="enterprise-nav">
      <Box px={5} py={5}>
        <HStack gap={3}>
          <Flex
            boxSize="9"
            borderRadius="md"
            align="center"
            justify="center"
            bg="gray.900"
            color="white"
            fontSize="sm"
            fontWeight="800"
          >
            SP
          </Flex>
          <Box minW={0}>
            <Text fontSize="md" fontWeight="800" lineClamp={1}>
              {t("app.name")}
            </Text>
            <Text color="gray.500" fontSize="xs" fontWeight="600">
              {t("nav.console")}
            </Text>
          </Box>
        </HStack>
      </Box>

      <Separator />

      <VStack as="nav" align="stretch" gap={5} px={3} py={4} overflowY="auto">
        {sections.map(([section, items]) => (
          <VStack key={section} align="stretch" gap={1}>
            <Text
              px={3}
              pb={1}
              color="gray.500"
              fontSize="xs"
              fontWeight="800"
              letterSpacing="0"
              className="enterprise-nav-section"
            >
              {t(items[0].sectionKey)}
            </Text>

            {items.map((item) => (
              <ChakraLink
                asChild
                key={item.path}
                borderRadius="md"
                color="gray.700"
                fontSize="sm"
                fontWeight="650"
                _hover={{ textDecoration: "none" }}
                _focus={{ outline: "none", boxShadow: "none" }}
                _focusVisible={{ outline: "none", boxShadow: "none" }}
                css={{
                  "&.active .nav-item": {
                    background: "#f8fafc",
                    borderColor: "transparent",
                    color: "#1d4ed8",
                  },
                  "&:focus .nav-item, &:focus-visible .nav-item": {
                    boxShadow: "none",
                    outline: "none",
                  },
                  "&.active .nav-accent": {
                    opacity: 1,
                  },
                  "&.active .nav-icon": {
                    background: "#eff6ff",
                    color: "#1d4ed8",
                  },
                }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive && activePath === item.path ? "active" : undefined
                  }
                  end
                  onClick={onNavigate}
                >
                  <HStack
                    className="nav-item"
                    position="relative"
                    gap={3}
                    px={3}
                    py={2.5}
                    minH="42px"
                    border="1px solid"
                    borderColor="transparent"
                    borderRadius="md"
                    outline="none"
                    transition="background 120ms ease, border-color 120ms ease, color 120ms ease"
                    _hover={{ bg: "gray.50", borderColor: "transparent" }}
                    _focus={{ boxShadow: "none", outline: "none" }}
                    _focusVisible={{ boxShadow: "none", outline: "none" }}
                  >
                    <Box
                      className="nav-accent"
                      position="absolute"
                      insetStart="-1px"
                      top="8px"
                      bottom="8px"
                      w="3px"
                      borderRadius="full"
                      bg="blue.600"
                      opacity={0}
                    />
                    <Flex
                      className="nav-icon"
                      boxSize="8"
                      shrink={0}
                      borderRadius="md"
                      align="center"
                      justify="center"
                      bg="gray.100"
                      color="gray.600"
                    >
                      <NavIcon name={item.icon} />
                    </Flex>
                    <Text lineClamp={1}>{t(item.titleKey)}</Text>
                  </HStack>
                </NavLink>
              </ChakraLink>
            ))}
          </VStack>
        ))}
      </VStack>
    </Flex>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const { drawerOpen, sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { hasAnyPermission, permissions, roles } = usePermission();
  const { t } = useLanguage();
  const primaryDashboardItem: SidebarItem = {
    icon: "layout",
    title: "Dashboard",
    titleKey: "sidebar.dashboard",
    path: getDashboardPathByRoles(roles, permissions),
    permissions: [],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  };
  const featureItems = sidebarItems.filter((item) => {
    if (item.section === "Dashboards") return false;
    if (item.section === "Workspace" && item.path === "/projects") return false;

    const hasRequiredPermission = hasAnyPermission(item.permissions);
    const hasRequiredRole =
      !item.roles?.length || item.roles.some((role) => roles.includes(role));

    return hasRequiredPermission && hasRequiredRole;
  });
  const roleFeatureItems: SidebarItem[] = roleFeatureSections
    .filter(
      (section) =>
        roles.includes(section.role) &&
        hasPermissionGrant(permissions, section.permission)
    )
    .map((section) => ({
      icon: section.icon,
      title: "Projects",
      titleKey: "sidebar.projects",
      path: `/projects?role=${section.role}`,
      permissions: [section.permission],
      roles: [section.role],
      section: section.section,
      sectionKey: section.sectionKey,
    }));
  const sections = groupItems([
    primaryDashboardItem,
    ...featureItems,
    ...roleFeatureItems,
  ]);

  return (
    <>
      {sidebarOpen && (
        <Box
          as="aside"
          display={{ base: "none", md: "block" }}
          w="292px"
          bg="white"
          borderRight="1px solid"
          borderColor="gray.200"
          minH="100vh"
          position="sticky"
          top={0}
          flexShrink={0}
        >
          <NavigationPanel sections={sections} />
        </Box>
      )}

      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(event) => {
          if (event.open) dispatch(openDrawer());
          else dispatch(closeDrawer());
        }}
        placement="start"
        size="xs"
      >
        <Portal>
          <Drawer.Backdrop bg="blackAlpha.500" />
          <Drawer.Positioner>
            <Drawer.Content maxW="320px" bg="white">
              <Drawer.Header borderBottom="1px solid" borderColor="gray.200" py={4}>
                <Drawer.Title fontSize="md">{t("app.name")}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body p={0}>
                <NavigationPanel
                  sections={sections}
                  onNavigate={() => dispatch(closeDrawer())}
                />
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton position="absolute" top="3" insetEnd="3" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
