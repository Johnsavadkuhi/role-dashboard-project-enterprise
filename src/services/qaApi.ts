import { api } from "@/services/api";

export const qaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestCases: builder.query({ query: () => "/qa/test-cases", providesTags: ["QA"] }),
    createTestCase: builder.mutation({
      query: (data) => ({ url: "/qa/test-cases", method: "POST", body: data }),
      invalidatesTags: ["QA"],
    }),
    updateTestCaseStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/qa/test-cases/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: ["QA"],
    }),
  }),
});

export const { useGetTestCasesQuery, useCreateTestCaseMutation, useUpdateTestCaseStatusMutation } = qaApi;
