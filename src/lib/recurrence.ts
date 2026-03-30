import type { TaskRecurrence } from "../types/task"

/** Next occurrence after `fromMs`, anchored to the same clock time / weekday. */
export function nextRecurrence(fromMs: number, mode: TaskRecurrence): number {
  const d = new Date(fromMs)
  if (mode === "daily") {
    d.setDate(d.getDate() + 1)
  } else if (mode === "weekly") {
    d.setDate(d.getDate() + 7)
  } else {
    d.setMonth(d.getMonth() + 1)
  }
  return d.getTime()
}
