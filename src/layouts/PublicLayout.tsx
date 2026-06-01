import { Outlet, Link } from "react-router-dom";
import { Box, Container, HStack, Link as ChakraLink } from "@chakra-ui/react";

export default function PublicLayout() {
  return (
    <Box minH="100vh" bg="gray.50" py={8} px={4}>
      <HStack as="nav" justify="center" spacing={6} mb={8} color="gray.600" fontWeight="700">
        <ChakraLink as={Link} to="/login">Login</ChakraLink>
        <ChakraLink as={Link} to="/signup">Signup</ChakraLink>
        <ChakraLink as={Link} to="/forgot-password">Forgot Password</ChakraLink>
      </HStack>
      <Container maxW="xl">
        <Outlet />
      </Container>
    </Box>
  );
}
