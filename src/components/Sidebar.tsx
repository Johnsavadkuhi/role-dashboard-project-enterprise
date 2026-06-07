import { NavLink } from "react-router-dom";
import { Box, Heading, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { sidebarItems } from "@/config/sidebarItems";
import { usePermission } from "@/hooks/usePermission";

export default function Sidebar() {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { hasAnyPermission } = usePermission();

  const visibleItems = sidebarItems.filter((item) => hasAnyPermission(item.permissions));
  const sections = visibleItems.reduce<Record<string, typeof visibleItems>>(
    (groups, item) => {
      groups[item.section] = groups[item.section] || [];
      groups[item.section].push(item);
      return groups;
    },
    {}
  );

  if (!sidebarOpen) return null;

  return (
    <Box
      as="aside"
      w={{ base: "full", md: "280px" }}
      bg="gray.900"
      color="white"
      p={6}
      minH={{ base: "auto", md: "100vh" }}
    >
      <Heading as="h2" size="md" mb={6}>
        Security Platform
      </Heading>
      <VStack as="nav" align="stretch" gap={5}>
        {Object.entries(sections).map(([section, items]) => (
          <VStack key={section} align="stretch" gap={2}>
            <Text
              color="gray.500"
              fontSize="xs"
              fontWeight="800"
              textTransform="uppercase"
              letterSpacing="0"
            >
              {section}
            </Text>
            {items.map((item) => (
              <ChakraLink
                asChild
                key={item.path}
                px={4}
                py={3}
                borderRadius="xl"
                color="gray.300"
                _hover={{ bg: "gray.700", color: "white" }}
                css={{ "&.active": { background: "#1e293b", color: "white" } }}
              >
                <NavLink to={item.path}>{item.title}</NavLink>
              </ChakraLink>
            ))}
          </VStack>
        ))}
      </VStack>
    </Box>
  );
}
