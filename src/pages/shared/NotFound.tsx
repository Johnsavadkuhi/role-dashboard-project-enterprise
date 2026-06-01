import { Link } from "react-router-dom";
import { Box, Heading, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" boxShadow="lg" p={8} textAlign="center">
      <VStack gap={3}>
        <Heading>404 Not Found</Heading>
        <Text color="gray.600">This page does not exist.</Text>
        <ChakraLink asChild color="blue.600" fontWeight="700"><Link to="/login">Go to login</Link></ChakraLink>
      </VStack>
    </Box>
  );
}
