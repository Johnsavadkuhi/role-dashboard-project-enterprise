# Project Guide

This guide explains how the frontend is put together and how the main flows work. Use it when you feel lost in the codebase or when you need to change auth, routes, permissions, users, or navigation.

## Mental Model

The app is a React dashboard with:

- Redux Toolkit for local app state.
- RTK Query for backend API calls.
- React Router for public/protected pages.
- Chakra UI for layout and components.
- Backend-owned roles and permissions.
- Frontend permission checks only for UX, not security.

The backend is the authority for authentication, users, roles, permissions, and real access control. The frontend uses that data to decide what to show, where to redirect, and which buttons/routes should be visible.

## Source Of Truth

| Concern                            | Source of truth                                 | Frontend file                                                 |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Current logged-in user             | Backend auth response, then Redux/localStorage  | `src/features/auth/authSlice.ts`                              |
| Role keys                          | Backend contract, mirrored as constants         | `src/constants/roles.ts`                                      |
| Permission names used by routes/UI | Backend contract, mirrored as route constants   | `src/constants/permissions.ts`                                |
| Role to permission mapping         | Backend/database via `/users/roles`             | `src/services/usersApi.ts`                                    |
| Permission checking behavior       | Frontend helper, including `admin.all` wildcard | `src/utils/permissionGrants.ts`                               |
| Route requirements                 | Frontend route config                           | `src/config/appRoutes.ts`                                     |
| Drawer/menu requirements           | Frontend sidebar config                         | `src/config/sidebarItems.ts` and `src/components/Sidebar.tsx` |

Important: the frontend no longer owns a static `rolePermissions` mapping. If role permissions change, the backend/database should change, and the frontend should receive the updated catalog from `/users/roles`.

## Directory Map

```txt
src/
  app/
    store.ts                  Redux store setup
  components/
    Sidebar.tsx               Drawer/sidebar navigation
    Navbar.tsx                Top navigation
    PermissionGate.tsx        Hide/show UI by permission
    NotificationRealtimeBridge.tsx
  config/
    appRoutes.ts              Protected route definitions
    sidebarItems.ts           Base sidebar item definitions
  constants/
    permissions.ts            Permission string constants used by UI/routes
    roles.ts                  Role key constants matching backend keys
  features/
    auth/authSlice.ts         Auth Redux state and localStorage persistence
    notifications/            Notification Redux state
    ui/                       Sidebar/drawer UI state
  hooks/
    useAuth.ts                Current auth state plus effective permissions
    usePermission.ts          Convenience permission/role checks
  layouts/
    PublicLayout.tsx          Login/signup layout
    DashboardLayout.tsx       Authenticated app layout
  modules/
    admin/                    Admin dashboard and user access management
    pentester/                Pentester dashboard
    qa/                       QA dashboard
    ...
  pages/
    public/                   Login, signup, forgot password
    shared/                   Profile, settings, projects, errors
  routes/
    AppRoutes.tsx             Main route tree
    ProtectedRoute.tsx        Requires login
    PublicRoute.tsx           Redirects logged-in users away from public pages
    PermissionRoute.tsx       Requires permissions/roles
  services/
    api.ts                    Base RTK Query API with CSRF/refresh behavior
    authApi.ts                Login/register/me/logout endpoints
    usersApi.ts               Users and `/users/roles`
  utils/
    dashboard.ts              Decide default dashboard path
    permissionGrants.ts       Permission calculation/check helpers
```

## Redux Store

The Redux store is configured in `src/app/store.ts`.

It combines:

- `auth`: current user and authentication state.
- `notifications`: notification list, unread count, socket status.
- `ui`: drawer/sidebar/theme state.
- `api`: RTK Query cache and request state.

RTK Query middleware is attached in the store, so endpoint hooks like `useGetUsersQuery()` and `useLoginUserMutation()` work everywhere inside the app.

## API Layer

The base API is in `src/services/api.ts`.

It does three important things:

1. Sets the backend base URL from `VITE_API_BASE_URL`.
2. Sends cookies with requests using `credentials: "include"`.
3. For protected requests, fetches a CSRF token from `/auth/csrf-token` and adds `x-csrf-token`.
4. If a protected request returns `401`, it tries `/auth/refresh-token`; if refresh fails, it logs the user out.

