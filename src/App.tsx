import { useState } from "react"
import TaskInput from "./components/TaskInput"
import TaskList from "./components/TaskList"
import LoginPanel from "./components/LoginPanel"
import { useAuth } from "./context/AuthContext"
import { useFirestoreTasks } from "./hooks/useFirestoreTasks"

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

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

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
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  return (
    <div className="app-wrap">
      <div className="app-toolbar">
        <button type="button" className="sign-out-btn" onClick={() => signOut()}>
          Sign out
        </button>
      </div>

      <div className="container">
        <header className="app-header">
          <h1>Task Manager</h1>
          <p className="user-email user-email--header" title={user.email ?? undefined}>
            {user.email ?? user.displayName ?? "Signed in"}
          </p>
        </header>

        {tasksError && <p className="firestore-error">Cloud sync: {tasksError}</p>}
        {tasksLoading && <p className="tasks-loading">Syncing tasks…</p>}

        <TaskInput addTask={addTask} />

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
