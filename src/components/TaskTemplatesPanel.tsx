import { useEffect, useState } from "react"
import type { TemplateSectionDef, TemplateTaskDef } from "../data/taskTemplates"
import type { TrashEntry } from "../hooks/useTemplateLibrary"

type EditorState = {
  sectionId: string
  taskId?: string
  title: string
  subtasksText: string
}

type CategoryEditorState = { sectionId: string; title: string }

type Props = {
  open: boolean
  onClose: () => void
  onPick: (title: string, subtasks: string[]) => void
  sections: TemplateSectionDef[]
  trash: TrashEntry[]
  ready: boolean
  addSection: (title: string) => void
  renameSection: (sectionId: string, title: string) => void
  deleteSection: (sectionId: string) => void
  addTask: (
    sectionId: string,
    task: { title: string; subtasks: string[] }
  ) => void
  updateTask: (
    sectionId: string,
    taskId: string,
    task: { title: string; subtasks: string[] }
  ) => void
  deleteTask: (sectionId: string, taskId: string) => void
  restoreTrashEntry: (trashItemId: string) => void
  purgeTrashEntry: (trashItemId: string) => void
  resetToDefaults: () => void
}

function trashLabel(entry: TrashEntry): string {
  if (entry.kind === "section") {
    return `Category: ${entry.section.title}`
  }
  return `Template: ${entry.task.title} · ${entry.sectionTitle}`
}

