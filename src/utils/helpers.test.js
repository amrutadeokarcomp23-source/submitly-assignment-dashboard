import { describe, it, expect } from 'vitest'
import {
  completion,
  daysUntil,
  dueLabel,
  getAssignedStudentIds,
  isAssignedTo,
  isOverdue,
  isValidUrl,
  sortAssignments,
} from './helpers'

const users = [
  { id: 'a1', role: 'admin' },
  { id: 's1', role: 'student' },
  { id: 's2', role: 'student' },
  { id: 's3', role: 'student' },
  { id: 's4', role: 'student' },
]

const now = new Date(2026, 10, 5, 15, 30) // 5 Nov 2026, mid-afternoon

describe('dates', () => {
  it('counts whole days regardless of time of day', () => {
    expect(daysUntil('2026-11-05', now)).toBe(0)
    expect(daysUntil('2026-11-08', now)).toBe(3)
    expect(daysUntil('2026-11-04', now)).toBe(-1)
  })

  it('only flags unsubmitted past-due work as overdue', () => {
    expect(isOverdue('2026-11-01', false, now)).toBe(true)
    expect(isOverdue('2026-11-01', true, now)).toBe(false)
    expect(isOverdue('2026-11-05', false, now)).toBe(false)
  })

  it('produces friendly labels', () => {
    expect(dueLabel('2026-11-05', now)).toBe('Due today')
    expect(dueLabel('2026-11-06', now)).toBe('Due tomorrow')
    expect(dueLabel('2026-11-04', now)).toBe('1 day overdue')
    expect(dueLabel('2026-11-01', now)).toBe('4 days overdue')
  })
})

describe('assignment targeting', () => {
  it('resolves "all" to every student and nobody else', () => {
    expect(getAssignedStudentIds({ assignedTo: 'all' }, users)).toEqual(['s1', 's2', 's3', 's4'])
  })

  it('checks whether a student is assigned', () => {
    expect(isAssignedTo({ assignedTo: 'all' }, 's2')).toBe(true)
    expect(isAssignedTo({ assignedTo: ['s1'] }, 's2')).toBe(false)
  })
})

describe('completion', () => {
  it('computes done, total and percent for the assigned students', () => {
    const assignment = { id: 'x', assignedTo: ['s1', 's2', 's3'] }
    const submissions = { x: { s1: { submittedAt: 'now' }, s3: { submittedAt: 'now' } } }
    expect(completion(assignment, users, submissions)).toEqual({ done: 2, total: 3, percent: 67 })
  })

  it('handles an assignment with no one assigned', () => {
    expect(completion({ id: 'y', assignedTo: [] }, users, {})).toEqual({ done: 0, total: 0, percent: 0 })
  })
})

describe('misc', () => {
  it('validates URLs', () => {
    expect(isValidUrl('https://drive.google.com/x')).toBe(true)
    expect(isValidUrl('not a url')).toBe(false)
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
  })

  it('sorts by due date and title', () => {
    const list = [
      { title: 'B', dueDate: '2026-11-10' },
      { title: 'A', dueDate: '2026-11-20' },
    ]
    expect(sortAssignments(list, 'due-asc').map((a) => a.title)).toEqual(['B', 'A'])
    expect(sortAssignments(list, 'due-desc').map((a) => a.title)).toEqual(['A', 'B'])
    expect(sortAssignments(list, 'title').map((a) => a.title)).toEqual(['A', 'B'])
  })
})
