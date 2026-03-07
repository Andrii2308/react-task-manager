import type { Task } from "../types/task";
import TaskItem from "./TaskItem";

interface Props {
  tasks: Task[];
  toggleTask: (id: number) => void;
  toggleSubtask: (taskId: number, subtaskId: number) => void;
  deleteTask: (id: number) => void;
}

function TaskList({ tasks, toggleTask, toggleSubtask, deleteTask }: Props) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          toggleSubtask={toggleSubtask}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;