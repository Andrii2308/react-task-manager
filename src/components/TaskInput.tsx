import { useState, type KeyboardEvent } from "react"

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function defaultScheduleInput() {
  const d = new Date()
  d.setMinutes(d.getMinutes() + 30, 0, 0)
  return toDatetimeLocalValue(d)
}

interface Props {
  addTask: (
    text: string,
    description: string,
    subtaskTexts: string[],
    scheduledAt?: number
  ) => void | Promise<void>
}

function TaskInput({ addTask }: Props) {
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleWhen, setScheduleWhen] = useState(defaultScheduleInput)

  const handleDescriptionKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      const lines = description.split("\n")
      const firstNonEmpty = lines.find((line) => line.trim() !== "")
      const isSubtasks =
        firstNonEmpty !== undefined &&
        /^\d+\.\s/.test(firstNonEmpty.trim())

      if (!isSubtasks) {
        return
      }

      e.preventDefault()

      const nextNumber = lines.length + 1

      const { selectionStart, selectionEnd } = e.currentTarget
      const before = description.slice(0, selectionStart)
      const after = description.slice(selectionEnd)

      const newValue = `${before}\n${nextNumber}. ${after}`
      setDescription(newValue)
    }
  }

  function parseFormPayload() {
    if (!text.trim()) return null

    const rawLines = description.split("\n").map((line) => line.trim())
    const nonEmptyLines = rawLines.filter((line) => line !== "")
    const firstLine = nonEmptyLines[0]
    const firstLineIsNumbered =
      firstLine !== undefined && /^\d+\.\s/.test(firstLine)

    const subtaskTexts = firstLineIsNumbered
      ? nonEmptyLines
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((line) => line !== "")
      : []

    const hasRealSubtasks = firstLineIsNumbered && subtaskTexts.length > 0
    const finalDescription = hasRealSubtasks
      ? description
      : description.trim() === "1."
        ? ""
        : description

    return {
      text: text.trim(),
      finalDescription,
      subtaskTexts: hasRealSubtasks ? subtaskTexts : [],
    }
  }

  const handleAdd = async () => {
    const payload = parseFormPayload()
    if (!payload) return

    await addTask(payload.text, payload.finalDescription, payload.subtaskTexts)
    setText("")
    setDescription("")
  }

  const openSchedule = () => {
    if (!text.trim()) return
    setScheduleWhen(defaultScheduleInput())
    setScheduleOpen(true)
  }

  const handleScheduleSave = async () => {
    const payload = parseFormPayload()
    if (!payload) return

    const ts = new Date(scheduleWhen).getTime()
    if (Number.isNaN(ts) || ts <= Date.now()) {
      window.alert("Pick a date and time in the future.")
      return
    }

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    await addTask(
      payload.text,
      payload.finalDescription,
      payload.subtaskTexts,
      ts
    )
    setText("")
    setDescription("")
    setScheduleOpen(false)
  }

  return (
    <div className="task-input-container">
      <div className="task-main-row">
        <input
          value={text}
          onChange={(e) => {
            const nextText = e.target.value
            setText(nextText)

            if (nextText && !description) {
              setDescription("1. ")
            }
          }}
          placeholder="Task..."
        />

        <div className="task-actions">
          <button type="button" onClick={handleAdd}>
            Add
          </button>
          <button
            type="button"
            className="btn-schedule"
            onClick={openSchedule}
            title="Choose when this task should remind you"
          >
            Add for later
          </button>
        </div>
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
              Press Enter to add more subtasks, or delete &quot;1.&quot; to write
              a description
            </span>
          )}
        </div>
      )}

      {scheduleOpen && (
        <div
          className="schedule-modal-backdrop"
          role="presentation"
          onClick={() => setScheduleOpen(false)}
        >
          <div
            className="schedule-modal"
            role="dialog"
            aria-labelledby="schedule-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="schedule-modal-title" className="schedule-modal-title">
              When should this task appear?
            </h2>
            <p className="schedule-modal-hint">
              You’ll get a browser notification at this time (allow notifications
              if asked).
            </p>
            <label className="schedule-modal-label">
              Date &amp; time
              <input
                type="datetime-local"
                value={scheduleWhen}
                min={toDatetimeLocalValue(new Date())}
                onChange={(e) => setScheduleWhen(e.target.value)}
              />
            </label>
            <div className="schedule-modal-actions">
              <button type="button" onClick={() => setScheduleOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={handleScheduleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskInput
