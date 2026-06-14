import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import AuthSessionSync from "@/components/AuthSessionSync";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout() {
  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }} bg="gray.50">
      <AuthSessionSync />
      <Sidebar />
      <Box flex="1" minW={0}>
        <Navbar />
        <Box as="main" p={{ base: 4, md: 7 }}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
