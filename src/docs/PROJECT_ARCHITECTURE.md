# Project Architecture Documentation

This document explains the professional architecture features added to the project so future developers can understand why each part exists and how to extend it safely.

## 1. Full TypeScript Migration

The source code was migrated from `.js/.jsx` to `.ts/.tsx`.

Main goals:

- Catch mistakes earlier.
- Make user, role, permission, API, and upload data predictable.
- Improve IDE autocomplete.
- Prepare the project for large-team development.

Important files:

```txt
src/types/index.ts
src/app/store.ts
src/services/*.ts
src/routes/*.tsx
src/pages/**/*.tsx
src/modules/**/*.tsx
```

Core shared types:

```ts
Role;
Permission;
User;
AuthResponse;
UploadResponse;
UserFormPayload;
ApiError;
```

Notification type contract is documented separately:

```txt
src/docs/NOTIFICATION_TYPES.md
```

The most important migration change is that users use an array of roles instead of one role:

```ts
user.roles: Role[]
```

And they also have fine-grained permissions:

```ts
user.permissions: Permission[]
```

## 2. MSW API Mocking

MSW, Mock Service Worker, was added so the frontend can run and be tested without a real backend.

Important files:

```txt
src/mocks/handlers.ts
src/mocks/browser.ts
src/mocks/server.ts
src/mocks/startMockWorker.ts
src/mocks/data.ts
```

Browser mock mode needs the worker file first, then it is controlled by:

```bash
npm run msw:init
```

```env
VITE_ENABLE_MSW=true
```

When enabled, these APIs are mocked:

```txt
POST /auth/login
POST /auth/register
POST /auth/refresh-token
GET /users
PUT /users/:id
DELETE /users/:id
POST /uploads
GET /pentest/vulnerabilities
GET /devops/deployments
GET /tickets
GET /qa/test-cases
```

This lets frontend development continue even if the backend is unavailable.

## 3. Complete Test Coverage Foundation

Tests were added for the most important architecture flows.

Important files:

```txt
src/test/setup.ts
src/test/renderWithProviders.tsx
src/test/testUsers.ts
src/routes/PermissionRoute.test.tsx
src/pages/public/Login.test.tsx
src/pages/public/Signup.test.tsx
src/components/ErrorBoundary.test.tsx
src/modules/admin/components/RolePermissionManager.test.tsx
```

Covered areas:

- Permission mapping.
- Multi-role permission merging.
- Protected route redirect.
- Permission route allow/block behavior.
- Public route redirect when authenticated.
- PermissionGate UI hiding.
- Sidebar permission filtering.
- Login validation.
- Login success with mocked API.
- Signup avatar validation.
- Signup upload + register flow.
- ErrorBoundary fallback behavior.
- Role/Permission manager rendering and save action.

Run tests:

```bash
npm run test:run
```

## 4. Error Boundary

ErrorBoundary prevents one React crash from blanking the whole application.

Important file:

```txt
src/components/ErrorBoundary.tsx
```

It is used globally in:

```txt
src/main.tsx
```

And also around lazy-loaded protected route pages in:

```txt
src/routes/AppRoutes.tsx
```

If a page crashes, the user sees a friendly fallback instead of a blank page.

## 5. Real Husky Hooks

Husky hooks were added to protect the codebase before commits.

Important files:

```txt
.husky/pre-commit
.husky/commit-msg
```

Pre-commit runs:

```bash
npm run lint
npm run typecheck
npm run test:run
npx lint-staged
```

Commit message hook requires messages to start with one of:

```txt
feat:
fix:
docs:
style:
refactor:
test:
chore:
build:
ci:
```

This prevents low-quality code from entering the repository.

## 6. Role/Permission Admin Management UI

A real admin interface was added to manage user access.

Important files:

```txt
src/modules/admin/pages/AdminDashboard.tsx
src/modules/admin/components/RolePermissionManager.tsx
```

The admin can:

- Select a user.
- Toggle roles.
- Auto-fill permissions from selected roles.
- Manually fine-tune direct permissions.
- Save updated access through RTK Query.

The UI uses:

```txt
useGetUsersQuery
useGetRolesAndPermissionsQuery
useUpdateUserMutation
```

Important rule:

Frontend permission checks improve UX, but backend APIs must also enforce permissions. Hiding a button in React is not security by itself.

