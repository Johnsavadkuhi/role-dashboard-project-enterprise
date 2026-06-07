import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import ProjectTable, { projectTablePresets } from "@/components/projects/ProjectTable";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { mockProjectAssignments, mockProjects } from "@/mocks/projects";
import type { Role } from "@/types";

type ProjectPageConfig = {
  title: string;
  description: string;
  tableTitle: string;
  projects: Parameters<typeof ProjectTable>[0]["projects"];
  columns: Parameters<typeof ProjectTable>[0]["columns"];
  actionLabel: string;
};

function hasRole(roles: Role[], role: Role) {
  return roles.includes(role);
}

function getProjectPageConfig(roles: Role[]): ProjectPageConfig {
  if (hasRole(roles, ROLES.ADMIN)) {
    return {
      title: "Projects",
      description:
        "Monitor every project across security, quality, DevOps, and platform delivery.",
      tableTitle: "All Projects",
      projects: mockProjects,
      columns: projectTablePresets.admin,
      actionLabel: "Manage",
    };
  }

  if (hasRole(roles, ROLES.SECURITY_PROJECT_MANAGER)) {
    return {
      title: "Security Projects",
      description:
        "Assign pentest work, track security risk, and review finding progress.",
      tableTitle: "Security Project Queue",
      projects: mockProjects.filter((project) => project.discipline === "security"),
      columns: projectTablePresets.securityManager,
      actionLabel: "Assign",
    };
  }

  if (hasRole(roles, ROLES.QUALITY_PROJECT_MANAGER)) {
    return {
      title: "Quality Projects",
      description: "Assign QA work, track coverage, and review project quality status.",
      tableTitle: "Quality Project Queue",
      projects: mockProjects.filter(
        (project) => project.discipline === "quality" || project.discipline === "platform"
      ),
      columns: projectTablePresets.qualityManager,
      actionLabel: "Assign",
    };
  }

  if (hasRole(roles, ROLES.DEVOPS)) {
    return {
      title: "Delivery Projects",
      description:
        "Track project environments, repositories, pipelines, and recent delivery activity.",
      tableTitle: "Delivery Projects",
      projects: mockProjects.filter(
        (project) => project.discipline === "devops" || project.discipline === "platform"
      ),
      columns: projectTablePresets.devops,
      actionLabel: "Deploy",
    };
  }

  if (hasRole(roles, ROLES.PENTESTER)) {
    return {
      title: "Assigned Projects",
      description:
        "Work from your project assignment queue and track security testing progress.",
      tableTitle: "Pentest Assignments",
      projects: mockProjectAssignments.filter(
        (assignment) => assignment.assignmentRole === "pentester"
      ),
      columns: projectTablePresets.pentester,
      actionLabel: "Review",
    };
  }

  if (hasRole(roles, ROLES.QA)) {
    return {
      title: "Assigned Projects",
      description:
        "Work from your project assignment queue and track QA execution progress.",
      tableTitle: "QA Assignments",
      projects: mockProjectAssignments.filter(
        (assignment) => assignment.assignmentRole === "qa"
      ),
      columns: projectTablePresets.qa,
      actionLabel: "Test",
    };
  }

  return {
    title: "Projects",
    description: "View project work assigned to your role.",
    tableTitle: "Projects",
    projects: [],
    columns: projectTablePresets.admin,
    actionLabel: "Open",
  };
}

export default function Projects() {
  const { roles } = useAuth();
  const config = getProjectPageConfig(roles as Role[]);

  return (
    <VStack align="stretch" gap={5}>
      <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
        <div>
          <Heading>{config.title}</Heading>
          <Text color="gray.600" mt={2}>
            {config.description}
          </Text>
        </div>
      </HStack>

      <ProjectTable
        title={config.tableTitle}
        projects={config.projects}
        columns={config.columns}
        actionLabel={config.actionLabel}
        onAction={() => undefined}
      />
    </VStack>
  );
}
