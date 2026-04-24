import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

function formatToday() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
  }).format(new Date())
}

const revenueData = [
  { label: 'W1', manual: 88, smart: 28 },
  { label: 'W2', manual: 79, smart: 38 },
  { label: 'W3', manual: 66, smart: 52 },
  { label: 'W4', manual: 54, smart: 64 },
  { label: 'W5', manual: 46, smart: 78 },
]

const footTrafficData = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 80 },
  { day: 'Wed', value: 76 },
  { day: 'Thu', value: 83 },
  { day: 'Today', value: 22, isToday: true },
]

function MinimalTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-2xl border border-black/5 bg-white/95 px-3 py-2 text-xs shadow-bento backdrop-blur">
      <div className="font-medium text-zinc-900">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="mt-1 flex items-center justify-between gap-4">
          <span className="text-zinc-500">{p.name}</span>
          <span className="font-semibold text-zinc-900">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const ALERTS = [
  {
    id: 'weather',
    title: '⛈️ Heavy Rain',
    subtitle: 'Walk-ins likely low today',
    detail:
      'Weather forecast indicates storm rain through late afternoon. Expect reduced foot traffic; delivery converts better. Recommend pushing warm cookies + drinks bundle via WhatsApp/Grab.',
    tone: 'indigo',
  },
  {
    id: 'risk',
    title: '⚠️ Expiry Risk',
    subtitle: '24 Strawberry Shortcakes (today)',
    detail:
      'Shortcakes have the highest spoilage risk today. Consider a 2-hour flash sale at RM5, and post to dorm / study group chats for quick conversion.',
    tone: 'rose',
  },
  {
    id: 'demand',
    title: '📈 Exam Week Soon',
    subtitle: 'Caffeine & snack demand up',
    detail:
      'Upcoming exam week usually increases late-night orders. Increase cold brew + energy drink stock by ~20% and prep extra cookie dough to reduce out-of-stock incidents.',
    tone: 'emerald',
  },
]

function AlertSheet({ alert, onClose }) {
  return (
    <AnimatePresence>
      {alert ? (
        <>
          {/* Background Overlay */}
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/25 backdrop-blur-sm"
          />
          
          {/* The Modal Popup */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            // CHANGED HERE: Moved from bottom-24 to top-48 so it appears immediately on screen
            className="absolute inset-x-0 top-48 z-50 px-6"
          >
            <div className="rounded-[32px] border border-black/10 bg-white shadow-2xl overflow-hidden">
              <div className="px-5 py-4 bg-zinc-50 border-b border-black/5">
                <p className="text-xs font-semibold tracking-wide text-zinc-500">Explanation</p>
                <p className="mt-1 text-sm font-semibold tracking-tight text-zinc-900">{alert.title}</p>
              </div>
              <div className="p-5">
                <p className="text-sm text-zinc-700 leading-relaxed">{alert.detail}</p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-[24px] bg-ink px-4 py-3.5 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default function HomeDashboard({ onNavigate }) {
  const [openAlert, setOpenAlert] = useState(null)
  const activeAlert = useMemo(() => ALERTS.find((a) => a.id === openAlert) ?? null, [openAlert])

  return (
    <div className="p-6 relative">
      <AlertSheet alert={activeAlert} onClose={() => setOpenAlert(null)} />

      {/* Greeting */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-900">Hello, Bake Diary</p>
          <p className="mt-1 text-xs font-medium text-zinc-500">{formatToday()}</p>
        </div>
        <div className="hidden sm:block rounded-2xl bg-zinc-100 px-3 py-2 text-[11px] font-semibold text-zinc-700">
          Live view
        </div>
      </div>

      {/* Dark snapshot (more “real app”) */}
      <div className="mt-5 rounded-[32px] bg-ink p-5 text-white shadow-bento">
        <p className="text-xs font-semibold tracking-wide text-white/60">Today’s Snapshot</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-[22px] bg-white/8 p-3 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold text-white/60">Orders</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">86</p>
            <p className="mt-1 text-[11px] text-emerald-200">+12%</p>
          </div>
          <div className="rounded-[22px] bg-white/8 p-3 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold text-white/60">Waste risk</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">High</p>
            <p className="mt-1 text-[11px] text-rose-200">Shortcakes</p>
          </div>
          <div className="rounded-[22px] bg-white/8 p-3 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold text-white/60">Avg ticket</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">RM 9.8</p>
            <p className="mt-1 text-[11px] text-sky-200">steady</p>
          </div>
        </div>
      </div>

      {/* Quick Alerts */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-zinc-600">Quick Alerts</p>
          <p className="text-xs text-zinc-400">Tap for details</p>
        </div>

        <div className="mt-3 space-y-3">
          {ALERTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setOpenAlert(a.id)}
              className="w-full rounded-[28px] border border-black/5 bg-white p-4 text-left shadow-bento transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-tight text-zinc-900">{a.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{a.subtitle}</p>
                </div>
                <span
                  className={
                    'mt-0.5 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ' +
                    (a.tone === 'rose'
                      ? 'bg-rose-50 text-rose-700 ring-rose-100'
                      : a.tone === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                        : 'bg-indigo-50 text-indigo-700 ring-indigo-100')
                  }
                >
                  View
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart A */}
      <div className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900">Revenue Trajectory</p>
            <p className="mt-1 text-xs text-zinc-500">Manual planning vs Smart forecast</p>
          </div>
        </div>

        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 10" vertical={false} stroke="#EEF0F6" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#71717A' }}
              />
              <YAxis hide />
              <Tooltip content={<MinimalTooltip />} />
              <Area
                type="monotone"
                dataKey="manual"
                name="Manual"
                stroke="#A1A1AA"
                fill="#A1A1AA"
                fillOpacity={0.08}
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="smart"
                name="Smart forecast"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.14}
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            <span className="font-medium text-zinc-600">Manual</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="font-medium text-indigo-700">Smart forecast</span>
          </div>
        </div>
      </div>

      {/* Chart B */}
      <div className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-900">Store Foot Traffic</p>
          <p className="mt-1 text-xs text-zinc-500">5-day trend (rain impact today)</p>
        </div>

        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={footTrafficData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 10" vertical={false} stroke="#EEF0F6" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#71717A' }}
              />
              <YAxis hide />
              <Tooltip content={<MinimalTooltip />} />
              <Bar
                dataKey="value"
                name="Foot Traffic"
                radius={[16, 16, 16, 16]}
              >
                {footTrafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isToday ? '#4F46E5' : '#A1A1AA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
          <p className="text-xs font-medium text-zinc-600">Today’s walk-ins</p>
          <p className="text-xs font-semibold text-indigo-700">Low (heavy rain)</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => onNavigate?.('strategy')}
          className="w-full rounded-[32px] bg-ink px-6 py-5 text-sm font-semibold text-white shadow-bento transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Generate Today&apos;s Strategy
        </button>
      </div>
    </div>
  )
}
