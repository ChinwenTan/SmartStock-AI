import { CakeSlice, Coffee, Cookie, Package, Plus, RefreshCw } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

const EXPIRY_OPTIONS = [
  { value: 'expires-today', label: 'Expires Today' },
  { value: '1-2-days', label: '1–2 Days Left' },
  { value: '3-5-days', label: '3–5 Days Left' },
  { value: 'safe', label: 'Safe (7+ Days)' },
]

const INITIAL_ITEMS = [
  {
    id: 'shortcake',
    name: 'Strawberry Shortcake',
    quantity: 24,
    note: 'Suggested action: flash sale + delivery',
    status: 'high',
    badgeTone: 'red',
    badgeText: 'High Risk - Expires Today',
    expiryText: 'Today',
    sellingPrice: 5,
    icon: CakeSlice,
  },
  {
    id: 'matcha',
    name: 'Matcha Cake Slice',
    quantity: 18,
    note: 'Move with “coffee + cake” bundle',
    status: 'medium',
    badgeTone: 'red',
    badgeText: 'Medium Risk - 1–2 Days',
    expiryText: '1–2 days',
    sellingPrice: 9.5,
    icon: CakeSlice,
  },
  {
    id: 'creampuff',
    name: 'Cream Puffs',
    quantity: 36,
    note: 'Best seller — keep visible in-store',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '3+ days',
    sellingPrice: 6.5,
    icon: Cookie,
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu Cup',
    quantity: 20,
    note: 'Strong evening demand',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '3+ days',
    sellingPrice: 10.9,
    icon: CakeSlice,
  },
  {
    id: 'coldbrew',
    name: 'Canned Cold Brews',
    quantity: 100,
    note: 'Healthy buffer for rainy-day demand',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '7+ days',
    sellingPrice: 7.9,
    icon: Coffee,
  },
  {
    id: 'brownie',
    name: 'Fudge Brownies',
    quantity: 28,
    note: 'Great add-on for delivery orders',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '5+ days',
    sellingPrice: 6.0,
    icon: Cookie,
  },
  {
    id: 'cookie-chocchip',
    name: 'Chocolate Chip Cookies',
    quantity: 64,
    note: 'Bundle with iced coffee for rainy days',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '7+ days',
    sellingPrice: 4.5,
    icon: Cookie,
  },
  {
    id: 'cookie-matcha',
    name: 'Matcha White-Choc Cookies',
    quantity: 42,
    note: 'Trending — highlight on menu',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '7+ days',
    sellingPrice: 5.0,
    icon: Cookie,
  },
  {
    id: 'cheesecake',
    name: 'Burnt Cheesecake Slice',
    quantity: 16,
    note: 'Premium item — protect margin',
    status: 'medium',
    badgeTone: 'red',
    badgeText: 'Medium Risk - 1–2 Days',
    expiryText: '1–2 days',
    sellingPrice: 10.9,
    icon: CakeSlice,
  },
  {
    id: 'lemon-tart',
    name: 'Lemon Tart',
    quantity: 14,
    note: 'Promote as “refreshing” pairing',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '3–5 days',
    sellingPrice: 8.5,
    icon: CakeSlice,
  },
  {
    id: 'croissant',
    name: 'Butter Croissants',
    quantity: 22,
    note: 'Morning push (9–11am)',
    status: 'medium',
    badgeTone: 'red',
    badgeText: 'Medium Risk - 1–2 Days',
    expiryText: '1–2 days',
    sellingPrice: 6.9,
    icon: Package,
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte (Bottled)',
    quantity: 48,
    note: 'Exam week staple — upsell with cookies',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '7+ days',
    sellingPrice: 8.9,
    icon: Coffee,
  },
  {
    id: 'matcha-latte',
    name: 'Iced Matcha Latte (Bottled)',
    quantity: 34,
    note: 'High repeat buyers',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '7+ days',
    sellingPrice: 9.9,
    icon: Coffee,
  },
  {
    id: 'sparkling-lemonade',
    name: 'Sparkling Lemonade',
    quantity: 30,
    note: 'Afternoon refresh — bundle with tart',
    status: 'safe',
    badgeTone: 'green',
    badgeText: 'Safe',
    expiryText: '7+ days',
    sellingPrice: 7.5,
    icon: Coffee,
  },
]

function FieldLabel({ children }) {
  return <label className="text-[11px] font-semibold tracking-wide text-zinc-600">{children}</label>
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 ' +
        'placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300'
      }
    />
  )
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

function Badge({ tone = 'neutral', children }) {
  const cls = useMemo(() => {
    if (tone === 'red') return 'bg-red-50 text-red-700 ring-red-100'
    if (tone === 'green') return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
    return 'bg-zinc-50 text-zinc-700 ring-zinc-100'
  }, [tone])

  return (
    <span className={'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ' + cls}>
      {children}
    </span>
  )
}

function StatusBadge({ status }) {
  if (status === 'high') return <Badge tone="red">High Risk</Badge>
  if (status === 'medium') return <Badge tone="red">Medium Risk</Badge>
  if (status === 'safe') return <Badge tone="green">Safe</Badge>
  return <Badge>Normal</Badge>
}

