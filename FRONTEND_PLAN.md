# Frontend Learning Plan

## Planned Stack

- Next.js
- React
- TypeScript
- App Router
- Redux Toolkit
- RTK Query for API data when shared server state becomes useful
- CSS Modules or Tailwind CSS, depending on what feels clearest while learning

## Why This Stack

- Next.js gives routing, layouts, and a good project structure out of the box.
- React is the core UI layer and matches the stack we planned from the start.
- TypeScript helps make props, API responses, and state safer to work with.
- Redux Toolkit is useful once auth, dashboard state, filters, and shared data grow.
- RTK Query is a good next step once the frontend starts talking to the Nest API in many places.

## Learning Goals

- Understand how App Router maps folders to routes.
- Learn the difference between server and client components.
- Learn how to structure layouts, pages, and reusable UI components.
- Learn how frontend state differs from backend data.
- Learn how to fetch data cleanly from the Nest API.
- Learn when local component state is enough and when Redux is worth using.

## Recommended Frontend Build Order

1. Create the main app layout.
2. Add a sidebar/topbar shell.
3. Build static pages first: dashboard, patients, appointments, billing.
4. Connect one page to the API, probably patients list first.
5. Add forms for create and update flows.
6. Add global state only when repeated state-sharing problems appear.

## Suggested First Pages

- Dashboard
- Patients list
- Patient details
- Appointments list
- Appointment details
- Billing overview

## Suggested Route Structure

- `/`
- `/dashboard`
- `/patients`
- `/patients/[id]`
- `/appointments`
- `/appointments/[id]`
- `/billing`
- `/settings`

## State Plan

- Start with simple local state and direct fetches for learning.
- Add RTK Query when multiple screens need the same API data patterns.
- Add Redux Toolkit for cross-page UI state, auth state, filters, and workflow state.

## API Integration Plan

- Start with one typed API helper layer.
- Reuse backend DTO and response shapes conceptually, even if not yet shared as code.
- Learn loading, empty, success, and error states properly on each page.

## Frontend Backlog

- Create a consistent layout shell.
- Decide on CSS Modules or Tailwind before building many screens.
- Add typed API client helpers.
- Add patient list page connected to backend.
- Add appointment details page connected to backend details route.
- Add form validation for create and update flows.
- Add auth pages later once backend auth exists.

## Learning Notes

- Build one page end to end before creating many screens.
- Prefer understanding route structure and data flow over copying UI patterns.
- Keep the first version simple, then refactor once repeated patterns are obvious.
