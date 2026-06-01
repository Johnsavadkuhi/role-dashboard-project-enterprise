import { Box, Text, VStack } from "@chakra-ui/react";

export default function EmptyState({ title = "No data yet", description = "There is nothing to show here." }) {
  return (
    <Box border="1px dashed" borderColor="gray.300" borderRadius="2xl" p={8} textAlign="center" bg="gray.50">
      <VStack gap={2}>
        <Text fontWeight="800" fontSize="lg">{title}</Text>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  );
}
