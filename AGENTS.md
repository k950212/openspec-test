# AGENTS.md

## Purpose

This repository is a frontend-only e-commerce storefront built with Vue 3, Vite, TypeScript, Pinia, Vue Router, and Ant Design Vue. Agents working in this repo should preserve the existing app structure, follow the OpenSpec workflow for scoped changes, and prefer small, targeted edits over broad refactors.

## Tech Stack

- Vue 3 with `<script setup lang="ts">`
- Vite 7
- TypeScript 5
- Pinia for state management
- Vue Router for navigation
- Ant Design Vue for UI primitives
- Prettier for formatting

## Common Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Type-check: `npm run type-check`
- Production build: `npm run build`
- Format source files: `npm run format`

## Repository Layout

- `src/main.ts`: app bootstrap, global CSS, Pinia, Ant Design Vue, router setup
- `src/App.vue`: top-level app shell and header/navigation
- `src/router/`: route definitions and auth guards
- `src/stores/`: Pinia stores for app, cart, auth, profile, wishlist, reviews, and UI state
- `src/views/`: route-level pages
- `src/data/`: storefront mock data and domain helpers
- `src/assets/`: shared global styles and theme tokens
- `public/`: static assets
- `openspec/`: spec-driven change proposals, designs, tasks, and archived changes

## Project Conventions

- Prefer Composition API and keep logic inside `<script setup lang="ts">`.
- Reuse existing stores and data helpers before introducing new global state.
- Keep route-level behavior in `src/views/` and shared app-shell behavior in `src/App.vue` or stores.
- Use design tokens and CSS variables from `src/assets/base.css` for global visual changes.
- Follow the current styling pattern: component-scoped CSS for page/layout styling, global CSS only for shared tokens and app-wide rules.
- Keep dependencies minimal. This project currently does not require backend integration.

## State And UI Guidance

- Global UI preferences belong in `src/stores/ui.ts`.
- Cart, auth, wishlist, orders, profile, and reviews already have dedicated stores; extend them instead of creating parallel state models.
- When changing global presentation behavior, verify initialization paths in `src/main.ts` and any `document.documentElement` side effects.
- Ant Design Vue is already installed; prefer existing components where they fit rather than adding another UI library.

## OpenSpec Workflow

This repo uses a spec-driven workflow under `openspec/`.

- New work should usually live in `openspec/changes/<change-id>/`
- Each change may include:
  - `proposal.md`
  - `design.md`
  - `tasks.md`
  - `specs/<capability>/spec.md`
  - optional `.openspec.yaml`
- Completed work is archived under `openspec/changes/archive/`

When implementing a change:

1. Read the relevant proposal, design, tasks, and spec files first.
2. Match implementation scope to the active change instead of bundling unrelated work.
3. Update tasks or related spec artifacts only when the requested work requires it.

## Editing Guidance

- Preserve the existing file organization and naming patterns.
- Make focused edits and avoid sweeping rewrites unless explicitly requested.
- Do not remove or overwrite unrelated user changes in a dirty working tree.
- Prefer ASCII when editing, but preserve existing language content where possible.
- Be careful with file encoding: some current files appear to contain garbled user-facing text, so avoid accidental re-encoding when editing copy-heavy files.

## Verification Expectations

For code changes, prefer verifying with:

- `npm run type-check`
- `npm run build`

Run both when practical, especially for changes touching routing, stores, or shared UI shell behavior.

## Current Domain Context

- The application is a mock storefront with catalog, product detail, cart, checkout, login, profile, order history, wishlist, and recently viewed flows.
- Data is currently local and frontend-only.
- Theme support is being introduced through global UI state and CSS variables.

## Agent Priorities

- Keep the app working end-to-end.
- Respect OpenSpec scope.
- Preserve user changes.
- Prefer clear, maintainable Vue + TypeScript code.