## 7. Authentication and Authorization Flow

Authentication answers:

```txt
Is the user logged in?
```

Authorization answers:

```txt
What can this user do?
```

Relevant files:

```txt
src/features/auth/authSlice.ts
src/routes/ProtectedRoute.tsx
src/routes/PublicRoute.tsx
src/routes/PermissionRoute.tsx
src/components/PermissionGate.tsx
src/hooks/useAuth.ts
src/hooks/usePermission.ts
```

## 8. API Layer

All APIs are based on RTK Query.

Important files:

```txt
src/services/api.ts
src/services/authApi.ts
src/services/uploadApi.ts
src/services/usersApi.ts
src/services/pentestApi.ts
src/services/devopsApi.ts
src/services/ticketsApi.ts
src/services/qaApi.ts
```

`api.ts` contains:

- Base URL.
- Cookie-based requests with `credentials: "include"`.
- Cookie-based refresh-session handling.
- Auto logout on invalid refresh/session.
- RTK Query tag configuration.

## 9. Signup Avatar Upload Flow

Signup works in two API steps:

1. Upload avatar image to `/uploads`.
2. Send user data plus uploaded avatar URL to `/auth/register`.

Relevant file:

```txt
src/pages/public/Signup.tsx
```

Validation checks:

- Name required.
- Username minimum length.
- Password minimum length.
- At least one role.
- Avatar required.
- Avatar must be JPG, PNG, or WEBP.
- Avatar max size is 2MB.

## 10. Config-Based Routes and Sidebar

Routes and sidebar links are controlled by config instead of hard-coded JSX.

Important files:

```txt
src/config/appRoutes.ts
src/config/sidebarItems.ts
```

Benefits:

- Easy to add new dashboards.
- Easy to attach permissions.
- Cleaner AppRoutes and Sidebar.

## 11. Lazy Loading

Dashboard pages are lazy-loaded to avoid loading the whole application upfront.

Implemented in:

```txt
src/config/appRoutes.ts
src/routes/AppRoutes.tsx
```

This improves performance for large projects.

## 12. Recommended Next Steps

For production, connect these to a real backend:

- Auth endpoints.
- Refresh session endpoint that rotates/validates HttpOnly cookies.
- File upload endpoint.
- User management endpoints.
- Audit logs for permission changes.
- Backend permission enforcement.

Also consider adding:

- E2E tests with Playwright.
- CI pipeline.
- Docker setup.
- Production monitoring.
- Access-change audit history.

---

## Chakra UI Integration

This version uses **Chakra UI** as the main UI component system.

### What changed

- Added `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`, and `framer-motion`.
- Added a central Chakra theme in:

```txt
src/theme/index.ts
```

- Wrapped the full React app with `ChakraProvider` in:

```txt
src/main.tsx
```

- Rebuilt the shared UI layer on top of Chakra:

```txt
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Select.tsx
src/components/ui/Card.tsx
src/components/ui/Badge.tsx
```

- Reworked core layout components with Chakra primitives:

```txt
src/components/Navbar.tsx
src/components/Sidebar.tsx
src/layouts/DashboardLayout.tsx
src/layouts/PublicLayout.tsx
```

- Reworked login, signup, dashboard pages, empty/error/loading states, and the admin role/permission UI using Chakra components.

### Why Chakra UI is useful here

Chakra gives the project a consistent design system without writing a large amount of custom CSS. It is especially useful for this dashboard because we need many repeated UI patterns:

- Cards
- Forms
- Buttons
- Badges
- Alerts
- Sidebars
- Layout grids
- Admin management screens
- Empty/loading/error states

### Important rule

Use Chakra primitives directly for layout and use the wrapper components in `src/components/ui` for repeated app-level controls.

Recommended:

```tsx
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
```

Also recommended for layout:

```tsx
import { Box, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
```

Avoid creating new raw CSS classes unless the style is very project-specific. Prefer Chakra props such as:

```tsx
<Box p={6} bg="white" borderRadius="2xl" boxShadow="lg" />
```

### Tests

The test renderer now wraps components with ChakraProvider:

```txt
src/test/renderWithProviders.tsx
```

If a test renders Chakra components directly with Testing Library's `render`, wrap it with `ChakraProvider`.
