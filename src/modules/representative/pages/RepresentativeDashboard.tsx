import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetTicketsQuery } from "@/services/ticketsApi";
import PermissionGate from "@/components/PermissionGate";
import EmptyState from "@/components/EmptyState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function RepresentativeDashboard() {
  const { data: tickets = [] } = useGetTicketsQuery(undefined, { skip: true });

  return (
    <VStack align="stretch" gap={5}>
      <HStack justify="space-between" flexWrap="wrap">
        <div>
          <Heading>Representative Dashboard</Heading>
          <Text color="gray.600" mt={2}>Manage customer requests, tickets, and communication workflows.</Text>
        </div>
        <PermissionGate permissions={[PERMISSIONS.TICKETS_CREATE]}><Button>Create Ticket</Button></PermissionGate>
      </HStack>
      <Card title="Tickets">{tickets.length === 0 && <EmptyState title="No tickets loaded" />}</Card>
    </VStack>
  );
}
