import { Outlet, Link } from "react-router-dom";
import { Box, Container, HStack, Link as ChakraLink } from "@chakra-ui/react";

export default function PublicLayout() {
  return (
    <Box minH="100vh" bg="gray.50" py={8} px={4}>
      <HStack as="nav" justify="center" gap={6} mb={8} color="gray.600" fontWeight="700">
        <ChakraLink asChild><Link to="/login">Login</Link></ChakraLink>
        <ChakraLink asChild><Link to="/signup">Signup</Link></ChakraLink>
        <ChakraLink asChild><Link to="/forgot-password">Forgot Password</Link></ChakraLink>
      </HStack>
      <Container maxW="xl">
        <Outlet />
      </Container>
    </Box>
  );
}
