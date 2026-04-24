import { useMemo, useState } from 'react'
import { Home, Lightbulb, School, ShoppingCart, User } from 'lucide-react'
import HomeDashboard from './HomeDashboard.jsx'
import InventoryPage from './InventoryPage.jsx'
import CampusPage from './CampusPage.jsx'
import StrategyPage from './StrategyPage.jsx'
import ProfilePage from './ProfilePage.jsx'

const TABS = [
  { id: 'home', label: 'Today', Icon: Home },
  { id: 'inventory', label: 'Stock', Icon: ShoppingCart },
  { id: 'campus', label: 'Calendar', Icon: School },
  { id: 'strategy', label: 'Strategy', Icon: Lightbulb },
  { id: 'profile', label: 'Profile', Icon: User },
]

function Page({ title }) {
  return (
    <div className="p-6">
      <div className="rounded-[32px] border border-zinc-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium tracking-tight text-zinc-900">{title}</p>
        <p className="mt-2 text-sm text-zinc-500">
          Placeholder content — switch tabs below to change views.
        </p>
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const navigate = (tab) => setActiveTab(tab)

  const activeLabel = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.label ?? 'Today',
    [activeTab],
  )

  return (
    <div className="min-h-screen px-4 py-10 font-sans">
      <div className="mx-auto h-[100dvh] w-full max-w-md rounded-[42px] bg-ink shadow-bento ring-1 ring-black/10 overflow-hidden relative flex flex-col">
        {/* Dark top bar */}
        <div className="px-6 pt-7 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl leading-none text-white">Bake Diary</p>
              <p className="mt-2 text-xs font-semibold tracking-wide text-white/60">
                {activeLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/10" />
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-cream rounded-t-[34px] pb-28">
          {activeTab === 'home' && <HomeDashboard onNavigate={navigate} />}
          {activeTab === 'inventory' && <InventoryPage onNavigate={navigate} />}
          {activeTab === 'campus' && <CampusPage onNavigate={navigate} />}
          {activeTab === 'strategy' && <StrategyPage onNavigate={navigate} />}
          {activeTab === 'profile' && <ProfilePage onNavigate={navigate} />}
        </main>

        {/* Bottom Nav (pill, inside container) */}
        <nav className="absolute inset-x-0 bottom-0 pb-5">
          <div className="mx-5 rounded-[28px] bg-white/90 backdrop-blur ring-1 ring-black/5 shadow-bento">
            <div className="grid grid-cols-5 p-2">
              {TABS.map(({ id, label, Icon }) => {
                const isActive = id === activeTab
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-colors"
                  >
                    <span
                      className={
                        'flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ' +
                        (isActive ? 'bg-ink text-white' : 'bg-transparent text-zinc-500 hover:bg-zinc-100')
                      }
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </span>
                    <span className={'text-[11px] font-semibold ' + (isActive ? 'text-ink' : 'text-zinc-500')}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default App
