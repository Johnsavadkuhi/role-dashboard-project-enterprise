import type React from "react";
import { Box, Heading } from "@chakra-ui/react";

export default function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" boxShadow="lg" p={6}>
      {title && <Heading as="h2" size="md" mb={4}>{title}</Heading>}
      {children}
    </Box>
  );
}
