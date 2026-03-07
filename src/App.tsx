import { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import type { Task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (
    text: string,
    description: string,
    subtaskTexts: string[]
  ) => {
    const baseId = Date.now();

    const subtasks =
      subtaskTexts.length > 0
        ? subtaskTexts.map((subtaskText, index) => ({
            id: baseId + index + 1,
            text: subtaskText,
            completed: false,
          }))
        : undefined;

    const newTask: Task = {
      id: baseId,
      text,
      description,
      completed: false,
      subtasks,
    };

    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== id) return task;

        const newCompleted = !task.completed;
        const updatedSubtasks = task.subtasks
          ? task.subtasks.map((subtask) => ({
              ...subtask,
              completed: newCompleted,
            }))
          : task.subtasks;

        return {
          ...task,
          completed: newCompleted,
          subtasks: updatedSubtasks,
        };
      })
    );
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId || !task.subtasks) return task;

        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );

        const allCompleted =
          updatedSubtasks.length > 0 &&
          updatedSubtasks.every((subtask) => subtask.completed);

        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allCompleted,
        };
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="app-wrap">
    <div className="container">
      <h1>Task Manager</h1>
  
      <TaskInput addTask={addTask} />
  
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>
  
      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        toggleSubtask={toggleSubtask}
        deleteTask={deleteTask}
      />
    </div>
    </div>
  );
}

export default App;