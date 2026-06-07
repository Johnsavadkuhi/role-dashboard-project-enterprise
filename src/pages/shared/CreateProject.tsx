import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Heading, HStack, SimpleGrid, Text, Textarea, VStack } from "@chakra-ui/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useLanguage } from "@/i18n";
import type { ProjectDiscipline, ProjectPriority } from "@/types";

type ProjectFormState = {
  name: string;
  client: string;
  owner: string;
  discipline: ProjectDiscipline;
  priority: Exclude<ProjectPriority, "critical">;
  dueDate: string;
  environment: string;
  repository: string;
  scope: string;
};

const initialForm: ProjectFormState = {
  name: "",
  client: "",
  owner: "",
  discipline: "security",
  priority: "medium",
  dueDate: "",
  environment: "",
  repository: "",
  scope: "",
};

export default function CreateProject() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState<ProjectFormState>(initialForm);

  const updateField = <Key extends keyof ProjectFormState>(
    key: Key,
    value: ProjectFormState[Key]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast.success(t("projectCreate.success"));
    setForm(initialForm);
  };

  return (
    <VStack align="stretch" gap={5}>
      <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
        <div>
          <Heading>{t("projectCreate.title")}</Heading>
          <Text color="gray.600" mt={2}>
            {t("projectCreate.description")}
          </Text>
        </div>
        <Button variant="secondary" onClick={() => navigate("/projects")}>
          {t("projectCreate.actions.cancel")}
        </Button>
      </HStack>

      <Card>
        <form onSubmit={handleSubmit}>
          <VStack align="stretch" gap={6}>
            <Text color="gray.600">{t("projectCreate.help")}</Text>

            <VStack align="stretch" gap={4}>
              <Heading as="h2" size="sm">
                {t("projectCreate.sections.identity")}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Input
                  label={t("projectCreate.fields.name")}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
                <Input
                  label={t("projectCreate.fields.client")}
                  value={form.client}
                  onChange={(event) => updateField("client", event.target.value)}
                  required
                />
                <Input
                  label={t("projectCreate.fields.owner")}
                  value={form.owner}
                  onChange={(event) => updateField("owner", event.target.value)}
                  required
                />
                <Select
                  label={t("projectCreate.fields.discipline")}
                  value={form.discipline}
                  onChange={(event) =>
                    updateField("discipline", event.target.value as ProjectDiscipline)
                  }
                >
                  <option value="security">{t("projectCreate.options.security")}</option>
                  <option value="quality">{t("projectCreate.options.quality")}</option>
                  <option value="devops">{t("projectCreate.options.devops")}</option>
                  <option value="platform">{t("projectCreate.options.platform")}</option>
                </Select>
              </SimpleGrid>
            </VStack>

            <VStack align="stretch" gap={4}>
              <Heading as="h2" size="sm">
                {t("projectCreate.sections.delivery")}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Select
                  label={t("projectCreate.fields.priority")}
                  value={form.priority}
                  onChange={(event) =>
                    updateField(
                      "priority",
                      event.target.value as ProjectFormState["priority"]
                    )
                  }
                >
                  <option value="low">{t("projectCreate.options.low")}</option>
                  <option value="medium">{t("projectCreate.options.medium")}</option>
                  <option value="high">{t("projectCreate.options.high")}</option>
                </Select>
                <Input
                  type="date"
                  label={t("projectCreate.fields.dueDate")}
                  value={form.dueDate}
                  onChange={(event) => updateField("dueDate", event.target.value)}
                  required
                />
                <Input
                  label={t("projectCreate.fields.environment")}
                  value={form.environment}
                  onChange={(event) => updateField("environment", event.target.value)}
                />
                <Input
                  label={t("projectCreate.fields.repository")}
                  value={form.repository}
                  onChange={(event) => updateField("repository", event.target.value)}
                />
              </SimpleGrid>
              <Textarea
                value={form.scope}
                onChange={(event) => updateField("scope", event.target.value)}
                placeholder={t("projectCreate.fields.scope")}
                borderRadius="xl"
                bg="white"
                minH="140px"
              />
            </VStack>

            <HStack justify="flex-end" gap={3}>
              <Button variant="ghost" type="button" onClick={() => setForm(initialForm)}>
                {t("projectCreate.actions.cancel")}
              </Button>
              <Button type="submit">{t("projectCreate.actions.submit")}</Button>
            </HStack>
          </VStack>
        </form>
      </Card>
    </VStack>
  );
}