Feature APIs use `api.injectEndpoints(...)`.

Current key APIs:

- `authApi.ts`
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /auth/me`
  - `POST /auth/logout`

- `usersApi.ts`
  - `GET /users`
  - `GET /users/:id`
  - `GET /users/roles`
  - `POST /users`
  - `PUT /users/:id`
  - `DELETE /users/:id`

## Authentication Flow

Login page:

1. User submits username/password in `src/pages/public/Login.tsx`.
2. `useLoginUserMutation()` calls `POST /auth/login`.
3. `authApi.ts` normalizes the response into `{ user, csrfToken? }`.
4. The login response `user.permissions` array is used as the effective permission list.
5. `loginSuccess(payload)` stores the normalized user in Redux and localStorage.
6. The user is redirected with `getDashboardPathByRoles(...)`.

Auth state:

- `authSlice.ts` stores `user` and `isAuthenticated`.
- It persists `user` into localStorage.
- It does not own role-permission mapping.

Reading auth:

- `useAuth.ts` reads Redux auth state.
- It does not derive logged-in user permissions from roles. `user.permissions` is the source of truth.
- It returns:
  - `user`
  - `isAuthenticated`
  - `roles`
  - `permissions`

## Route Flow

Main route tree is in `src/routes/AppRoutes.tsx`.

```txt
/login, /signup, /forgot-password
  PublicRoute
    PublicLayout

protected pages
  ProtectedRoute
    DashboardLayout
      PermissionRoute
        actual page
```

Route guard responsibilities:

- `ProtectedRoute.tsx`
  - If not authenticated, redirect to `/login`.

- `PublicRoute.tsx`
  - If already authenticated, redirect to the best dashboard.

- `PermissionRoute.tsx`
  - Checks required permissions and optional roles.
  - If blocked, redirect to `/unauthorized`.

The list of protected pages lives in `src/config/appRoutes.ts`.

## Permissions Model

The backend owns:

- the complete permission catalog
- each role's permissions
- effective permissions
- final API authorization

The frontend owns:

- route and menu requirements
- display-only permission checks
- `admin.all` wildcard behavior for UI checks

Important files:

- `src/constants/permissions.ts`
  - Contains permission strings used by route/menu requirements.
  - This should mirror backend permission names, but not define role mappings.

- `src/constants/roles.ts`
  - Contains backend role keys:
    - `admin`
    - `pentester`
    - `project_manager_security`
    - `devops`
    - `representative`
    - `qa`
    - `project_manager_qa`

- `src/utils/permissionGrants.ts`
  - `getPermissionsFromRoleCatalog(roles, roleCatalog)`
  - `getEffectivePermissions(roles, permissions, roleCatalog)`
  - `hasPermissionGrant(...)`
  - `hasAnyPermissionGrant(...)`
  - `hasAllPermissionGrants(...)`

`admin.all`:

- Admin may only receive `admin.all`.
- The frontend treats `admin.all` as passing any permission check.
- Backend must still enforce actual security.

## Drawer And Navigation

The Drawer/Sidebar is built from two places:

- `src/config/sidebarItems.ts`
  - base navigation items
  - each item has permissions and sometimes roles

- `src/components/Sidebar.tsx`
  - filters sidebar items using `usePermission()`
  - creates role-specific project sections
  - shows one primary dashboard link instead of listing every dashboard

If a menu item is hidden, check:

1. Does the current user have the required permission?
2. Does the current user have the required role?
3. Is `/users/roles` returning the expected catalog?
4. Is `admin.all` present for admin users?
5. Does the sidebar item use the correct backend role key?

## Admin User Management

Main page:

- `src/modules/admin/pages/AdminUsers.tsx`

Role/permission editor:

- `src/modules/admin/components/RolePermissionManager.tsx`

Flow:

1. `AdminUsers` fetches users with `useGetUsersQuery()`.
2. `RolePermissionManager` fetches the role catalog with `useGetRolesAndPermissionsQuery()`.
3. Admin selects a user.
4. Admin toggles roles and permissions.
5. Save calls `PUT /users/:id`.

Current save payload:

```ts
{
  roles: draftRoles,
  permissions: draftPermissions,
  status: draftStatus
}
```

Backend access model:

```ts
roles: string[]
permissions: string[]
```

The saved `permissions` array is the effective permission list for that user. The frontend should not rebuild the logged-in user's permissions from roles when the backend returns an empty list.

```txt
effectivePermissions = user.permissions
```

## Notifications

Notification state:

- `src/features/notifications/notificationsSlice.ts`

Initial notification fetch:

- `src/services/notificationsApi.ts`

Realtime bridge:

- `src/components/NotificationRealtimeBridge.tsx`

Socket wrapper:

- `src/services/notificationSocket.ts`

Flow:

1. If authenticated, fetch notifications.
2. Connect socket with `{ userId, roles }`.
3. Dispatch socket events into Redux.
4. Show toast for high/critical notifications.
5. Disconnect and clear notifications on logout.

## Mocks And Tests

Mocks are under:

- `src/mocks/data.ts`
- `src/mocks/handlers.ts`
- `src/mocks/server.ts`

Test helpers:

- `src/test/renderWithProviders.tsx`
- `src/test/testUsers.ts`

Important tests:

- `src/routes/PermissionRoute.test.tsx`
  - route guards
  - permission UI
  - sidebar visibility

- `src/pages/public/Login.test.tsx`
  - login response shapes
  - redirect behavior

- `src/modules/admin/components/RolePermissionManager.test.tsx`
  - saving roles/permissions/status
  - backend error display

Run checks:

```bash
npm run typecheck
npm run test:run
```

## How To Change Common Things

### Add A New Protected Page

1. Create the page component.
2. Add a lazy import in `src/config/appRoutes.ts`.
3. Add an object to `protectedRouteConfig`.
4. Set required `permissions` and optional `roles`.
5. Add sidebar item in `src/config/sidebarItems.ts` if it needs navigation.
6. Add tests if the route is sensitive.

### Add A New Permission

1. Add it in the backend/database first.
2. Add it to backend `/users/roles` role catalog if any role should grant it.
3. Add it to `src/constants/permissions.ts` only if a route, menu item, or button references it.
4. Use `PermissionGate` or route/sidebar config to require it in the UI.

### Add A New Role

1. Add it in backend/database first.
2. Return it from `/users/roles`.
3. Add the role key to `src/constants/roles.ts` if frontend routes/navigation need to reference it.
4. Add route/sidebar behavior only if the role has unique pages or menu sections.

### Protect A Button

Use `PermissionGate`.

```tsx
<PermissionGate permissions={[PERMISSIONS.USERS_DELETE]}>
  <Button>Delete User</Button>
