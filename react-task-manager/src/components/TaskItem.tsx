import { useState } from "react";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

function TaskItem({ task, toggleTask, deleteTask }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="task-item">

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        className="task-checkbox"
      />

      <div className="task-body">

        <div className="task-row">
          <span
            className="task-text"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.text}
          </span>

          <button onClick={() => setOpen(!open)}>
            {open ? "▲" : "▼"}
          </button>

          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>

        {open && (
          <p className="task-description">
            {task.description}
          </p>
        )}

      </div>
    </li>
  );
}

export default TaskItem;