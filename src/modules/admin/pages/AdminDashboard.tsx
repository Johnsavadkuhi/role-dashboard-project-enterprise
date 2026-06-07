import { Link } from "react-router-dom";
import { Box, Heading, HStack, SimpleGrid, Stat, Text, VStack } from "@chakra-ui/react";
import ErrorState from "@/components/ErrorState";
import LoadingScreen from "@/components/LoadingScreen";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { mockProjects } from "@/mocks/projects";
import { useGetUsersQuery } from "@/services/usersApi";
import type { User } from "@/types";

function getUsersList(response: unknown): User[] {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== "object") return [];

  const value = response as {
    users?: unknown;
    items?: unknown;
    data?: unknown;
    results?: unknown;
  };
  if (Array.isArray(value.users)) return value.users as User[];
  if (Array.isArray(value.items)) return value.items as User[];
  if (Array.isArray(value.data)) return value.data as User[];
  if (Array.isArray(value.results)) return value.results as User[];

  return [];
}

export default function AdminDashboard() {
  const { data: usersResponse, isLoading, error } = useGetUsersQuery();
  const users = getUsersList(usersResponse);
  const activeProjects = mockProjects.filter(
    (project) => project.status === "active"
  ).length;
  const restrictedUsers = users.filter((user) => user.status === "Inactive").length;

  return (
    <VStack align="stretch" gap={5}>
      <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
        <div>
          <Heading>Admin Dashboard</Heading>
          <Text color="gray.600" mt={2}>
            Review platform health and jump into admin workspaces.
          </Text>
        </div>
      </HStack>

      {isLoading && <LoadingScreen text="Loading admin data..." />}
      {error && <ErrorState error={error} />}
      {!isLoading && !error && (
        <>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Card>
              <Stat.Root>
                <Stat.Label>Projects</Stat.Label>
                <Stat.ValueText>{mockProjects.length}</Stat.ValueText>
                <Stat.HelpText>{activeProjects} active</Stat.HelpText>
              </Stat.Root>
            </Card>
            <Card>
              <Stat.Root>
                <Stat.Label>Users</Stat.Label>
                <Stat.ValueText>{users.length}</Stat.ValueText>
                <Stat.HelpText>{restrictedUsers} restricted</Stat.HelpText>
              </Stat.Root>
            </Card>
            <Card>
              <Stat.Root>
                <Stat.Label>Admin areas</Stat.Label>
                <Stat.ValueText>2</Stat.ValueText>
                <Stat.HelpText>Projects and users</Stat.HelpText>
              </Stat.Root>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
            <Card title="Projects">
              <Box>
                <Text color="gray.600" mb={4}>
                  View every project created and managed by administrators.
                </Text>
                <Button asChild>
                  <Link to="/projects">Open Projects</Link>
                </Button>
              </Box>
            </Card>
            <Card title="User Access">
              <Box>
                <Text color="gray.600" mb={4}>
                  Manage users, roles, permissions, and account state.
                </Text>
                <Button asChild>
                  <Link to="/admin/users">Manage Users</Link>
                </Button>
              </Box>
            </Card>
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
}
