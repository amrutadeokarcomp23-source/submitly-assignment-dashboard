// Search + status filter + sort. Fully controlled by the parent via `value`/`onChange`.
export default function FilterBar({ value, onChange, statusOptions }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div>
        <label htmlFor="search" className="label">
          Search
        </label>
        <input
          id="search"
          type="search"
          className="input"
          placeholder="Title or description"
          value={value.query}
          onChange={(e) => set({ query: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="status-filter" className="label">
          Status
        </label>
        <select id="status-filter" className="input" value={value.status} onChange={(e) => set({ status: e.target.value })}>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sort" className="label">
          Sort by
        </label>
        <select id="sort" className="input" value={value.sort} onChange={(e) => set({ sort: e.target.value })}>
          <option value="due-asc">Due date (earliest first)</option>
          <option value="due-desc">Due date (latest first)</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>
    </div>
  )
}
