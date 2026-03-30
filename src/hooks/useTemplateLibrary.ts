import { useCallback, useEffect, useState } from "react"
import {
  cloneDefaultTemplateSections,
  type TemplateSectionDef,
  type TemplateTaskDef,
} from "../data/taskTemplates"

const STORAGE_PREFIX = "taskTemplateLibrary:v2:"
const LEGACY_STORAGE_PREFIX = "taskTemplateLibrary:v1:"

function storageKey(uid: string) {
  return `${STORAGE_PREFIX}${uid}`
}

function legacyStorageKey(uid: string) {
  return `${LEGACY_STORAGE_PREFIX}${uid}`
}

export type TrashEntry =
  | {
      id: string
      kind: "section"
      deletedAt: number
      section: TemplateSectionDef
    }
  | {
      id: string
      kind: "task"
      deletedAt: number
      sectionId: string
      sectionTitle: string
      task: TemplateTaskDef
    }

type LibraryState = {
  sections: TemplateSectionDef[]
  trash: TrashEntry[]
}

type StoredV2 = {
  version: 2
  sections: unknown
  trash: unknown
}

function isValidTask(t: unknown): t is TemplateTaskDef {
  if (!t || typeof t !== "object") return false
  const o = t as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    Array.isArray(o.subtasks) &&
    o.subtasks.every((s) => typeof s === "string")
  )
}

function isValidSection(s: unknown): s is TemplateSectionDef {
  if (!s || typeof s !== "object") return false
  const o = s as Record<string, unknown>
  if (typeof o.id !== "string" || typeof o.title !== "string") return false
  if (!Array.isArray(o.tasks)) return false
  return o.tasks.every(isValidTask)
}

