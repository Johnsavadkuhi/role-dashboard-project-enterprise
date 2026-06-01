import { api } from "@/services/api";
import type { AuthResponse } from "@/types";

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string; roles: string[]; avatarUrl?: string; avatarFileId?: string };

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthResponse, LoginPayload>({
      query: (loginData) => ({ url: "/auth/login", method: "POST", body: loginData }),
      invalidatesTags: ["Auth"],
    }),
    registerUser: builder.mutation<AuthResponse, RegisterPayload>({
      query: (registerData) => ({ url: "/auth/register", method: "POST", body: registerData }),
      invalidatesTags: ["Auth", "Users"],
    }),
    getMe: builder.query<AuthResponse["user"], void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logoutUser: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useGetMeQuery, useLogoutUserMutation } = authApi;