function TaskTemplatesPanel({
  open,
  onClose,
  onPick,
  sections,
  trash,
  ready,
  addSection,
  renameSection,
  deleteSection,
  addTask,
  updateTask,
  deleteTask,
  restoreTrashEntry,
  purgeTrashEntry,
  resetToDefaults,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [editorError, setEditorError] = useState<string | null>(null)
  const [newCategoryTitle, setNewCategoryTitle] = useState("")
  const [newCategoryError, setNewCategoryError] = useState<string | null>(null)
  const [categoryEditor, setCategoryEditor] = useState<CategoryEditorState | null>(
    null
  )
  const [categoryEditorError, setCategoryEditorError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (!open) {
      setExpandedId(null)
      setEditor(null)
      setEditorError(null)
      setNewCategoryError(null)
      setCategoryEditor(null)
      setCategoryEditorError(null)
      return
    }
    setExpandedId((cur) => {
      if (cur && sections.some((s) => s.id === cur)) return cur
      return sections[0]?.id ?? null
    })
  }, [open, sections])

  if (!open) return null

  const openNewTaskEditor = (sectionId: string) => {
    setEditorError(null)
    setEditor({ sectionId, title: "", subtasksText: "" })
  }

  const openEditTaskEditor = (sectionId: string, task: TemplateTaskDef) => {
    setEditorError(null)
    setEditor({
      sectionId,
      taskId: task.id,
      title: task.title,
      subtasksText: task.subtasks.join("\n"),
    })
  }

  const saveEditor = () => {
    if (!editor) return
    const subtasks = editor.subtasksText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (!editor.title.trim()) {
      setEditorError("Please enter a template title.")
      return
    }
    setEditorError(null)
    if (editor.taskId) {
      updateTask(editor.sectionId, editor.taskId, {
        title: editor.title,
        subtasks,
      })
    } else {
      addTask(editor.sectionId, { title: editor.title, subtasks })
    }
    setEditor(null)
  }

  const submitNewCategory = () => {
    const t = newCategoryTitle.trim()
    if (!t) {
      setNewCategoryError("Enter a category name.")
      return
    }
    setNewCategoryError(null)
    addSection(t)
    setNewCategoryTitle("")
  }

  const openRenameCategory = (section: TemplateSectionDef) => {
    setCategoryEditorError(null)
    setCategoryEditor({ sectionId: section.id, title: section.title })
  }

  const saveCategoryEditor = () => {
    if (!categoryEditor) return
    const t = categoryEditor.title.trim()
    if (!t) {
      setCategoryEditorError("Enter a category name.")
      return
    }
    setCategoryEditorError(null)
    renameSection(categoryEditor.sectionId, t)
    setCategoryEditor(null)
  }

  return (
    <>
      <div
        className="schedule-modal-backdrop template-panel-backdrop"
        role="presentation"
        onClick={onClose}
      >
        <div
          className="schedule-modal template-panel"
          role="dialog"
          aria-labelledby="template-panel-title"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="template-panel-title" className="schedule-modal-title">
            Task templates
          </h2>
          <p className="schedule-modal-hint">
            Pick a template to fill the form. Below the textarea, choose{" "}
            <strong>Add now</strong>, <strong>Schedule</strong>, or{" "}
            <strong>Recurring</strong>. Your library and trash are stored in this
            browser for your account.
          </p>

          <div className="template-new-category">
            <input
              type="text"
              className="template-new-category-input"
              value={newCategoryTitle}
              onChange={(e) => {
                setNewCategoryTitle(e.target.value)
                setNewCategoryError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewCategory()
              }}
              placeholder="New category name"
              aria-label="New category name"
            />
            <button
              type="button"
              className="template-toolbar-btn primary"
              onClick={submitNewCategory}
            >
              Add category
            </button>
          </div>
          {newCategoryError && (
            <p className="template-inline-error">{newCategoryError}</p>
          )}

          <div className="template-panel-toolbar">
            <button type="button" className="template-toolbar-btn" onClick={resetToDefaults}>
              Reset to defaults
            </button>
          </div>

          {!ready ? (
            <p className="template-loading">Loading your library…</p>
          ) : (
            <>
              <div className="template-sections">
                {sections.map((section) => {
                  const isOpen = expandedId === section.id
                  return (
                    <div key={section.id} className="template-section">
                      <button
                        type="button"
                        className="template-section-toggle"
                        onClick={() =>
                          setExpandedId(isOpen ? null : section.id)
                        }
                        aria-expanded={isOpen}
                      >
                        <span>{section.title}</span>
                        <span className="template-chevron">
                          {isOpen ? "▼" : "▶"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="template-section-body">
                          <div className="template-section-actions">
                            <button
                              type="button"
                              className="template-small-btn"
                              onClick={() => openNewTaskEditor(section.id)}
                            >
                              + Add template
                            </button>
                            <button
                              type="button"
                              className="template-small-btn"
                              onClick={() => openRenameCategory(section)}
                            >
                              Rename category
                            </button>
                            <button
                              type="button"
                              className="template-small-btn danger"
                              onClick={() => deleteSection(section.id)}
                            >
                              Delete category
                            </button>
                          </div>
                          {section.tasks.length === 0 ? (
                            <p className="template-empty">
                              No templates yet — use “Add template”.
                            </p>
                          ) : (
                            <ul className="template-task-list">
                              {section.tasks.map((task) => (
                                <li key={task.id} className="template-task-row">
                                  <button
                                    type="button"
                                    className="template-task-pick"
                                    onClick={() => {
                                      onPick(task.title, task.subtasks)
                                      onClose()
                                    }}
                                  >
                                    <span className="template-task-title">
                                      {task.title}
                                    </span>
                                    <span className="template-task-meta">
                                      {task.subtasks.length} subtasks
                                    </span>
                                  </button>
                                  <div className="template-task-actions">
                                    <button
                                      type="button"
                                      className="template-small-btn"
                                      onClick={() =>
                                        openEditTaskEditor(section.id, task)
                                      }
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="template-small-btn danger"
                                      onClick={() =>
                                        deleteTask(section.id, task.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <details className="template-trash">
                <summary className="template-trash-summary">
                  Trash ({trash.length})
                </summary>
                {trash.length === 0 ? (
                  <p className="template-empty">Trash is empty.</p>
                ) : (
                  <ul className="template-trash-list">
                    {trash.map((entry) => (
                      <li key={entry.id} className="template-trash-row">
                        <span className="template-trash-label">
                          {trashLabel(entry)}
                        </span>
                        <div className="template-trash-actions">
                          <button
                            type="button"
                            className="template-small-btn"
                            onClick={() => restoreTrashEntry(entry.id)}
                          >
                            Restore
                          </button>
                          <button
                            type="button"
                            className="template-small-btn danger"
                            onClick={() => purgeTrashEntry(entry.id)}
                          >
                            Delete forever
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            </>
          )}

          <div className="schedule-modal-actions">
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {editor && (
        <div
          className="schedule-modal-backdrop template-editor-backdrop"
          role="presentation"
          onClick={() => setEditor(null)}
        >
          <div
            className="schedule-modal template-editor-modal"
            role="dialog"
            aria-labelledby="template-editor-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="template-editor-title" className="schedule-modal-title">
              {editor.taskId ? "Edit template" : "New template"}
            </h2>
            <label className="schedule-modal-label">
              Title
              <input
                type="text"
                value={editor.title}
                onChange={(e) => {
                  setEditor({ ...editor, title: e.target.value })
                  setEditorError(null)
                }}
                placeholder="e.g. Weekly review"
              />
            </label>
            {editorError && (
              <p className="template-inline-error" role="alert">
                {editorError}
              </p>
            )}
            <label className="schedule-modal-label">
              Subtasks (one per line)
              <textarea
                value={editor.subtasksText}
                onChange={(e) =>
                  setEditor({ ...editor, subtasksText: e.target.value })
                }
                rows={8}
                className="template-editor-textarea"
                placeholder={"First subtask\nSecond subtask"}
              />
            </label>
            <div className="schedule-modal-actions">
              <button type="button" onClick={() => setEditor(null)}>
                Cancel
              </button>
              <button type="button" onClick={saveEditor}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryEditor && (
        <div
          className="schedule-modal-backdrop template-editor-backdrop"
          role="presentation"
          onClick={() => setCategoryEditor(null)}
        >
          <div
            className="schedule-modal template-editor-modal"
            role="dialog"
            aria-labelledby="category-editor-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="category-editor-title" className="schedule-modal-title">
              Rename category
            </h2>
            <label className="schedule-modal-label">
              Name
              <input
                type="text"
                value={categoryEditor.title}
                onChange={(e) => {
                  setCategoryEditor({
                    sectionId: categoryEditor.sectionId,
                    title: e.target.value,
                  })
                  setCategoryEditorError(null)
                }}
                placeholder="Category name"
              />
            </label>
            {categoryEditorError && (
              <p className="template-inline-error" role="alert">
                {categoryEditorError}
              </p>
            )}
            <div className="schedule-modal-actions">
              <button type="button" onClick={() => setCategoryEditor(null)}>
                Cancel
              </button>
              <button type="button" onClick={saveCategoryEditor}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskTemplatesPanel
