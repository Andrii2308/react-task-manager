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
}