</PermissionGate>
```

### Debug A Hidden Menu Item

Check in this order:

1. `useAuth()` output: roles and permissions.
2. `/users/roles` response.
3. `sidebarItems.ts` required permissions/roles.
4. `Sidebar.tsx` role-specific project sections.
5. `admin.all` wildcard if the user is admin.

### Debug A Redirect

Check:

1. Is `auth.isAuthenticated` true?
2. What does `useAuth()` return for roles/permissions?
3. What does `getDashboardPathByRoles(...)` return?
4. Does the target route in `appRoutes.ts` require a permission the user lacks?

## Rules To Keep The Project Understandable

- Backend owns role-permission mapping.
- Frontend permission checks are for UX only.
- Do not re-create backend role mappings in the frontend.
- Keep API response normalization inside `services/*Api.ts`.
- Keep route requirements in `config/appRoutes.ts`.
- Keep drawer requirements in `config/sidebarItems.ts` and `Sidebar.tsx`.
- Keep shared permission logic in `utils/permissionGrants.ts`.
- Add tests when changing auth, permissions, routes, or admin user access.

## Files To Read First When Lost

Read these in this order:

1. `src/app/store.ts`
2. `src/routes/AppRoutes.tsx`
3. `src/config/appRoutes.ts`
4. `src/features/auth/authSlice.ts`
5. `src/hooks/useAuth.ts`
6. `src/hooks/usePermission.ts`
7. `src/utils/permissionGrants.ts`
8. `src/services/api.ts`
9. `src/services/authApi.ts`
10. `src/services/usersApi.ts`
11. `src/components/Sidebar.tsx`
12. `src/modules/admin/components/RolePermissionManager.tsx`

That path gives you the whole story: state, routing, auth, permissions, API, navigation, and admin access management.