function isValidTrashEntry(x: unknown): x is TrashEntry {
  if (!x || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  if (typeof o.id !== "string" || typeof o.deletedAt !== "number") return false
  if (o.kind === "section") {
    return isValidSection(o.section)
  }
  if (o.kind === "task") {
    return (
      typeof o.sectionId === "string" &&
      typeof o.sectionTitle === "string" &&
      isValidTask(o.task)
    )
  }
  return false
}

function parseStored(raw: string | null): LibraryState {
  const fallback: LibraryState = {
    sections: cloneDefaultTemplateSections(),
    trash: [],
  }
  if (!raw) return fallback
  try {
    const data = JSON.parse(raw) as unknown
    if (Array.isArray(data) && data.length > 0 && data.every(isValidSection)) {
      return { sections: data, trash: [] }
    }
    const v2 = data as StoredV2
    if (
      v2 &&
      v2.version === 2 &&
      Array.isArray(v2.sections) &&
      v2.sections.every(isValidSection) &&
      Array.isArray(v2.trash) &&
      v2.trash.every(isValidTrashEntry)
    ) {
      return { sections: v2.sections, trash: v2.trash }
    }
  } catch {
    /* ignore */
  }
  return fallback
}

export function useTemplateLibrary(uid: string | undefined) {
  const [state, setState] = useState<LibraryState>({
    sections: [],
    trash: [],
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!uid) {
      setState({ sections: [], trash: [] })
      setReady(false)
      return
    }
    try {
      const raw =
        localStorage.getItem(storageKey(uid)) ??
        localStorage.getItem(legacyStorageKey(uid))
      const parsed = parseStored(raw)
      setState(parsed)
    } catch {
      setState({
        sections: cloneDefaultTemplateSections(),
        trash: [],
      })
    }
    setReady(true)
  }, [uid])

  useEffect(() => {
    if (!uid || !ready) return
    try {
      const payload: StoredV2 = {
        version: 2,
        sections: state.sections,
        trash: state.trash,
      }
      localStorage.setItem(storageKey(uid), JSON.stringify(payload))
    } catch {
      /* quota */
    }
  }, [uid, state, ready])

  const addSection = useCallback((title: string) => {
    const t = title.trim()
    if (!t) return
    setState((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { id: crypto.randomUUID(), title: t, tasks: [] },
      ],
    }))
  }, [])

  const renameSection = useCallback((sectionId: string, title: string) => {
    const t = title.trim()
    if (!t) return
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, title: t } : s
      ),
    }))
  }, [])

  const deleteSection = useCallback((sectionId: string) => {
    setState((prev) => {
      const section = prev.sections.find((s) => s.id === sectionId)
      if (!section) return prev
      const entry: TrashEntry = {
        id: crypto.randomUUID(),
        kind: "section",
        deletedAt: Date.now(),
        section: JSON.parse(JSON.stringify(section)) as TemplateSectionDef,
      }
      return {
        sections: prev.sections.filter((s) => s.id !== sectionId),
        trash: [entry, ...prev.trash],
      }
    })
  }, [])

  const addTask = useCallback(
    (sectionId: string, task: { title: string; subtasks: string[] }) => {
      const title = task.title.trim()
      if (!title) return
      const subtasks = task.subtasks.map((x) => x.trim()).filter(Boolean)
      const nextTask: TemplateTaskDef = {
        id: crypto.randomUUID(),
        title,
        subtasks,
      }
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, tasks: [...s.tasks, nextTask] } : s
        ),
      }))
    },
    []
  )

  const updateTask = useCallback(
    (
      sectionId: string,
      taskId: string,
      task: { title: string; subtasks: string[] }
    ) => {
      const title = task.title.trim()
      if (!title) return
      const subtasks = task.subtasks.map((x) => x.trim()).filter(Boolean)
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id !== sectionId) return s
          return {
            ...s,
            tasks: s.tasks.map((t) =>
              t.id === taskId ? { ...t, title, subtasks } : t
            ),
          }
        }),
      }))
    },
    []
  )

  const deleteTask = useCallback((sectionId: string, taskId: string) => {
    setState((prev) => {
      const section = prev.sections.find((s) => s.id === sectionId)
      const task = section?.tasks.find((t) => t.id === taskId)
      if (!section || !task) return prev
      const entry: TrashEntry = {
        id: crypto.randomUUID(),
        kind: "task",
        deletedAt: Date.now(),
        sectionId,
        sectionTitle: section.title,
        task: JSON.parse(JSON.stringify(task)) as TemplateTaskDef,
      }
      return {
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }
            : s
        ),
        trash: [entry, ...prev.trash],
      }
    })
  }, [])

  const restoreTrashEntry = useCallback((trashItemId: string) => {
    setState((prev) => {
      const idx = prev.trash.findIndex((t) => t.id === trashItemId)
      if (idx === -1) return prev
      const entry = prev.trash[idx]
      const restTrash = prev.trash.filter((t) => t.id !== trashItemId)

      if (entry.kind === "section") {
        if (prev.sections.some((s) => s.id === entry.section.id)) {
          const sec: TemplateSectionDef = {
            ...entry.section,
            id: crypto.randomUUID(),
          }
          return { sections: [...prev.sections, sec], trash: restTrash }
        }
        return {
          sections: [...prev.sections, entry.section],
          trash: restTrash,
        }
      }

      const { sectionId, sectionTitle, task } = entry
      const target = prev.sections.find((s) => s.id === sectionId)
      if (target) {
        if (target.tasks.some((t) => t.id === task.id)) {
          const newTask = { ...task, id: crypto.randomUUID() }
          return {
            sections: prev.sections.map((s) =>
              s.id === sectionId
                ? { ...s, tasks: [...s.tasks, newTask] }
                : s
            ),
            trash: restTrash,
          }
        }
        return {
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, tasks: [...s.tasks, task] } : s
          ),
          trash: restTrash,
        }
      }

      const newSection: TemplateSectionDef = {
        id: crypto.randomUUID(),
        title: sectionTitle.trim() || "Restored",
        tasks: [task],
      }
      return {
        sections: [...prev.sections, newSection],
        trash: restTrash,
      }
    })
  }, [])

  const purgeTrashEntry = useCallback((trashItemId: string) => {
    setState((prev) => ({
      ...prev,
      trash: prev.trash.filter((t) => t.id !== trashItemId),
    }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setState({
      sections: cloneDefaultTemplateSections(),
      trash: [],
    })
  }, [])

  return {
    sections: state.sections,
    trash: state.trash,
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
  }
}
