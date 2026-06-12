import { api } from "@/services/api";
import type { RolesAndPermissions, User, UserFormPayload } from "@/types";

type UsersResponse = User[] | { users?: User[]; items?: User[]; data?: User[] };
type UserResponse = User | { user?: User; data?: User };
type RolesAndPermissionsResponse =
  | RolesAndPermissions
  | { success?: boolean; data?: RolesAndPermissions };

function normalizeUsersResponse(response: UsersResponse): User[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function normalizeRolesAndPermissionsResponse(
  response: RolesAndPermissionsResponse
): RolesAndPermissions {
  if ("data" in response && response.data) return response.data;
  return response as RolesAndPermissions;
}

function normalizeUserResponse(response: UserResponse): User {
  if ("user" in response && response.user) return response.user;
  if ("data" in response && response.data) return response.data;
  return response as User;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: normalizeUsersResponse,
      providesTags: ["Users"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),
    getRolesAndPermissions: builder.query<RolesAndPermissions, void>({
      query: () => "/users/roles",
      transformResponse: normalizeRolesAndPermissionsResponse,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<User, UserFormPayload>({
      query: (data) => ({ url: "/users", method: "POST", body: data }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<User, UserFormPayload & { id: string }>({
      query: ({ id, ...data }) => ({ url: `/users/${id}`, method: "PUT", body: data }),
      transformResponse: normalizeUserResponse,
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetRolesAndPermissionsQuery,
  useLazyGetRolesAndPermissionsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
