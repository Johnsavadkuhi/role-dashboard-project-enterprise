import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetTestCasesQuery } from "@/services/qaApi";
import PermissionGate from "@/components/PermissionGate";
import EmptyState from "@/components/EmptyState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function QualityAssuranceDashboard() {
  const { data: testCases = [] } = useGetTestCasesQuery(undefined, { skip: true });

  return (
    <VStack align="stretch" spacing={5}>
      <HStack justify="space-between" flexWrap="wrap">
        <div>
          <Heading>Quality Assurance Dashboard</Heading>
          <Text color="gray.600" mt={2}>Manage test cases, bug reports, QA cycles, and release checks.</Text>
        </div>
        <PermissionGate permissions={[PERMISSIONS.QA_TEST_CASES_CREATE]}><Button>Create Test Case</Button></PermissionGate>
      </HStack>
      <Card title="Test Cases">{testCases.length === 0 && <EmptyState title="No test cases loaded" />}</Card>
    </VStack>
  );
}
