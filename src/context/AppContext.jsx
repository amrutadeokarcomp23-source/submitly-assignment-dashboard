import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  getSession,
  getStoredTheme,
  loadData,
  resetData,
  saveData,
  setSession,
  setStoredTheme,
} from '../utils/storage'
import { makeId } from '../utils/helpers'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [currentUserId, setCurrentUserId] = useState(() => getSession())
  const [theme, setTheme] = useState(() => getStoredTheme())
  const [toast, setToast] = useState(null)
  const hydrated = useRef(false)

  // ---- initial load (mock API) ----
  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const loaded = await loadData()
      hydrated.current = true
      setData(loaded)
      setStatus('ready')
    } catch (e) {
      setError(e.message || 'Something went wrong while loading your data.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // ---- persist every change ----
  useEffect(() => {
    if (!hydrated.current || !data) return
    saveData(data).catch((e) => setToast({ type: 'error', message: e.message }))
  }, [data])

  // ---- theme ----
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    setStoredTheme(theme)
  }, [theme])

  // ---- toast auto-dismiss ----
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const currentUser = useMemo(
    () => data?.users.find((u) => u.id === currentUserId) ?? null,
    [data, currentUserId],
  )

  // A stale session id (e.g. data was reset) should not leave the app half-logged-in.
  useEffect(() => {
    if (status === 'ready' && currentUserId && !currentUser) {
      setCurrentUserId(null)
      setSession(null)
    }
  }, [status, currentUserId, currentUser])

  const notify = useCallback((message, type = 'success') => setToast({ message, type }), [])

  const login = useCallback((userId) => {
    setCurrentUserId(userId)
    setSession(userId)
  }, [])

  const logout = useCallback(() => {
    setCurrentUserId(null)
    setSession(null)
  }, [])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  // ---- admin actions (only ever touch the current admin's own assignments) ----
  const createAssignment = useCallback(
    (fields) => {
      if (currentUser?.role !== 'admin') return
      setData((d) => ({
        ...d,
        assignments: [...d.assignments, { ...fields, id: makeId(), createdBy: currentUser.id }],
      }))
      notify('Assignment created')
    },
    [currentUser, notify],
  )

  const updateAssignment = useCallback(
    (id, fields) => {
      if (currentUser?.role !== 'admin') return
      setData((d) => ({
        ...d,
        assignments: d.assignments.map((a) =>
          a.id === id && a.createdBy === currentUser.id ? { ...a, ...fields } : a,
        ),
      }))
      notify('Assignment updated')
    },
    [currentUser, notify],
  )

  const deleteAssignment = useCallback(
    (id) => {
      if (currentUser?.role !== 'admin') return
      setData((d) => {
        const target = d.assignments.find((a) => a.id === id)
        if (!target || target.createdBy !== currentUser.id) return d
        const { [id]: _removed, ...restSubmissions } = d.submissions
        return {
          ...d,
          assignments: d.assignments.filter((a) => a.id !== id),
          submissions: restSubmissions,
        }
      })
      notify('Assignment deleted')
    },
    [currentUser, notify],
  )

  // ---- student action ----
  const confirmSubmission = useCallback(
    (assignmentId) => {
      if (currentUser?.role !== 'student') return
      setData((d) => ({
        ...d,
        submissions: {
          ...d.submissions,
          [assignmentId]: {
            ...d.submissions[assignmentId],
            [currentUser.id]: { submittedAt: new Date().toISOString() },
          },
        },
      }))
      notify('Marked as submitted')
    },
    [currentUser, notify],
  )

  const resetDemo = useCallback(() => {
    resetData()
    setCurrentUserId(null)
    hydrated.current = false
    load()
  }, [load])

  const value = {
    status,
    error,
    retry: load,
    users: data?.users ?? [],
    assignments: data?.assignments ?? [],
    submissions: data?.submissions ?? {},
    currentUser,
    login,
    logout,
    theme,
    toggleTheme,
    toast,
    dismissToast: () => setToast(null),
    createAssignment,
    updateAssignment,
    deleteAssignment,
    confirmSubmission,
    resetDemo,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
