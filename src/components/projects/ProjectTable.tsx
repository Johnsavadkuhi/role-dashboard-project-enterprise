import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Badge, Box, HStack, NativeSelect, Table, Text, VStack } from "@chakra-ui/react";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type {
  Project,
  ProjectAssignment,
  ProjectAssignmentStatus,
  ProjectDiscipline,
  ProjectPriority,
  ProjectStatus,
} from "@/types";

type Align = "start" | "center" | "end";
type SortDirection = "asc" | "desc";
type ProjectTableRow = Project & Partial<ProjectAssignment>;

export type ProjectTableColumn = {
  key: keyof ProjectTableRow | "summary";
  label: string;
  minW?: string;
  align?: Align;
  sortable?: boolean;
  render?: (project: ProjectTableRow) => ReactNode;
  sortValue?: (project: ProjectTableRow) => string | number;
};

type ProjectTableProps = {
  projects: ProjectTableRow[];
  columns: ProjectTableColumn[];
  title?: string;
  emptyTitle?: string;
  actionLabel?: string;
  onAction?: (project: ProjectTableRow) => void;
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  blocked: "Blocked",
  review: "In review",
  completed: "Completed",
};

const statusPalettes: Record<ProjectStatus, string> = {
  planning: "gray",
  active: "blue",
  blocked: "red",
  review: "purple",
  completed: "green",
};

const priorityLabels: Record<ProjectPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const priorityPalettes: Record<ProjectPriority, string> = {
  low: "green",
  medium: "yellow",
  high: "orange",
  critical: "red",
};

const assignmentStatusLabels: Record<ProjectAssignmentStatus, string> = {
  assigned: "Assigned",
  in_progress: "In progress",
  submitted: "Submitted",
  changes_requested: "Changes requested",
  accepted: "Accepted",
};

const assignmentStatusPalettes: Record<ProjectAssignmentStatus, string> = {
  assigned: "gray",
  in_progress: "blue",
  submitted: "purple",
  changes_requested: "orange",
  accepted: "green",
};

