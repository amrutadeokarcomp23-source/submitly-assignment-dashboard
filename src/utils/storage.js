// A tiny mock API on top of localStorage.
// Every call is async and has a small artificial delay so loading states are real,
// and every call can fail so error states are real too.

import { buildSeedState } from '../data/seed'

const DATA_KEY = 'joineazy:data:v1'
const SESSION_KEY = 'joineazy:session:v1'
const THEME_KEY = 'joineazy:theme:v1'
const LATENCY = 350

const wait = (ms = LATENCY) => new Promise((resolve) => setTimeout(resolve, ms))

export async function loadData() {
  await wait()
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Corrupt JSON: fall through and re-seed rather than crashing the app.
  }
  const seeded = buildSeedState()
  localStorage.setItem(DATA_KEY, JSON.stringify(seeded))
  return seeded
}

export async function saveData(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  } catch {
    throw new Error('Could not save your changes. Storage may be full or disabled.')
  }
}

export function resetData() {
  localStorage.removeItem(DATA_KEY)
  localStorage.removeItem(SESSION_KEY)
}

export const getSession = () => {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export const setSession = (userId) => {
  try {
    if (userId) localStorage.setItem(SESSION_KEY, userId)
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export const getStoredTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved) return saved
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const setStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
}
