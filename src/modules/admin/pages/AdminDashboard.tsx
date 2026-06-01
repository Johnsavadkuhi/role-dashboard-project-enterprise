import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetUsersQuery } from "@/services/usersApi";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import LoadingScreen from "@/components/LoadingScreen";
import PermissionGate from "@/components/PermissionGate";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RolePermissionManager from "@/modules/admin/components/RolePermissionManager";

export default function AdminDashboard() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();

  return (
    <VStack align="stretch" gap={5}>
      <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
        <div>
          <Heading>Admin Dashboard</Heading>
          <Text color="gray.600" mt={2}>Manage users, roles, and fine-grained permissions.</Text>
        </div>
        <PermissionGate permissions={[PERMISSIONS.USERS_CREATE]}>
          <Button>Create User</Button>
        </PermissionGate>
      </HStack>

      {isLoading && <LoadingScreen text="Loading users..." />}
      {error && <ErrorState error={error} />}
      {!isLoading && !error && users.length === 0 && (
        <Card title="User Management">
          <EmptyState title="No users loaded" description="Connect the backend /users endpoint or enable MSW mocks." />
        </Card>
      )}
      {!isLoading && !error && users.length > 0 && <RolePermissionManager users={users} />}
    </VStack>
  );
}
