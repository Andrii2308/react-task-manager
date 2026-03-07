import { useState } from "react";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  toggleTask: (id: number) => void;
  toggleSubtask: (taskId: number, subtaskId: number) => void;
  deleteTask: (id: number) => void;
}

function TaskItem({ task, toggleTask, toggleSubtask, deleteTask }: Props) {
  const [open, setOpen] = useState(false);

  const totalSubtasks = task.subtasks?.length ?? 0;
  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.completed).length ?? 0;

  const progress =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : task.completed
      ? 100
      : 0;

  const hasDetails =
    (task.subtasks && task.subtasks.length > 0) ||
    !!task.description;

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

          {totalSubtasks > 0 && (
            <div className="task-progress-circle">
              <span>{progress}%</span>
            </div>
          )}

          {hasDetails && (
            <button onClick={() => setOpen(!open)}>
              {open ? "▲" : "▼"}
            </button>
          )}

          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>

        {open && (
          <>
            {task.subtasks && task.subtasks.length > 0 ? (
              <ul className="subtask-list">
                {task.subtasks.map((subtask, index) => (
                  <li
                    key={subtask.id}
                    className={`subtask-item${
                      subtask.completed ? " subtask-completed" : ""
                    }`}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() =>
                          toggleSubtask(task.id, subtask.id)
                        }
                      />
                      <span className="subtask-text">
                        {index + 1}. {subtask.text}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              task.description && (
                <p className="task-description">{task.description}</p>
              )
            )}
          </>
        )}
      </div>
    </li>
  );
}

export default TaskItem;