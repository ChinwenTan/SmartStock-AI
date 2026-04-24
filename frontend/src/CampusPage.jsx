import { Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

const CAMPUSES = [
  { value: 'sunway', label: 'Sunway University' },
  { value: 'monash', label: 'Monash University' },
  { value: 'taylor', label: "Taylor's University" },
  { value: 'inti', label: 'INTI International University' },
  { value: 'um', label: 'University of Malaya (UM)' },
  { value: 'ukm', label: 'Universiti Kebangsaan Malaysia (UKM)' },
  { value: 'upm', label: 'Universiti Putra Malaysia (UPM)' },
  { value: 'usm', label: 'Universiti Sains Malaysia (USM)' },
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const STATUS = {
  normal: { label: 'Normal', dot: 'bg-emerald-500' },
  exam: { label: 'Exam Week', dot: 'bg-amber-400' },
  crisis: { label: 'Crisis/Online Classes', dot: 'bg-rose-500' },
  holiday: { label: 'Holiday', dot: 'bg-sky-500' },
}

function FieldLabel({ children }) {
  return <label className="text-[11px] font-semibold tracking-wide text-zinc-600">{children}</label>
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={
        'w-full appearance-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 ' +
        'shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300'
      }
    >
      {children}
    </select>
  )
}

function monthLabel(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

function buildMonthGrid(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay() // 0..6
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function ymd(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildMockStatuses(monthDate, campusKey) {
  // Simple, lightweight demo statuses for the *current month*.
  // The keys must match the calendar's Y-M-D values.
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const mk = (day) => ymd(new Date(year, month, day))

  const base = {
    [mk(1)]: 'holiday',
    [mk(25)]: 'holiday',
    [mk(14)]: 'exam',
    [mk(15)]: 'exam',
    [mk(16)]: 'exam',
    [mk(17)]: 'exam',
    [mk(18)]: 'exam',
    [mk(7)]: 'normal',
    [mk(21)]: 'normal',
  }

  // Slightly different per campus (hardcoded)
  if (campusKey === 'sunway') {
    return { ...base, [mk(11)]: 'crisis', [mk(22)]: 'exam' }
  }
  if (campusKey === 'monash') {
    return { ...base, [mk(9)]: 'holiday', [mk(12)]: 'crisis', [mk(20)]: 'normal' }
  }
  if (campusKey === 'taylor') {
    return { ...base, [mk(6)]: 'crisis', [mk(13)]: 'normal', [mk(23)]: 'holiday' }
  }
  // default
  return { ...base, [mk(10)]: 'crisis' }
}

function Dot({ tone = 'normal' }) {
  const c = STATUS[tone]?.dot ?? STATUS.normal.dot
  return <span className={'h-2.5 w-2.5 rounded-full ' + c} />
}

function CalendarCard({ monthDate, monthCells, campusKey, campusLabel }) {
  const statusMap = useMemo(() => buildMockStatuses(monthDate, campusKey), [monthDate, campusKey])

  return (
    <div className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-900">{monthLabel(monthDate)}</p>
          <p className="mt-1 text-xs text-zinc-500">{campusLabel}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 px-3 py-2 text-[11px] font-semibold text-zinc-600">
          Calendar
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-zinc-500">
            {d}
          </div>
        ))}

        {monthCells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="aspect-square rounded-2xl bg-transparent" />
          }

          const key = ymd(cell)
          const tone = statusMap[key] ?? 'normal' // default to green “Normal” dot (no more grey)
          const isToday =
            cell.getFullYear() === monthDate.getFullYear() &&
            cell.getMonth() === monthDate.getMonth() &&
            cell.getDate() === monthDate.getDate()

          return (
            <div
              key={key}
              className={
                'aspect-square rounded-2xl border border-black/5 bg-zinc-50/40 p-2 ' +
                'flex flex-col items-center justify-between'
              }
            >
              <div className="flex w-full items-start justify-between">
                <span className="text-[12px] font-semibold text-zinc-900">{cell.getDate()}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                {isToday ? (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">
                    Today
                  </span>
                ) : (
                  <span />
                )}
                <Dot tone={tone} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CampusPage() {
  const [campusQuery, setCampusQuery] = useState('')
  const [allCampuses, setAllCampuses] = useState(CAMPUSES)
  const [selectedCampuses, setSelectedCampuses] = useState([CAMPUSES[0].value])
  const [newCampusName, setNewCampusName] = useState('')
  const [showPicker, setShowPicker] = useState(true)
  const today = useMemo(() => new Date(), [])
  const monthCells = useMemo(() => buildMonthGrid(today), [today])

  const filteredCampuses = useMemo(() => {
    const q = campusQuery.trim().toLowerCase()
    if (!q) return allCampuses
    return allCampuses.filter((c) => c.label.toLowerCase().includes(q))
  }, [allCampuses, campusQuery])

  const addSelected = (value) => {
    setSelectedCampuses((prev) => (prev.includes(value) ? prev : [...prev, value]))
    setShowPicker(false)
  }

  const removeSelected = (value) => {
    setSelectedCampuses((prev) => {
      const next = prev.filter((v) => v !== value)
      return next.length ? next : prev
    })
  }

  const addCampus = () => {
    const name = newCampusName.trim()
    if (!name) return
    const value = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const entry = { value, label: name }
    setAllCampuses((prev) => [entry, ...prev])
    setSelectedCampuses((prev) => (prev.includes(value) ? prev : [value, ...prev]))
    setNewCampusName('')
    setCampusQuery('')
    setShowPicker(false)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold tracking-tight text-zinc-900">Campus Intelligence</p>
        <p className="mt-1 text-xs text-zinc-500">
          Track campus conditions to forecast demand and adjust promos in real time.
        </p>
      </div>

      {/* Selector */}
      <div className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
        <div className="flex items-center justify-between">
          <FieldLabel>Universities</FieldLabel>
          <button
            type="button"
            onClick={() => setShowPicker((s) => !s)}
            className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200"
          >
            {showPicker ? 'Hide' : 'Search / Add'}
          </button>
        </div>

        {/* Selected universities */}
        <div className="mt-3">
          <p className="text-[11px] font-semibold tracking-wide text-zinc-500">Selected</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedCampuses.map((id) => {
              const label = allCampuses.find((c) => c.value === id)?.label ?? id
              const removable = selectedCampuses.length > 1
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800 ring-1 ring-black/5"
                >
                  {label}
                  {removable ? (
                    <button
                      type="button"
                      onClick={() => removeSelected(id)}
                      className="rounded-full bg-white px-1.5 py-1 ring-1 ring-black/5 hover:bg-zinc-50"
                      aria-label="Remove"
                    >
                      <X size={12} className="text-zinc-600" />
                    </button>
                  ) : null}
                </span>
              )
            })}

            {/* + symbol to add another university */}
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white shadow-sm"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* Picker list (scroll/search + add buttons) */}
        {showPicker ? (
          <div className="mt-4">
            <div>
              <input
                value={campusQuery}
                onChange={(e) => setCampusQuery(e.target.value)}
                placeholder="Search a university..."
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
              />
            </div>

            <div className="mt-3 max-h-44 overflow-auto rounded-[24px] border border-black/5 bg-zinc-50/50 p-2">
              <div className="space-y-1">
                {filteredCampuses.map((c) => {
                  const already = selectedCampuses.includes(c.value)
                  return (
                    <div
                      key={c.value}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-black/5"
                    >
                      <span className="text-sm font-semibold text-zinc-800">{c.label}</span>
                      <button
                        type="button"
                        onClick={() => addSelected(c.value)}
                        className={
                          'rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ' +
                          (already
                            ? 'bg-zinc-100 text-zinc-500 ring-black/5 cursor-default'
                            : 'bg-ink text-white ring-black/10 hover:bg-black')
                        }
                        disabled={already}
                      >
                        {already ? 'Added' : 'Add'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <FieldLabel>Add another university</FieldLabel>
              <div className="flex gap-2">
                <input
                  value={newCampusName}
                  onChange={(e) => setNewCampusName(e.target.value)}
                  placeholder="Type a new university name"
                  className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
                <button
                  type="button"
                  onClick={addCampus}
                  className="shrink-0 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Calendars (render one per selected university; if 2 selected, show 2 calendars with different data) */}
      {selectedCampuses.map((campusKey) => {
        const campusLabel = allCampuses.find((c) => c.value === campusKey)?.label ?? campusKey
        return (
          <CalendarCard
            key={campusKey}
            monthDate={today}
            monthCells={monthCells}
            campusKey={campusKey}
            campusLabel={campusLabel}
          />
        )
      })}

      {/* Legend */}
      <div className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
        <p className="text-xs font-semibold tracking-wide text-zinc-600">Legend</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-3">
            <Dot tone="normal" />
            <span className="text-xs font-medium text-zinc-700">{STATUS.normal.label}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-3">
            <Dot tone="exam" />
            <span className="text-xs font-medium text-zinc-700">{STATUS.exam.label}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-3">
            <Dot tone="crisis" />
            <span className="text-xs font-medium text-zinc-700">{STATUS.crisis.label}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-3">
            <Dot tone="holiday" />
            <span className="text-xs font-medium text-zinc-700">{STATUS.holiday.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
