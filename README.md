# Submitly: Assignment & Review Dashboard

> Every assignment, tracked from assigned to submitted.

A responsive dashboard for a student-assignment system with two roles, **Student** and **Admin (Professor)**.
Built with **React 18 + Tailwind CSS (Vite)**. There is no backend: data lives in `localStorage` behind a small mock API layer, so it survives page refreshes.

- Demo video: https://drive.google.com/file/d/1HRLfRozjUslx1Y9f0Xt_00FUKYqt5zLS/view?usp=sharing

## Features

**Login and roles**
- Mock role switcher with 7 seeded users (2 admins, 5 students). No real authentication.
- The session is remembered across refreshes. Each user only sees their own data.

**Student**
- Assignment list with title, description, due date, status and a Drive link.
- Two-step submission: **"Yes, I have submitted"** opens a **final confirmation dialog**; only then does the status change to *Submitted* (with a timestamp).
- Overall progress indicator, e.g. "3 of 5 submitted", plus a progress bar.

**Admin**
- Create, edit and delete assignments (including the Drive link), with form validation.
- Assign to all students or to selected students.
- Per assignment: every assigned student's status and a class completion progress bar.
- Admins only see assignments they created, and write actions are checked against `createdBy`.

**General**
- Fully responsive (mobile-first Tailwind layout, bottom-sheet style dialogs on small screens).
- Loading, empty and error states (with retry), plus toast feedback for actions and storage failures.

**Bonus items included**
- Search, status filter and sorting (due date asc/desc, title) for both roles.
- Overdue highlighting (red border, badge and "N days overdue" label).
- Dark mode (remembers your choice, respects the OS setting on first visit).
- Small animations (respecting `prefers-reduced-motion`).
- Accessibility: labelled form controls, focus-trapping modals with Esc to close and focus restore, skip link, `aria-expanded`, `role="progressbar"`, visible focus rings, status never conveyed by colour alone.
- Unit tests for the core logic (Vitest).

## Setup

Requires Node 18+.

```bash
npm install
npm run dev       # start the dev server
npm test          # run unit tests
npm run build     # production build in dist/
npm run preview   # preview the production build
```

Use **Reset demo data** on the login screen to restore the seed data.

### Deploying

Vercel or Netlify both work with zero config: build command `npm run build`, output directory `dist`.

## Folder structure

```
src/
├── main.jsx                  # entry, mounts <AppProvider><App/></AppProvider>
├── App.jsx                   # chooses login / student / admin view, loading + error states
├── index.css                 # Tailwind layers and shared utility classes (btn, card, input)
├── context/
│   └── AppContext.jsx        # single source of truth: state, persistence, all actions
├── pages/
│   ├── LoginPage.jsx
│   ├── StudentDashboard.jsx
│   └── AdminDashboard.jsx
├── components/
│   ├── Header.jsx
│   ├── StudentAssignmentCard.jsx
│   ├── AdminAssignmentCard.jsx
│   ├── AssignmentForm.jsx
│   ├── FilterBar.jsx
│   ├── Modal.jsx             # accessible dialog primitive
│   ├── ConfirmDialog.jsx     # built on Modal
│   ├── ProgressBar.jsx
│   ├── StatusBadge.jsx
│   ├── EmptyState.jsx
│   ├── ErrorState.jsx
│   ├── Spinner.jsx
│   └── Toast.jsx
├── utils/
│   ├── storage.js            # mock API over localStorage (async, with latency and failures)
│   ├── helpers.js            # pure functions: dates, completion maths, sorting, validation
│   └── helpers.test.js
└── data/
    └── seed.js               # seeded users and assignments (dates are relative to "today")
```

## Component architecture

```
<AppProvider>                         state + persistence + actions (context)
 └─ <App>
     ├─ <Spinner> / <ErrorState>      while loading / if the load fails
     ├─ <LoginPage>                   pick a seeded user
     └─ <Header> + one of:
         ├─ <StudentDashboard>
         │    ├─ <ProgressBar>        "3 of 5 submitted"
         │    ├─ <FilterBar>
         │    └─ <StudentAssignmentCard> × n
         │         ├─ <StatusBadge>
         │         └─ <ConfirmDialog> → <Modal>      (step 2 of submission)
         └─ <AdminDashboard>
              ├─ <ProgressBar>        overall submission rate
              ├─ <FilterBar>
              ├─ <AdminAssignmentCard> × n
              │    ├─ <ProgressBar>   class completion
              │    ├─ <StatusBadge>   per-student status
              │    └─ <ConfirmDialog> (delete)
              └─ <AssignmentForm> → <Modal>           (create / edit)
```

Pages own view-specific state (filters, which dialog is open). Presentational components receive plain props and callbacks. Everything shared lives in the context.

## Key design decisions

1. **Normalised data model.** `assignments` hold `assignedTo` (`'all'` or an array of student ids) and `createdBy`. Submissions are stored separately as `submissions[assignmentId][studentId] = { submittedAt }`. This keeps one source of truth, so a student's status and the admin's completion bar can never disagree.
2. **`assignedTo: 'all'` is a flag, not a copied list.** If students are added later, "all" automatically includes them.
3. **Mock API layer.** `storage.js` is async with a small artificial delay and real error paths. Loading and error UI are therefore genuine, and swapping in a real backend only means replacing that file.
4. **Context API, not a state library.** There is one small domain, so a single context with `useState`/`useEffect` is enough. A `useEffect` persists the data after every change.
5. **Data isolation is enforced twice.** Views filter by the current user, and the context actions re-check role and ownership, so an admin cannot edit or delete another admin's assignment even by mistake.
6. **Two-step, irreversible submission.** The "Yes, I have submitted" button only opens a confirmation dialog; the status changes only on the final confirm. The status is never inferred from the Drive link, so it is a self-reported confirmation.
7. **Derived values are computed, not stored.** Overdue state, progress and completion percentages come from pure helpers (unit tested), so they are always correct relative to today's date.
8. **Dates are parsed as local dates** (`yyyy-mm-dd` to local midnight) to avoid the off-by-one-day bug that `new Date('2026-11-05')` causes in non-UTC time zones.
9. **Accessibility is built into the primitives.** The `Modal` handles Escape, focus trapping and focus restore once, so every dialog gets it for free.
10. **Resilience.** Corrupt `localStorage` JSON falls back to re-seeding instead of crashing, and failed saves surface a toast.

## Seeded users

| Role | Name |
|---|---|
| Admin | Prof. Meera Kulkarni, Prof. Rahul Verma |
| Student | Amruta Deokar, Rohan Patil, Sneha Joshi, Aditya Shah, Pooja More |

Suggested demo path: log in as **Amruta** (5 assignments: 2 submitted, 2 pending, 1 overdue), submit one using the two-step flow, then switch to **Prof. Meera** to see the completion bar update.
