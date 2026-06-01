import { Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { PERMISSIONS } from "@/constants/permissions";
import PermissionGate from "@/components/PermissionGate";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SecurityProjectManagerDashboard() {
  return (
    <VStack align="stretch" gap={5}>
      <HStack justify="space-between" flexWrap="wrap">
        <div>
          <Heading>Security Project Manager Dashboard</Heading>
          <Text color="gray.600" mt={2}>
            Assign security projects, review pentester findings, and submit final reports for admin approval.
          </Text>
        </div>
        <PermissionGate permissions={[PERMISSIONS.SECURITY_PROJECTS_ASSIGN]}>
          <Button>Assign Project</Button>
        </PermissionGate>
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={4}>
        <PermissionGate permissions={[PERMISSIONS.SECURITY_PROJECTS_ASSIGN_SELF]}>
          <Card title="Project Assignment">
            <Text color="gray.600" mb={4}>Assign projects to pentesters or take ownership yourself.</Text>
            <Button variant="secondary">Assign to Me</Button>
          </Card>
        </PermissionGate>

        <PermissionGate permissions={[PERMISSIONS.SECURITY_FINDINGS_REVIEW]}>
          <Card title="Finding Review">
            <Text color="gray.600" mb={4}>Review submitted vulnerabilities before they move into reporting.</Text>
            <HStack flexWrap="wrap">
              <Button variant="secondary">Approve</Button>
              <Button variant="danger">Reject</Button>
            </HStack>
          </Card>
        </PermissionGate>

        <PermissionGate permissions={[PERMISSIONS.SECURITY_REPORTS_CREATE]}>
          <Card title="Final Report">
            <Text color="gray.600" mb={4}>Create the final security report and send it to admin for approval.</Text>
            <Button>Submit Report</Button>
          </Card>
        </PermissionGate>
      </SimpleGrid>
    </VStack>
  );
}
