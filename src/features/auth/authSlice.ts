import { createSlice } from "@reduxjs/toolkit";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const tokenFromStorage = localStorage.getItem("token");
const refreshTokenFromStorage = localStorage.getItem("refreshToken");
const userFromStorage = safeParse(localStorage.getItem("user"), null);

const initialState = {
  token: tokenFromStorage || null,
  refreshToken: refreshTokenFromStorage || null,
  user: userFromStorage,
  isAuthenticated: Boolean(tokenFromStorage),
};

const normalizeUser = (user) => {
  const roles = Array.isArray(user?.roles) ? user.roles : user?.role ? [user.role] : [];
  const permissions = Array.isArray(user?.permissions)
    ? user.permissions
    : getPermissionsFromRoles(roles);

  return {
    ...user,
    roles,
    permissions,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      const normalizedUser = normalizeUser(user);

      state.token = token;
      state.refreshToken = refreshToken || null;
      state.user = normalizedUser;
      state.isAuthenticated = Boolean(token);

      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    tokenRefreshed: (state, action) => {
      const { token, refreshToken } = action.payload;
      state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;

      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    },

    updateUser: (state, action) => {
      const normalizedUser = normalizeUser({ ...state.user, ...action.payload });
      state.user = normalizedUser;
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, tokenRefreshed, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
