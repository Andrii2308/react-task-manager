import { useState } from "react";

interface Props {
  addTask: (text: string) => void;
}

function TaskInput({ addTask }: Props) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;

    addTask(text);
    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
      />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default TaskInput;