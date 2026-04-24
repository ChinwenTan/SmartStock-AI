import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const CONFETTI = [
  { x: -90, y: -90, r: -14, c: '#A7F3D0' },
  { x: -30, y: -120, r: 22, c: '#FDE68A' },
  { x: 40, y: -110, r: -8, c: '#C7D2FE' },
  { x: 92, y: -78, r: 18, c: '#FCA5A5' },
  { x: -120, y: -40, r: 12, c: '#93C5FD' },
  { x: 120, y: -40, r: -18, c: '#86EFAC' },
  { x: -70, y: -20, r: 8, c: '#DDD6FE' },
  { x: 70, y: -20, r: -10, c: '#FBCFE8' },
  { x: -18, y: -86, r: 16, c: '#A5B4FC' },
  { x: 16, y: -88, r: -16, c: '#FDBA74' },
]

const STRATEGIES = [
  {
    id: 'shortcake-sale',
    title: 'Today’s Strategic Pivot',
    badge: '+RM150 Cost Recovered',
    action: 'Flash sale 24 Strawberry Shortcakes at RM5 to nearby WhatsApp groups immediately.',
    reasoning:
      'Storm rain reduces walk-ins. Students stay indoors and still crave something sweet — delivery converts better than waiting for foot traffic.',
    meta: { channel: 'WhatsApp', window: 'Next 2 hours', focus: 'Reduce waste' },
  },
  {
    id: 'bundle-cookie',
    title: 'Rainy-Day Bundle',
    badge: '+RM90 Margin Protected',
    action: 'Push “2 Cookies + Iced Coffee” bundle (RM12) on delivery platforms for the next 3 hours.',
    reasoning:
      'When it rains, customers prefer warm + convenient add-ons. Bundles increase average ticket even with lower volume.',
    meta: { channel: 'Delivery apps', window: 'Next 3 hours', focus: 'Increase AOV' },
  },
  {
    id: 'exam-prep',
    title: 'Exam Week Prep',
    badge: '+20% Demand Coverage',
    action: 'Increase Iced Coffee + energy drink stock by 20% and pre-bake cookie dough portions tonight.',
    reasoning:
      'Late-night study sessions spike caffeine and snack demand. Prep reduces out-of-stock incidents and improves repeat orders.',
    meta: { channel: 'Ops planning', window: 'This week', focus: 'Avoid stockouts' },
  },
  {
    id: 'cream-puff-push',
    title: 'Cream Puff Push',
    badge: '+RM110 Quick Wins',
    action:
      'Feature “Cream Puff 3-pack” (RM15) on the top of menu + offer free delivery above RM20 until 6pm.',
    reasoning:
      'Cream puffs convert well in bundles. A simple threshold promo nudges customers to add a drink and lifts basket size.',
    meta: { channel: 'Menu highlight', window: 'Until 6pm', focus: 'Lift basket size' },
  },
  {
    id: 'birthday-preorder',
    title: 'Birthday Cake Pre-orders',
    badge: '+RM200 New Sales',
    action:
      'Post “Weekend birthday cake slots (limited)” with a RM10 deposit to campus group chats + add a simple pre-order form link.',
    reasoning:
      'Pre-orders smooth production planning and lock in revenue early. Scarcity (“limited slots”) drives faster responses.',
    meta: { channel: 'Group chats', window: 'Weekend', focus: 'Pre-sell' },
  },
]

function Toast({ show, onClose, title = 'Success', message = 'Campaign executed.' }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => onClose?.(), 2400)
    return () => clearTimeout(t)
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute inset-x-0 bottom-24 z-50 px-6"
        >
          <div className="rounded-[28px] border border-emerald-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="mt-1 text-xs text-zinc-600">{message}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ConfirmModal({ open, onClose, onGoStock, onContinue }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/25"
          />
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-24 z-50 px-6"
          >
            <div className="rounded-[32px] border border-black/10 bg-white shadow-bento overflow-hidden">
              <div className="px-5 py-4 bg-zinc-50 border-b border-black/5">
                <p className="text-xs font-semibold tracking-wide text-zinc-500">Before you regenerate</p>
                <p className="mt-1 text-sm font-semibold tracking-tight text-zinc-900">
                  Is your inventory updated?
                </p>
              </div>
              <div className="p-5">
                <p className="text-sm text-zinc-700">
                  Strategy quality depends on what’s currently in stock and what’s at risk of expiring.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onGoStock}
                    className="rounded-[24px] bg-ink px-4 py-3 text-xs font-semibold text-white shadow-sm"
                  >
                    Go to Stock
                  </button>
                  <button
                    type="button"
                    onClick={onContinue}
                    className="rounded-[24px] bg-zinc-100 px-4 py-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-200"
                  >
                    Continue
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

export default function StrategyPage({ onNavigate }) {
  const [showToast, setShowToast] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [activeId, setActiveId] = useState(STRATEGIES[0].id)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [chatInput, setChatInput] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const active = STRATEGIES.find((s) => s.id === activeId) ?? STRATEGIES[0]

  const handleChat = async () => {
      if (!chatInput) return;
      setIsLoading(true);
      try {
          const res = await fetch('http://localhost:8000/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: chatInput }),
          });
          const data = await res.json();
          setChatResponse(data.reply || data.error);
      } catch (err) {
          setChatResponse("Failed to connect to backend.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleExecute = () => {
    setBurstKey((k) => k + 1)
    setShowToast(true)
  }

  const regenerate = () => {
    // Rotate strategies; if possible pick one different from current.
    const pool = STRATEGIES.filter((s) => s.id !== activeId)
    const next = pool.length ? pool[Math.floor(Math.random() * pool.length)] : STRATEGIES[0]
    setActiveId(next.id)
    setShowToast(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative p-6"
    >
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onGoStock={() => {
          setConfirmOpen(false)
          onNavigate?.('inventory')
        }}
        onContinue={() => {
          setConfirmOpen(false)
          regenerate()
        }}
      />

      {/* Toast */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Campaign launched"
        message="Sending the flash sale to nearby WhatsApp groups now."
      />

      {/* Header */}
      <div>
        <p className="text-sm font-semibold tracking-tight text-zinc-900">Strategy</p>
        <p className="mt-1 text-xs text-zinc-500">Bake Diary — a clear plan you can execute in 30 seconds.</p>
      </div>

      {/* Strategy picker (multiple strategies) */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {STRATEGIES.map((s) => {
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={
                'rounded-[22px] px-3 py-3 text-left shadow-sm ring-1 transition-colors ' +
                (isActive
                  ? 'bg-ink text-white ring-black/10'
                  : 'bg-white text-zinc-900 ring-black/5 hover:bg-zinc-50')
              }
            >
              <p className={'text-[11px] font-semibold tracking-wide ' + (isActive ? 'text-white/70' : 'text-zinc-500')}>
                Plan
              </p>
              <p className="mt-1 text-xs font-semibold leading-snug">{s.title}</p>
            </button>
          )
        })}
      </div>

      {/* Hero Bento Card (redesigned, less “AI gradient”) */}
      <div className="mt-4 rounded-[32px] bg-ink p-6 text-white shadow-bento ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/60">Recommendation</p>
            <p className="mt-2 font-display text-xl font-semibold tracking-tight">{active.title}</p>
          </div>

          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold tracking-wide text-white ring-1 ring-white/15">
            {active.badge}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-[28px] bg-white/6 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-wide text-white/60">Action</p>
            <p className="mt-2 text-sm font-semibold">{active.action}</p>
          </div>

          <div className="rounded-[28px] bg-white/6 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-wide text-white/60">Reasoning</p>
            <p className="mt-2 text-sm text-white/85">{active.reasoning}</p>
          </div>
        </div>
      </div>

      {/* Secondary Tip */}
      <div className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
        <p className="text-xs font-semibold tracking-wide text-zinc-600">Secondary Tip</p>
        <p className="mt-2 text-sm font-semibold tracking-tight text-zinc-900">
          Increase stock of Iced Coffee by 20% for upcoming Exam Week.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Late-night study sessions spike caffeine demand. Prep early to avoid missed add-on sales.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <div className="relative">
          <button
            type="button"
            onClick={handleExecute}
            className="w-full rounded-[32px] bg-ink px-6 py-5 text-base font-semibold text-white shadow-bento transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Execute Campaign
          </button>

          <AnimatePresence>
            {burstKey > 0 ? (
              <motion.div
                key={burstKey}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                {CONFETTI.map((p, idx) => (
                  <motion.span
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    initial={{ x: 0, y: 10, rotate: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      rotate: p.r,
                      opacity: 0,
                      scale: 0.9,
                    }}
                    transition={{ duration: 0.75, ease: 'easeOut', delay: idx * 0.01 }}
                    className="absolute h-2.5 w-2.5 rounded-sm"
                    style={{ background: p.c }}
                  />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="mt-3 w-full rounded-[28px] bg-white px-6 py-4 text-sm font-semibold text-ink shadow-bento ring-1 ring-black/5 hover:bg-zinc-50"
        >
          Generate again
        </button>
      </div>

      {/* AI */}
      <div className="mt-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-bento">
        <p className="text-xs font-semibold tracking-wide text-zinc-600">SyncBite Assistant</p>
        
        <div className="mt-3 flex flex-col gap-3">
          {chatResponse && (
            <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-800 border border-zinc-100">
              <strong>Z.AI:</strong> {chatResponse}
            </div>
          )}
          
          <div className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()} // Adds Enter key support
              placeholder="Ask about your stock..."
              className="w-full rounded-[24px] bg-zinc-100 px-5 py-4 text-sm text-zinc-900 outline-none ring-zinc-200 focus:ring-2"
            />
            <button
              onClick={handleChat}
              disabled={isLoading}
              className="absolute right-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition-opacity disabled:opacity-50"
            >
              {isLoading ? '...' : 'Ask'}
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  )
}
