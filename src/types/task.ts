export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export type TaskRecurrence = "daily" | "weekly" | "monthly"

export interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  subtasks?: Subtask[];
  /** Unix ms — task is "planned" until this moment; then it appears as due + notification */
  scheduledAt?: number;
  /** If set with scheduledAt: repeats after each completion */
  recurrence?: TaskRecurrence;
}