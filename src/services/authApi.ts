import { api } from "@/services/api";
import type { AuthResponse, Permission, Role, User } from "@/types";

type LoginPayload = { username: string; password: string };
type RegisterPayload = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  avatarUrl?: string;
  avatarFileId?: string;
};

type BackendUser = Partial<User> & {
  firstName?: string;
  lastName?: string;
  username?: string;
  sessionVersion?: number;
  projectIds?: string[];
  roles?: Role[];
  permissions?: Permission[];
};

type BackendAuthResponse = {
  success?: boolean;
  data?: {
    user?: BackendUser;
    csrfToken?: string;
  };
  user?: BackendUser;
  csrfToken?: string;
};

const normalizeAuthUser = (user: BackendUser): User => {
  const displayName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "";

  return {
    ...user,
    id: user.id || "",
    name: displayName,
    email: user.email || user.username || "",
    roles: Array.isArray(user.roles) ? user.roles : [],
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
  };
};

const normalizeAuthResponse = (response: BackendAuthResponse): AuthResponse => {
  const user = response.data?.user || response.user;

  if (!user) {
    throw new Error("Auth response did not include a user");
  }

  return {
    user: normalizeAuthUser(user),
    csrfToken: response.data?.csrfToken || response.csrfToken,
  };
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthResponse, LoginPayload>({
      query: (loginData) => ({ url: "/auth/login", method: "POST", body: loginData }),
      transformResponse: normalizeAuthResponse,
      invalidatesTags: ["Auth"],
    }),
    registerUser: builder.mutation<AuthResponse, RegisterPayload>({
      query: (registerData) => ({
        url: "/auth/register",
        method: "POST",
        body: registerData,
      }),
      transformResponse: normalizeAuthResponse,
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

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetMeQuery,
  useLogoutUserMutation,
} = authApi;
