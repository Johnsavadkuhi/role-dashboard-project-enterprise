import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Box, Heading, HStack, Separator, SimpleGrid, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { PERMISSIONS } from "@/constants/permissions";
import { ROLE_LABELS, ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";
import { useUpdateUserMutation } from "@/services/usersApi";
import type { Permission, Role, User } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const allRoles = Object.values(ROLES) as Role[];
const allPermissions = Object.values(PERMISSIONS) as Permission[];

function toggleValue<T extends string>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function RolePermissionManager({ users }: { users: User[] }) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || "");
  const selectedUser = users.find((user) => user.id === selectedUserId) || users[0];

  const [draftRoles, setDraftRoles] = useState<Role[]>(selectedUser?.roles || []);
  const [draftPermissions, setDraftPermissions] = useState<Permission[]>(selectedUser?.permissions || []);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const groupedPermissions = useMemo(() => {
    return allPermissions.reduce<Record<string, Permission[]>>((groups, permission) => {
      const group = permission.split(".")[0];
      groups[group] = groups[group] || [];
      groups[group].push(permission);
      return groups;
    }, {});
  }, []);

  const handleSelectUser = (userId: string) => {
    const user = users.find((item) => item.id === userId);
    setSelectedUserId(userId);
    setDraftRoles(user?.roles || []);
    setDraftPermissions(user?.permissions || []);
  };

  const handleToggleRole = (role: Role) => {
    const nextRoles = toggleValue(draftRoles, role);
    setDraftRoles(nextRoles);
    setDraftPermissions(getPermissionsFromRoles(nextRoles) as Permission[]);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      await updateUser({ ...selectedUser, roles: draftRoles, permissions: draftPermissions }).unwrap();
      toast.success("User roles and permissions updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  if (!selectedUser) {
    return <Card title="Role & Permission Manager"><Text>No users available.</Text></Card>;
  }

  return (
    <Card title="Role & Permission Admin Management">
      <SimpleGrid columns={{ base: 1, lg: 2 }} templateColumns={{ base: "1fr", lg: "280px 1fr" }} gap={6}>
        <Box borderRight={{ base: 0, lg: "1px solid" }} borderBottom={{ base: "1px solid", lg: 0 }} borderColor="gray.200" pr={{ base: 0, lg: 4 }} pb={{ base: 4, lg: 0 }}>
          <Heading as="h3" size="sm" mb={4}>Users</Heading>
          <VStack align="stretch" gap={3}>
            {users.map((user) => (
              <Box
                as="button"
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                textAlign="left"
                p={4}
                border="1px solid"
                borderColor={user.id === selectedUser.id ? "blue.500" : "gray.200"}
                bg={user.id === selectedUser.id ? "blue.50" : "white"}
                borderRadius="xl"
                _hover={{ borderColor: "blue.400", bg: "blue.50" }}
              >
                <Text fontWeight="800">{user.name}</Text>
                <Text color="gray.600" fontSize="sm">{user.email}</Text>
                <Text color="gray.500" fontSize="xs">{user.roles.join(", ")}</Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <VStack align="stretch" gap={6}>
          <HStack justify="space-between" align="start" flexWrap="wrap">
            <Box>
              <Heading as="h3" size="md">{selectedUser.name}</Heading>
              <Text color="gray.600">{selectedUser.email}</Text>
            </Box>
            <Button onClick={handleSave} isLoading={isLoading} loadingText="Saving...">Save Access</Button>
          </HStack>

          <Box>
            <Heading as="h4" size="sm" mb={3}>Roles</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              {allRoles.map((role) => (
                <Box as="label" key={role} display="flex" alignItems="center" gap={3} p={3} border="1px solid" borderColor="gray.200" borderRadius="xl" cursor="pointer" _hover={{ bg: "gray.50" }}>
                  <input type="checkbox" checked={draftRoles.includes(role)} onChange={() => handleToggleRole(role)} />
                  <Text fontWeight="600">{ROLE_LABELS[role]}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Separator />

          <Box>
            <Heading as="h4" size="sm" mb={2}>Direct Permissions</Heading>
            <Text color="gray.600" mb={4}>Role changes auto-fill default permissions. You can still fine-tune permissions manually.</Text>
            <VStack align="stretch" gap={4}>
              {Object.entries(groupedPermissions).map(([group, permissions]) => (
                <Box key={group} border="1px solid" borderColor="gray.200" borderRadius="2xl" p={4}>
                  <Heading as="h5" size="xs" textTransform="capitalize" mb={3}>{group}</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    {permissions.map((permission) => (
                      <Box as="label" key={permission} display="flex" alignItems="center" gap={3} p={2} borderRadius="lg" cursor="pointer" _hover={{ bg: "gray.50" }}>
                        <input
                          type="checkbox"
                          checked={draftPermissions.includes(permission)}
                          onChange={() => setDraftPermissions(toggleValue(draftPermissions, permission))}
                        />
                        <Text fontSize="sm">{permission}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
          </Box>

          <Wrap>
            {draftPermissions.map((permission) => <WrapItem key={permission}><Badge>{permission}</Badge></WrapItem>)}
          </Wrap>
        </VStack>
      </SimpleGrid>
    </Card>
  );
}
