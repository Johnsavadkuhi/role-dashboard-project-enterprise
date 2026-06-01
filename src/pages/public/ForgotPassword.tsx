import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function ForgotPassword() {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" boxShadow="xl" p={{ base: 6, md: 8 }}>
      <VStack align="stretch" gap={2}>
        <Heading size="lg">Forgot Password</Heading>
        <Text color="gray.600">Connect this page to your password reset endpoint when your backend is ready.</Text>
      </VStack>
    </Box>
  );
}
