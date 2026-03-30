export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  subtasks?: Subtask[];
  /** Unix ms — task is "planned" until this moment; then it appears as due + notification */
  scheduledAt?: number;
}