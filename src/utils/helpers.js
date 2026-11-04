// Pure helper functions. Kept free of React so they are easy to test.

export const startOfToday = (now = new Date()) => {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d
}

// Parses a yyyy-mm-dd string as a local date (new Date('2026-11-05') would be UTC).
export const parseDueDate = (value) => {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDate = (value) =>
  parseDueDate(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export const daysUntil = (dueDate, now = new Date()) =>
  Math.round((parseDueDate(dueDate) - startOfToday(now)) / (24 * 60 * 60 * 1000))

export const isOverdue = (dueDate, submitted, now = new Date()) => !submitted && daysUntil(dueDate, now) < 0

export const dueLabel = (dueDate, now = new Date()) => {
  const n = daysUntil(dueDate, now)
  if (n === 0) return 'Due today'
  if (n === 1) return 'Due tomorrow'
  if (n > 1) return `Due in ${n} days`
  if (n === -1) return '1 day overdue'
  return `${Math.abs(n)} days overdue`
}

export const getAssignedStudentIds = (assignment, users) =>
  assignment.assignedTo === 'all'
    ? users.filter((u) => u.role === 'student').map((u) => u.id)
    : assignment.assignedTo

export const isAssignedTo = (assignment, studentId) =>
  assignment.assignedTo === 'all' || assignment.assignedTo.includes(studentId)

export const hasSubmitted = (submissions, assignmentId, studentId) =>
  Boolean(submissions[assignmentId]?.[studentId])

export const completion = (assignment, users, submissions) => {
  const ids = getAssignedStudentIds(assignment, users)
  const done = ids.filter((id) => hasSubmitted(submissions, assignment.id, id)).length
  const percent = ids.length === 0 ? 0 : Math.round((done / ids.length) * 100)
  return { done, total: ids.length, percent }
}

export const isValidUrl = (value) => {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const makeId = () => `as${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export const sortAssignments = (list, sortBy) => {
  const copy = [...list]
  if (sortBy === 'title') return copy.sort((a, b) => a.title.localeCompare(b.title))
  if (sortBy === 'due-desc') return copy.sort((a, b) => b.dueDate.localeCompare(a.dueDate))
  return copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}
