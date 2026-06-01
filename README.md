# Role Dashboard Project Enterprise

Enterprise React dashboard starter with:

- React + Vite
- TypeScript
- React Router
- Redux Toolkit
- RTK Query
- Multi-role users
- Permission-based access control
- Protected routes
- Public routes
- MSW API mocking
- Error Boundary
- Husky + lint-staged
- Vitest + React Testing Library
- Chakra UI design system
- Admin Role/Permission Management UI

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run build
npm run typecheck
npm run lint
npm run test:run
npm run format
```

## Chakra UI

The UI is built with Chakra UI. The theme is here:

```txt
src/theme/index.ts
```

The app is wrapped with `ChakraProvider` in:

```txt
src/main.tsx
```

Shared app components are here:

```txt
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Select.tsx
src/components/ui/Card.tsx
src/components/ui/Badge.tsx
```

## Documentation

Full architecture notes are in:

```txt
src/docs/PROJECT_ARCHITECTURE.md
```