const disciplineLabels: Record<ProjectDiscipline, string> = {
  security: "Security",
  quality: "Quality",
  devops: "DevOps",
  platform: "Platform",
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function normalize(value: string | number | undefined) {
  if (value === undefined) return "";
  return typeof value === "number" ? value : value.toLowerCase();
}

function getDefaultSortValue(project: ProjectTableRow, key: ProjectTableColumn["key"]) {
  if (key === "summary") return project.name;
  return project[key] ?? "";
}

function ProgressMeter({ value }: { value: number }) {
  const palette = value >= 80 ? "green.500" : value >= 50 ? "blue.500" : "orange.500";

  return (
    <HStack gap={3} minW="140px">
      <Box flex="1" h="2" bg="gray.100" borderRadius="full" overflow="hidden">
        <Box h="full" width={`${value}%`} bg={palette} borderRadius="full" />
      </Box>
      <Text fontSize="sm" color="gray.700" fontWeight="700" minW="9">
        {value}%
      </Text>
    </HStack>
  );
}

function ProjectSummary({ project }: { project: ProjectTableRow }) {
  return (
    <VStack align="start" gap={1} minW="220px">
      <Text fontWeight="800" color="gray.900">
        {project.name}
      </Text>
      <Text color="gray.500" fontSize="sm">
        {project.client} · {project.id}
      </Text>
    </VStack>
  );
}

export const projectTableColumns = {
  summary: {
    key: "summary",
    label: "Project",
    minW: "260px",
    sortable: true,
    render: (project) => <ProjectSummary project={project} />,
    sortValue: (project) => project.name,
  },
  assignmentStatus: {
    key: "assignmentStatus",
    label: "Assignment",
    minW: "150px",
    sortable: true,
    render: (project) =>
      project.assignmentStatus ? (
        <Badge
          colorPalette={assignmentStatusPalettes[project.assignmentStatus]}
          borderRadius="full"
          px={3}
          py={1}
          textTransform="none"
        >
          {assignmentStatusLabels[project.assignmentStatus]}
        </Badge>
      ) : (
        "-"
      ),
  },
  assignedAt: {
    key: "assignedAt",
    label: "Assigned",
    minW: "130px",
    sortable: true,
    render: (project) => formatDate(project.assignedAt),
    sortValue: (project) =>
      project.assignedAt ? new Date(project.assignedAt).getTime() : 0,
  },
  assignmentDueDate: {
    key: "assignmentDueDate",
    label: "Assignment due",
    minW: "150px",
    sortable: true,
    render: (project) => formatDate(project.assignmentDueDate),
    sortValue: (project) =>
      project.assignmentDueDate ? new Date(project.assignmentDueDate).getTime() : 0,
  },
  reviewer: { key: "reviewer", label: "Reviewer", minW: "190px", sortable: true },
  scope: { key: "scope", label: "Scope", minW: "240px", sortable: true },
  phase: { key: "phase", label: "Phase", minW: "160px", sortable: true },
  submittedItems: {
    key: "submittedItems",
    label: "Submitted",
    minW: "120px",
    align: "end",
    sortable: true,
  },
  client: { key: "client", label: "Client", minW: "160px", sortable: true },
  discipline: {
    key: "discipline",
    label: "Type",
    minW: "130px",
    sortable: true,
    render: (project) => disciplineLabels[project.discipline],
  },
  status: {
    key: "status",
    label: "Status",
    minW: "130px",
    sortable: true,
    render: (project) => (
      <Badge
        colorPalette={statusPalettes[project.status]}
        borderRadius="full"
        px={3}
        py={1}
        textTransform="none"
      >
        {statusLabels[project.status]}
      </Badge>
    ),
  },
  priority: {
    key: "priority",
    label: "Priority",
    minW: "120px",
    sortable: true,
    render: (project) => (
      <Badge
        colorPalette={priorityPalettes[project.priority]}
        borderRadius="full"
        px={3}
        py={1}
        textTransform="none"
      >
        {priorityLabels[project.priority]}
      </Badge>
    ),
  },
  owner: { key: "owner", label: "Owner", minW: "190px", sortable: true },
  assignee: { key: "assignee", label: "Assignee", minW: "180px", sortable: true },
  dueDate: {
    key: "dueDate",
    label: "Due",
    minW: "130px",
    sortable: true,
    render: (project) => formatDate(project.dueDate),
    sortValue: (project) => new Date(project.dueDate).getTime(),
  },
  progress: {
    key: "progress",
    label: "Progress",
    minW: "170px",
    sortable: true,
    render: (project) => <ProgressMeter value={project.progress} />,
  },
  riskScore: {
    key: "riskScore",
    label: "Risk",
    minW: "90px",
    align: "end",
    sortable: true,
  },
  vulnerabilities: {
    key: "vulnerabilities",
    label: "Findings",
    minW: "110px",
    align: "end",
    sortable: true,
  },
  testCoverage: {
    key: "testCoverage",
    label: "Coverage",
    minW: "130px",
    align: "end",
    sortable: true,
    render: (project) => `${project.testCoverage}%`,
  },
  openBugs: {
    key: "openBugs",
    label: "Open bugs",
    minW: "120px",
    align: "end",
    sortable: true,
  },
  environment: {
    key: "environment",
    label: "Environment",
    minW: "140px",
    sortable: true,
  },
  repository: { key: "repository", label: "Repository", minW: "190px", sortable: true },
  pipeline: { key: "pipeline", label: "Pipeline", minW: "150px", sortable: true },
  lastActivity: {
    key: "lastActivity",
    label: "Updated",
    minW: "130px",
    sortable: true,
    render: (project) => formatDate(project.lastActivity),
    sortValue: (project) => new Date(project.lastActivity).getTime(),
  },
} satisfies Record<string, ProjectTableColumn>;

export const projectTablePresets = {
  admin: [
    projectTableColumns.summary,
    projectTableColumns.discipline,
    projectTableColumns.status,
    projectTableColumns.priority,
    projectTableColumns.owner,
    projectTableColumns.assignee,
    projectTableColumns.dueDate,
    projectTableColumns.progress,
  ],
  pentester: [
    projectTableColumns.summary,
    projectTableColumns.assignmentStatus,
    projectTableColumns.priority,
    projectTableColumns.scope,
    projectTableColumns.phase,
    projectTableColumns.riskScore,
    projectTableColumns.vulnerabilities,
    projectTableColumns.assignmentDueDate,
    projectTableColumns.progress,
  ],
  qa: [
    projectTableColumns.summary,
    projectTableColumns.assignmentStatus,
    projectTableColumns.priority,
    projectTableColumns.scope,
    projectTableColumns.phase,
    projectTableColumns.testCoverage,
    projectTableColumns.openBugs,
    projectTableColumns.assignmentDueDate,
    projectTableColumns.progress,
  ],
  devops: [
    projectTableColumns.summary,
    projectTableColumns.status,
    projectTableColumns.priority,
    projectTableColumns.environment,
    projectTableColumns.repository,
    projectTableColumns.pipeline,
    projectTableColumns.lastActivity,
  ],
  securityManager: [
    projectTableColumns.summary,
    projectTableColumns.status,
    projectTableColumns.priority,
    projectTableColumns.assignee,
    projectTableColumns.riskScore,
    projectTableColumns.vulnerabilities,
    projectTableColumns.dueDate,
  ],
  qualityManager: [
    projectTableColumns.summary,
    projectTableColumns.status,
    projectTableColumns.priority,
    projectTableColumns.assignee,
    projectTableColumns.testCoverage,
    projectTableColumns.openBugs,
    projectTableColumns.dueDate,
  ],
} satisfies Record<string, ProjectTableColumn[]>;

export default function ProjectTable({
  projects,
  columns,
  title = "Projects",
  emptyTitle = "No projects found",
  actionLabel = "Open",
  onAction,
}: ProjectTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [priority, setPriority] = useState<ProjectPriority | "all">("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    key: ProjectTableColumn["key"];
    direction: SortDirection;
  }>({
    key: "dueDate",
    direction: "asc",
  });

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();

    return projects
      .filter((project) => status === "all" || project.status === status)
      .filter((project) => priority === "all" || project.priority === priority)
      .filter((project) => {
        if (!search) return true;
        return [
          project.name,
          project.client,
          project.owner,
          project.assignee,
          project.repository,
          project.environment,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => {
        const column = columns.find((item) => item.key === sort.key);
        const leftValue = normalize(
          column?.sortValue?.(left) ?? getDefaultSortValue(left, sort.key)
        );
        const rightValue = normalize(
          column?.sortValue?.(right) ?? getDefaultSortValue(right, sort.key)
        );
        if (leftValue < rightValue) return sort.direction === "asc" ? -1 : 1;
        if (leftValue > rightValue) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [columns, priority, projects, query, sort, status]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const blockedProjects = projects.filter(
    (project) => project.status === "blocked"
  ).length;

  const handleSort = (column: ProjectTableColumn) => {
    if (!column.sortable) return;
    setSort((current) => ({
      key: column.key,
      direction:
        current.key === column.key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = <T extends string>(
    setter: Dispatch<SetStateAction<T>>,
    value: T
  ) => {
    setter(value);
    setPage(1);
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="lg"
      overflow="hidden"
    >
      <VStack
        align="stretch"
        gap={5}
        p={5}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
          <Box>
            <Text as="h2" fontSize="xl" fontWeight="900" color="gray.900">
              {title}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {filteredProjects.length} shown · {activeProjects} active ·{" "}
              {blockedProjects} blocked
            </Text>
          </Box>
          <HStack gap={2} flexWrap="wrap">
            <Badge
              colorPalette="blue"
              borderRadius="full"
              px={3}
              py={1}
              textTransform="none"
            >
              {projects.length} total
            </Badge>
            <Badge
              colorPalette="red"
              borderRadius="full"
              px={3}
              py={1}
              textTransform="none"
            >
              {blockedProjects} blocked
            </Badge>
          </HStack>
        </HStack>

        <HStack gap={3} align="end" flexWrap="wrap">
          <Box flex="1" minW={{ base: "full", md: "280px" }}>
            <Input
              label="Search"
              value={query}
              onChange={(event) => handleFilterChange(setQuery, event.target.value)}
              placeholder="Search projects, clients, owners, repositories"
            />
          </Box>
          <Box minW="160px">
            <Text as="label" display="block" fontSize="sm" fontWeight="600" mb={2}>
              Status
            </Text>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={status}
                onChange={(event) =>
                  handleFilterChange(
                    setStatus,
                    event.target.value as ProjectStatus | "all"
                  )
                }
                borderRadius="xl"
                bg="white"
              >
                <option value="all">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
          <Box minW="160px">
            <Text as="label" display="block" fontSize="sm" fontWeight="600" mb={2}>
              Priority
            </Text>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={priority}
                onChange={(event) =>
                  handleFilterChange(
                    setPriority,
                    event.target.value as ProjectPriority | "all"
                  )
                }
                borderRadius="xl"
                bg="white"
              >
                <option value="all">All priorities</option>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </HStack>
      </VStack>

      {visibleProjects.length === 0 ? (
        <Box p={8}>
          <EmptyState
            title={emptyTitle}
            description="Adjust the search or filters to see more projects."
          />
        </Box>
      ) : (
        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline" striped interactive stickyHeader>
            <Table.Header>
              <Table.Row bg="gray.50">
                {columns.map((column) => (
                  <Table.ColumnHeader
                    key={column.key}
                    minW={column.minW}
                    textAlign={column.align}
                    cursor={column.sortable ? "pointer" : "default"}
                    onClick={() => handleSort(column)}
                    userSelect="none"
                    color="gray.600"
                    fontWeight="800"
                  >
                    <HStack justify={column.align === "end" ? "end" : "start"} gap={1}>
                      <span>{column.label}</span>
                      {column.sortable && sort.key === column.key && (
                        <span>{sort.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </HStack>
                  </Table.ColumnHeader>
                ))}
                {onAction && (
                  <Table.ColumnHeader minW="100px" textAlign="end">
                    Action
                  </Table.ColumnHeader>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleProjects.map((project) => (
                <Table.Row key={project.id}>
                  {columns.map((column) => (
                    <Table.Cell
                      key={column.key}
                      textAlign={column.align}
                      verticalAlign="middle"
                    >
                      {column.render
                        ? column.render(project)
                        : getDefaultSortValue(project, column.key)}
                    </Table.Cell>
                  ))}
                  {onAction && (
                    <Table.Cell textAlign="end">
                      <Button variant="secondary" onClick={() => onAction(project)}>
                        {actionLabel}
                      </Button>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )}

      <HStack
        justify="space-between"
        gap={4}
        flexWrap="wrap"
        p={4}
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <Text color="gray.500" fontSize="sm">
          Page {currentPage} of {totalPages}
        </Text>
        <HStack gap={3} flexWrap="wrap">
          <NativeSelect.Root width="100px">
            <NativeSelect.Field
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              borderRadius="xl"
              bg="white"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Button
            variant="secondary"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
