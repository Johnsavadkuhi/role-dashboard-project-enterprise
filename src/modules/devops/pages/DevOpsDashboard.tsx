import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetDeploymentsQuery, useGetServersQuery } from "@/services/devopsApi";
import PermissionGate from "@/components/PermissionGate";
import EmptyState from "@/components/EmptyState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DevOpsDashboard() {
  const { data: deployments = [] } = useGetDeploymentsQuery(undefined, { skip: true });
  const { data: servers = [] } = useGetServersQuery(undefined, { skip: true });

  return (
    <VStack align="stretch" spacing={5}>
      <HStack justify="space-between" flexWrap="wrap">
        <div>
          <Heading>DevOps Dashboard</Heading>
          <Text color="gray.600" mt={2}>Monitor deployments, servers, pipelines, and infrastructure health.</Text>
        </div>
        <PermissionGate permissions={[PERMISSIONS.DEPLOYMENTS_CREATE]}><Button>Start Deployment</Button></PermissionGate>
      </HStack>
      <Card title="Deployments">{deployments.length === 0 && <EmptyState title="No deployments loaded" />}</Card>
      <Card title="Servers">{servers.length === 0 && <EmptyState title="No servers loaded" />}</Card>
    </VStack>
  );
}
