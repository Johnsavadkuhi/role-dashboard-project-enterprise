import { NavLink } from "react-router-dom";
import { Box, Heading, Link as ChakraLink, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { sidebarItems } from "@/config/sidebarItems";
import { usePermission } from "@/hooks/usePermission";

export default function Sidebar() {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { hasAnyPermission } = usePermission();

  const visibleItems = sidebarItems.filter((item) => hasAnyPermission(item.permissions));

  if (!sidebarOpen) return null;

  return (
    <Box as="aside" w={{ base: "full", md: "280px" }} bg="gray.900" color="white" p={6} minH={{ base: "auto", md: "100vh" }}>
      <Heading as="h2" size="md" mb={6}>Security Platform</Heading>
      <VStack as="nav" align="stretch" gap={2}>
        {visibleItems.map((item) => (
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
    </Box>
  );
}
