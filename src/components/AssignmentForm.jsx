import { useState } from 'react'
import Modal from './Modal'
import { isValidUrl } from '../utils/helpers'

// Create / edit form shown in a modal. `initial` is null when creating.
export default function AssignmentForm({ initial, students, onSubmit, onCancel }) {
  const editing = Boolean(initial)
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    dueDate: initial?.dueDate ?? '',
    driveLink: initial?.driveLink ?? '',
    audience: initial ? (initial.assignedTo === 'all' ? 'all' : 'selected') : 'all',
    selected: initial && initial.assignedTo !== 'all' ? initial.assignedTo : [],
  })
  const [errors, setErrors] = useState({})

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const toggleStudent = (id) =>
    set({ selected: form.selected.includes(id) ? form.selected.filter((s) => s !== id) : [...form.selected, id] })

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (!form.dueDate) e.dueDate = 'Pick a due date.'
    if (!form.driveLink.trim()) e.driveLink = 'Drive link is required.'
    else if (!isValidUrl(form.driveLink.trim())) e.driveLink = 'Enter a valid http(s) link.'
    if (form.audience === 'selected' && form.selected.length === 0) e.selected = 'Select at least one student.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      driveLink: form.driveLink.trim(),
      assignedTo: form.audience === 'all' ? 'all' : form.selected,
    })
  }

  const err = (field) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1 text-xs text-rose-600 dark:text-rose-400" role="alert">
        {errors[field]}
      </p>
    ) : null

  const invalid = (field) => (errors[field] ? { 'aria-invalid': true, 'aria-describedby': `${field}-error` } : {})

  return (
    <Modal title={editing ? 'Edit assignment' : 'Create assignment'} onClose={onCancel} size="lg">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="f-title" className="label">
            Title
          </label>
          <input id="f-title" data-autofocus className="input" value={form.title} onChange={(e) => set({ title: e.target.value })} {...invalid('title')} />
          {err('title')}
        </div>

        <div>
          <label htmlFor="f-desc" className="label">
            Description
          </label>
          <textarea id="f-desc" rows={3} className="input" value={form.description} onChange={(e) => set({ description: e.target.value })} {...invalid('description')} />
          {err('description')}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="f-due" className="label">
              Due date
            </label>
            <input id="f-due" type="date" className="input" value={form.dueDate} onChange={(e) => set({ dueDate: e.target.value })} {...invalid('dueDate')} />
            {err('dueDate')}
          </div>
          <div>
            <label htmlFor="f-link" className="label">
              Drive link (external submission)
            </label>
            <input id="f-link" type="url" placeholder="https://drive.google.com/…" className="input" value={form.driveLink} onChange={(e) => set({ driveLink: e.target.value })} {...invalid('driveLink')} />
            {err('driveLink')}
          </div>
        </div>

        <fieldset>
          <legend className="label">Assign to</legend>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="audience" checked={form.audience === 'all'} onChange={() => set({ audience: 'all' })} />
              All students
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="audience" checked={form.audience === 'selected'} onChange={() => set({ audience: 'selected' })} />
              Selected students
            </label>
          </div>

          {form.audience === 'selected' && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {students.map((s) => (
                <label key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                  <input type="checkbox" checked={form.selected.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                  {s.name}
                </label>
              ))}
            </div>
          )}
          {err('selected')}
        </fieldset>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editing ? 'Save changes' : 'Create assignment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
