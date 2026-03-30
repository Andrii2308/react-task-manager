import { useCallback, useEffect, useState } from "react"
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore"
import { getFirestoreDb } from "../lib/firebase"
import type { Task } from "../types/task"

function newTaskId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000)
}

function taskToDoc(task: Task): Record<string, unknown> {
  return {
    id: task.id,
    text: task.text,
    description: task.description,
    completed: task.completed,
    sortAt: task.id,
    subtasks:
      task.subtasks && task.subtasks.length > 0 ? task.subtasks : [],
  }
}

function docToTask(data: Record<string, unknown>): Task {
  const subtasksRaw = data.subtasks
  let subtasks: Task["subtasks"]
  if (
    Array.isArray(subtasksRaw) &&
    subtasksRaw.length > 0
  ) {
    subtasks = subtasksRaw.map((st) => {
      const o = st as { id?: unknown; text?: unknown; completed?: unknown }
      return {
        id: Number(o.id),
        text: String(o.text ?? ""),
        completed: Boolean(o.completed),
      }
    })
  }

  return {
    id: Number(data.id),
    text: String(data.text ?? ""),
    description: String(data.description ?? ""),
    completed: Boolean(data.completed),
    subtasks,
  }
}

export function useFirestoreTasks(uid: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(!!uid)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid) {
      setTasks([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    const db = getFirestoreDb()
    const tasksRef = collection(db, "users", uid, "tasks")
    const q = query(tasksRef, orderBy("sortAt", "desc"))

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Task[] = []
        snap.forEach((d) => {
          list.push(docToTask(d.data() as Record<string, unknown>))
        })
        setTasks(list)
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [uid])

  const persist = useCallback(
    async (task: Task) => {
      if (!uid) return
      const db = getFirestoreDb()
      await setDoc(doc(db, "users", uid, "tasks", String(task.id)), taskToDoc(task))
    },
    [uid]
  )

  const addTask = useCallback(
    async (text: string, description: string, subtaskTexts: string[]) => {
      if (!uid) return

      const baseId = newTaskId()
      const subtasks =
        subtaskTexts.length > 0
          ? subtaskTexts.map((subtaskText, index) => ({
              id: baseId + index + 1,
              text: subtaskText,
              completed: false,
            }))
          : undefined

      const newTask: Task = {
        id: baseId,
        text,
        description,
        completed: false,
        subtasks,
      }

      await persist(newTask)
    },
    [uid, persist]
  )

  const toggleTask = useCallback(
    async (id: number) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const newCompleted = !task.completed
      const updatedSubtasks = task.subtasks
        ? task.subtasks.map((subtask) => ({
            ...subtask,
            completed: newCompleted,
          }))
        : task.subtasks

      await persist({
        ...task,
        completed: newCompleted,
        subtasks: updatedSubtasks,
      })
    },
    [tasks, persist]
  )

  const toggleSubtask = useCallback(
    async (taskId: number, subtaskId: number) => {
      const task = tasks.find((t) => t.id === taskId)
      if (!task || !task.subtasks) return

      const updatedSubtasks = task.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )

      const allCompleted =
        updatedSubtasks.length > 0 &&
        updatedSubtasks.every((subtask) => subtask.completed)

      await persist({
        ...task,
        subtasks: updatedSubtasks,
        completed: allCompleted,
      })
    },
    [tasks, persist]
  )

  const deleteTask = useCallback(
    async (id: number) => {
      if (!uid) return
      const db = getFirestoreDb()
      await deleteDoc(doc(db, "users", uid, "tasks", String(id)))
    },
    [uid]
  )

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    toggleSubtask,
    deleteTask,
  }
}
