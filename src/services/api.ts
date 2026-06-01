import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, tokenRefreshed } from "@/features/auth/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = (api.getState() as any).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if ((refreshResult?.data as any)?.token) {
      api.dispatch(
        tokenRefreshed({
          token: (refreshResult.data as any).token,
          refreshToken: (refreshResult.data as any).refreshToken || refreshToken,
        })
      );

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Users",
    "Pentest",
    "DevOps",
    "Tickets",
    "QA",
    "Reports",
    "Upload",
  ],
  endpoints: () => ({}),
});
