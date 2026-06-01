import { useDispatch } from "react-redux";
import { Box, Flex, HStack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { toggleSidebar } from "@/features/ui/uiSlice";
import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, roles } = useAuth();

  return (
    <Flex
      as="header"
      h="72px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      align="center"
      justify="space-between"
      px={6}
      position="sticky"
      top={0}
      zIndex={5}
      boxShadow="sm"
    >
      <HStack gap={4} minW={0}>
        <Button variant="ghost" aria-label="Toggle sidebar" onClick={() => dispatch(toggleSidebar())}>☰</Button>
        <Box minW={0}>
          <Text fontWeight="800" lineClamp={1}>{user?.name || "User"}</Text>
          <Wrap gap={2} mt={1}>
            {roles.map((role) => <WrapItem key={role}><Badge>{role}</Badge></WrapItem>)}
          </Wrap>
        </Box>
      </HStack>
      <LogoutButton />
    </Flex>
  );
}
