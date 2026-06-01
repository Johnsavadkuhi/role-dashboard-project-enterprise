import { Heading, SimpleGrid, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function Profile() {
  const { user, roles, permissions } = useAuth();

  return (
    <VStack align="stretch" gap={5}>
      <Heading>Profile</Heading>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
        <Card title="User Info">
          <VStack align="stretch" gap={3}>
            <Text><strong>Name:</strong> {user?.name}</Text>
            <Text><strong>Email:</strong> {user?.email}</Text>
            <Wrap>{roles.map((role) => <WrapItem key={role}><Badge>{role}</Badge></WrapItem>)}</Wrap>
          </VStack>
        </Card>
        <Card title="Permissions">
          <Wrap>{permissions.map((permission) => <WrapItem key={permission}><Badge>{permission}</Badge></WrapItem>)}</Wrap>
        </Card>
      </SimpleGrid>
    </VStack>
  );
}
