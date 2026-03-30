import { useCallback, useState } from "react"
import TaskInput from "./components/TaskInput"
import TaskList from "./components/TaskList"
import LoginPanel from "./components/LoginPanel"
import TaskTemplatesPanel from "./components/TaskTemplatesPanel"
import { useAuth } from "./context/AuthContext"
import { useFirestoreTasks } from "./hooks/useFirestoreTasks"
import { useScheduledTaskNotifications } from "./hooks/useScheduledTaskNotifications"
import { useTemplateLibrary } from "./hooks/useTemplateLibrary"

function isPlannedTask(task: {
  completed: boolean
  scheduledAt?: number
}): boolean {
  if (task.completed) return false
  const at = task.scheduledAt
  if (at == null) return false
  return at > Date.now()
}

function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    addTask,
    toggleTask,
    toggleSubtask,
    deleteTask,
  } = useFirestoreTasks(user?.uid)

  useScheduledTaskNotifications(tasks)

  const templateLibrary = useTemplateLibrary(user?.uid)

  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "planned"
  >("all")

  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [templatePrefill, setTemplatePrefill] = useState<{
    title: string
    subtasks: string[]
  } | null>(null)
  const [templatePrefillTick, setTemplatePrefillTick] = useState(0)

  const clearTemplatePrefill = useCallback(() => setTemplatePrefill(null), [])

  const handleTemplatePick = (title: string, subtasks: string[]) => {
    setTemplatePrefill({ title, subtasks })
    setTemplatePrefillTick((n) => n + 1)
  }

  if (authLoading) {
    return (
      <div className="app-wrap">
        <div className="container auth-loading">
          <p>Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app-wrap">
        <div className="container">
          <LoginPanel />
        </div>
      </div>
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "planned") return isPlannedTask(task)
    if (filter === "active")
      return !task.completed && !isPlannedTask(task)
    return true
  })

  return (
    <div className="app-wrap">
      <div className="app-toolbar">
        <button
          type="button"
          className="templates-toolbar-btn"
          onClick={() => setTemplatesOpen(true)}
        >
          Templates
        </button>
        <button type="button" className="sign-out-btn" onClick={() => signOut()}>
          Sign out
        </button>
      </div>

      <TaskTemplatesPanel
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onPick={handleTemplatePick}
        sections={templateLibrary.sections}
        trash={templateLibrary.trash}
        ready={templateLibrary.ready}
        addSection={templateLibrary.addSection}
        renameSection={templateLibrary.renameSection}
        deleteSection={templateLibrary.deleteSection}
        addTask={templateLibrary.addTask}
        updateTask={templateLibrary.updateTask}
        deleteTask={templateLibrary.deleteTask}
        restoreTrashEntry={templateLibrary.restoreTrashEntry}
        purgeTrashEntry={templateLibrary.purgeTrashEntry}
        resetToDefaults={templateLibrary.resetToDefaults}
      />

      <div className="container">
        <header className="app-header">
          <h1>Task Manager</h1>
          <p className="user-email user-email--header" title={user.email ?? undefined}>
            {user.email ?? user.displayName ?? "Signed in"}
          </p>
        </header>

        {tasksError && <p className="firestore-error">Cloud sync: {tasksError}</p>}
        {tasksLoading && <p className="tasks-loading">Syncing tasks…</p>}

        <TaskInput
          addTask={addTask}
          templatePrefillTick={templatePrefillTick}
          templatePrefill={templatePrefill}
          onTemplatePrefillConsumed={clearTemplatePrefill}
        />

        <div className="filters">
          <button type="button" onClick={() => setFilter("all")}>
            All
          </button>
          <button type="button" onClick={() => setFilter("active")}>
            Active
          </button>
          <button type="button" onClick={() => setFilter("completed")}>
            Completed
          </button>
          <button type="button" onClick={() => setFilter("planned")}>
            Planned
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          toggleTask={toggleTask}
          toggleSubtask={toggleSubtask}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  )
}

export default App
