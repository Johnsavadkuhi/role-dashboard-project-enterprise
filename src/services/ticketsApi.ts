import { api } from "@/services/api";

export const ticketsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({ query: () => "/tickets", providesTags: ["Tickets"] }),
    createTicket: builder.mutation({
      query: (data) => ({ url: "/tickets", method: "POST", body: data }),
      invalidatesTags: ["Tickets"],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/tickets/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

export const { useGetTicketsQuery, useCreateTicketMutation, useUpdateTicketStatusMutation } = ticketsApi;