function Toast({ show, onClose, title, message }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-x-0 bottom-24 z-50 px-6"
        >
          <div className="rounded-[28px] border border-black/10 bg-white/95 p-4 shadow-bento backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="mt-1 text-xs text-zinc-600">{message}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200"
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

export default function InventoryPage() {
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [expiryStatus, setExpiryStatus] = useState(EXPIRY_OPTIONS[0].value)
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Hackathon placeholder: we’ll wire real state + persistence later
  const handleAddItem = (e) => {
    e.preventDefault()
    const cleanName = itemName.trim()
    if (!cleanName) return

    const qty = Number(quantity || 0)
    const tone = expiryStatus === 'safe' ? 'green' : expiryStatus === 'expires-today' ? 'red' : 'neutral'
    const status =
      expiryStatus === 'expires-today'
        ? 'high'
        : expiryStatus === '1-2-days'
          ? 'medium'
          : expiryStatus === 'safe'
            ? 'safe'
            : 'normal'

    const badgeText =
      expiryStatus === 'expires-today'
        ? 'High Risk - Expires Today'
        : expiryStatus === '1-2-days'
          ? 'Medium Risk - 1–2 Days'
          : expiryStatus === '3-5-days'
            ? 'Low Risk - 3–5 Days'
            : 'Safe'

    const expiryText =
      expiryStatus === 'expires-today'
        ? 'Today'
        : expiryStatus === '1-2-days'
          ? '1–2 days'
          : expiryStatus === '3-5-days'
            ? '3–5 days'
            : '7+ days'

    const price = Number(sellingPrice || 0)

    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: cleanName,
        quantity: Number.isFinite(qty) ? qty : 0,
        note: `Cost RM${costPrice || '—'} • Sell RM${sellingPrice || '—'}`,
        status,
        badgeTone: tone,
        badgeText,
        expiryText,
        sellingPrice: Number.isFinite(price) ? price : 0,
        icon: Package,
      },
    ])

    setItemName('')
    setQuantity('')
    setCostPrice('')
    setSellingPrice('')
    setExpiryStatus(EXPIRY_OPTIONS[0].value)
  }

  const handleSync = async () => {
    if (isSyncing) return
    setIsSyncing(true)
    setShowToast(false)
    await new Promise((r) => setTimeout(r, 1200))
    setIsSyncing(false)
    setShowToast(true)
  }

  return (
    <div className="p-6 relative">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Synced"
        message="Inventory synced with Z.AI Brain."
      />

      {/* Header */}
      <div>
        <p className="text-sm font-semibold tracking-tight text-zinc-900">Manage At-Risk Inventory</p>
        <p className="mt-1 text-xs text-zinc-500">
          Bake Diary stock view — catch expiring items before they become waste.
        </p>
      </div>

      {/* Input Form (Bento Style) */}
      <form
        onSubmit={handleAddItem}
        className="mt-5 rounded-[32px] border border-black/5 bg-white p-5 shadow-bento"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FieldLabel>Item Name</FieldLabel>
            <div className="mt-2">
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Strawberry Shortcake"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Quantity</FieldLabel>
              <div className="mt-2">
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputMode="numeric"
                  placeholder="e.g., 40"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Expiry Status</FieldLabel>
              <div className="mt-2">
                <Select value={expiryStatus} onChange={(e) => setExpiryStatus(e.target.value)}>
                  {EXPIRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Cost Price (RM)</FieldLabel>
              <div className="mt-2">
                <Input
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g., 4.00"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Selling Price (RM)</FieldLabel>
              <div className="mt-2">
                <Input
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g., 9.50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="w-full rounded-[32px] bg-ink px-6 py-5 text-sm font-semibold text-white shadow-bento transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Plus size={18} />
              Add Item
            </span>
          </button>
        </div>
      </form>

      {/* Sync button (uses same data model as your example; styled to match our UI) */}
      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        className="mt-4 w-full rounded-[32px] bg-indigo-600 px-6 py-5 text-sm font-semibold text-white shadow-bento transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing with Z.AI Brain...' : 'Sync with Z.AI Brain'}
        </span>
      </button>

      {/* Current Stock List */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-zinc-600">Current Stock</p>
          <p className="text-xs text-zinc-400">Hardcoded + added items</p>
        </div>

        <div className="mt-3 space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {items.map((it) => (
            <div key={it.id} className="rounded-[28px] border border-black/5 bg-white p-4 shadow-bento">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-black/5">
                    {it.icon ? <it.icon size={22} className="text-indigo-600" /> : <Package size={22} className="text-indigo-600" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight text-zinc-900 truncate">
                      {it.quantity} {it.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Qty: {it.quantity} | RM{it.sellingPrice ?? '—'}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={it.status} />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-500">{it.badgeText}</p>
                  <p className="mt-1 text-xs text-zinc-400">{it.expiryText ?? ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
