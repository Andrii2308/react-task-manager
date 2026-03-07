# React Task Manager

Single-page task manager built with React: tasks with description or subtasks, progress tracking, filters, and `localStorage` persistence.

## Features

- **Tasks** — title, description, or numbered subtasks (1., 2., …). If the description field starts with "1." and you press Enter, new subtasks are added; if you remove "1.", the text is treated as a plain description.
- **Subtasks** — individual checkboxes, progress shown as a percentage circle next to the main task.
- **Filters** — All / Active / Completed.
- **Persistence** — state is saved to `localStorage`.

## Tech Stack

| Category | Technology |
|----------|------------|
| UI | React 19 |
| Language | TypeScript 5.9 |
| Build | Vite 7 |
| Styles | Plain CSS (no modules or libraries) |
| Lint | ESLint + typescript-eslint |

## Project Structure

```
src/
├── App.tsx              # Task state, filters, CRUD, localStorage
├── main.tsx
├── index.css            # Global styles + animated gradient background
├── types/
│   └── task.ts          # Task, Subtask
└── components/
    ├── TaskInput.tsx    # Title input + description/subtasks textarea
    ├── TaskList.tsx     # Task list
    └── TaskItem.tsx     # Single task: checkbox, text, progress, expand subtasks
```

State lives in `App`; subtasks and progress are computed in `TaskItem`.

## Getting Started

```bash
# Install dependencies
npm install

# Dev server (Vite)
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

**Note:** Run commands from the `react-task-manager` folder (where this README and `package.json` live).

## Scripts

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` + `vite build`
- `npm run lint` — ESLint
- `npm run preview` — Local preview of the build output
