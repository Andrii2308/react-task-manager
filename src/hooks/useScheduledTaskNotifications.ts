import { useEffect, useRef } from "react"
import type { Task } from "../types/task"

const STORAGE_PREFIX = "tmNotify:"

function isDueScheduled(task: Task, now: number): boolean {
  if (task.completed) return false
  const at = task.scheduledAt
  if (at == null) return false
  return at <= now
}

function storageKey(task: Task): string | null {
  if (task.scheduledAt == null) return null
  return `${STORAGE_PREFIX}${task.id}:${task.scheduledAt}`
}

export function useScheduledTaskNotifications(tasks: Task[]) {
  const tasksRef = useRef(tasks)
  tasksRef.current = tasks

  useEffect(() => {
    const tick = () => {
      if (!("Notification" in window)) return
      if (Notification.permission !== "granted") return

      const now = Date.now()
      const list = tasksRef.current

      for (const task of list) {
        if (!isDueScheduled(task, now)) continue
        const key = storageKey(task)
        if (!key) continue
        try {
          if (localStorage.getItem(key)) continue
        } catch {
          continue
        }

        try {
          new Notification("У вас нове завдання", {
            body: task.text,
            icon: "/favicon.ico",
          })
          localStorage.setItem(key, "1")
        } catch {
          /* ignore */
        }
      }
    }

    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
  }, [])
}
