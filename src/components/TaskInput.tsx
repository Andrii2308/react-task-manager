import { useState, type KeyboardEvent } from "react";

interface Props {
  addTask: (
    text: string,
    description: string,
    subtaskTexts: string[]
  ) => void | Promise<void>;
}

function TaskInput({ addTask }: Props) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  const handleDescriptionKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      const lines = description.split("\n");
      const firstNonEmpty = lines.find((line) => line.trim() !== "");
      const isSubtasks =
        firstNonEmpty !== undefined &&
        /^\d+\.\s/.test(firstNonEmpty.trim());

      if (!isSubtasks) {
        return;
      }

      e.preventDefault();

      const nextNumber = lines.length + 1;

      const { selectionStart, selectionEnd } = e.currentTarget;
      const before = description.slice(0, selectionStart);
      const after = description.slice(selectionEnd);

      const newValue = `${before}\n${nextNumber}. ${after}`;
      setDescription(newValue);
    }
  };

  const handleAdd = async () => {
    if (!text.trim()) return;

    const rawLines = description
      .split("\n")
      .map((line) => line.trim());

    const nonEmptyLines = rawLines.filter((line) => line !== "");

    const firstLine = nonEmptyLines[0];
    const firstLineIsNumbered =
      firstLine !== undefined && /^\d+\.\s/.test(firstLine);

    const subtaskTexts = firstLineIsNumbered
      ? nonEmptyLines
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((line) => line !== "")
      : [];

    const hasRealSubtasks = firstLineIsNumbered && subtaskTexts.length > 0;

    const finalDescription = hasRealSubtasks ? description : description.trim() === "1." ? "" : description;

    await addTask(text, finalDescription, hasRealSubtasks ? subtaskTexts : []);
    setText("");
    setDescription("");
  };

  return (
    <div className="task-input-container">

      <div className="task-main-row">
        <input
          value={text}
          onChange={(e) => {
            const nextText = e.target.value;
            setText(nextText);

            if (nextText && !description) {
              setDescription("1. ");
            }
          }}
          placeholder="Task..."
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      {text && (
        <div className="description-wrapper">
          <textarea
            className="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            placeholder="Write subtasks (1., 2., ...) or task description (delete 1.)"
            rows={4}
          />
          {description === "1. " && (
            <span className="description-hint">
              Press Enter to add more subtasks, or delete &quot;1.&quot; to write a description
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskInput;