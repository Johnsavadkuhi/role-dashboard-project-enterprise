import { api } from "@/services/api";
import type { CreateProjectRequest, CreateProjectResponse } from "@/types/api/projects";

type ProjectResponse =
  | CreateProjectResponse
  | { data?: CreateProjectResponse; project?: CreateProjectResponse };

function normalizeProjectResponse(response: ProjectResponse): CreateProjectResponse {
  if ("project" in response && response.project) return response.project;
  if ("data" in response && response.data) return response.data;
  return response as CreateProjectResponse;
}

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      transformResponse: normalizeProjectResponse,
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const { useCreateProjectMutation } = projectsApi;
