import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function Unauthorized() {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" boxShadow="lg" p={8}>
      <VStack spacing={2}>
        <Heading>403 Unauthorized</Heading>
        <Text color="gray.600">You do not have permission to access this page.</Text>
      </VStack>
    </Box>
  );
}
