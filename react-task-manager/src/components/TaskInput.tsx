import { useState } from "react";

interface Props {
  addTask: (text: string, description: string) => void;
}

function TaskInput({ addTask }: Props) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;

    addTask(text, description);
    setText("");
    setDescription("");
  };

  return (
    <div className="task-input-container">

      <div className="task-main-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task..."
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      {text && (
        <input
          className="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
        />
      )}
    </div>
  );
}

export default TaskInput;