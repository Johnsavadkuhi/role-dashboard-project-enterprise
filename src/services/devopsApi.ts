import { api } from "@/services/api";

export const devopsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeployments: builder.query({ query: () => "/devops/deployments", providesTags: ["DevOps"] }),
    createDeployment: builder.mutation({
      query: (data) => ({ url: "/devops/deployments", method: "POST", body: data }),
      invalidatesTags: ["DevOps"],
    }),
    getServers: builder.query({ query: () => "/devops/servers", providesTags: ["DevOps"] }),
  }),
});

export const { useGetDeploymentsQuery, useCreateDeploymentMutation, useGetServersQuery } = devopsApi;
