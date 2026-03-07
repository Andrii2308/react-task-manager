# React Task Manager

A simple single-page task manager built with React.
Supports subtasks, progress tracking, filtering, and localStorage persistence.

---

## 🖼 Preview

```
![Task-Manager](https://github.com/user-attachments/assets/78bed4eb-3204-479f-9842-742adf6221da)

```

---

## 🎥 Demo

```
https://youtu.be/CDzLarvAy-0
```

---

## ✨ Features

* Create tasks with titles and descriptions
* Support for **numbered subtasks (1., 2., 3., …)**
* Individual **checkbox for each subtask**
* **Progress indicator** for completed subtasks
* Task **filters**: All / Active / Completed
* **LocalStorage persistence** (tasks are saved automatically)

---

## 🧰 Tech Stack

| Category   | Technology                 |
| ---------- | -------------------------- |
| UI         | React 19                   |
| Language   | TypeScript 5               |
| Build Tool | Vite                       |
| Styles     | Plain CSS                  |
| Linting    | ESLint + typescript-eslint |

---

## 📁 Project Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── types/
│   └── task.ts
└── components/
    ├── TaskInput.tsx
    ├── TaskList.tsx
    └── TaskItem.tsx
```

* **App.tsx** — main task state, filters, CRUD operations
* **TaskInput** — create new tasks
* **TaskList** — render task list
* **TaskItem** — single task with progress and subtasks

---

## 🚀 Getting Started

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build for production:

```
npm run build
```

Preview production build:

```
npm run preview
```

**Note:** Run commands from the `react-task-manager` folder (where `package.json` is located).

---

## 📌 Scripts

* `npm run dev` — start Vite development server
* `npm run build` — build project for production
* `npm run preview` — preview production build
* `npm run lint` — run ESLint

---

## 📄 License

MIT

