import { createSlice } from "@reduxjs/toolkit";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const userFromStorage = safeParse(localStorage.getItem("user"), null);

const initialState = {
  user: userFromStorage,
  isAuthenticated: Boolean(userFromStorage),
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
      const { user } = action.payload;
      const normalizedUser = normalizeUser(user);

      state.user = normalizedUser;
      state.isAuthenticated = Boolean(normalizedUser);

      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    updateUser: (state, action) => {
      const normalizedUser = normalizeUser({ ...state.user, ...action.payload });
      state.user = normalizedUser;
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
