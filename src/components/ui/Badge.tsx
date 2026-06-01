import type React from "react";
import { Badge as ChakraBadge } from "@chakra-ui/react";

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <ChakraBadge colorScheme="blue" borderRadius="full" px={3} py={1} textTransform="none">
      {children}
    </ChakraBadge>
  );
}
