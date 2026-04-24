import { ChevronRight, Store, Bell, User, Shield, HelpCircle, LogOut } from 'lucide-react'

function Row({ icon: Icon, label, value }) {
  return (
    <button
      type="button"
      className="w-full rounded-[24px] border border-black/5 bg-white px-4 py-4 shadow-bento transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-black/5">
            <Icon size={18} className="text-zinc-700" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold tracking-tight text-zinc-900">{label}</p>
            {value ? <p className="mt-0.5 text-xs text-zinc-500">{value}</p> : null}
          </div>
        </div>
        <ChevronRight size={18} className="text-zinc-400" />
      </div>
    </button>
  )
}

export default function ProfilePage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="rounded-[32px] border border-black/5 bg-white p-5 shadow-bento">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-[22px] bg-gradient-to-br from-rose-100 via-white to-indigo-100 ring-1 ring-black/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Store size={22} className="text-ink" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-zinc-500">Merchant Profile</p>
            <p className="mt-1 text-base font-semibold tracking-tight text-zinc-900">Bake Diary</p>
            <p className="mt-0.5 text-xs text-zinc-500">Bakery • Cakes • Cookies • Drinks</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] bg-zinc-50 px-4 py-3 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold text-zinc-500">Primary campus</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">Sunway University</p>
          </div>
          <div className="rounded-[22px] bg-zinc-50 px-4 py-3 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold text-zinc-500">WhatsApp line</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">+60 12-345 6789</p>
          </div>
          <div className="rounded-[22px] bg-zinc-50 px-4 py-3 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold text-zinc-500">Hours</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">9:00–21:00</p>
          </div>
          <div className="rounded-[22px] bg-zinc-50 px-4 py-3 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold text-zinc-500">Category</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">Cakes & coffee</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6">
        <p className="text-xs font-semibold tracking-wide text-zinc-600">Settings</p>
        <div className="mt-3 space-y-3">
          <Row icon={Bell} label="Notifications" value="Alerts, promos, and AI suggestions" />
          <Row icon={User} label="Account" value="Profile, payout info, and security" />
          <Row icon={Shield} label="Privacy" value="Permissions and data controls" />
          <Row icon={HelpCircle} label="Help & Support" value="FAQs and contact" />

          <button
            type="button"
            className="w-full rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4 shadow-bento transition-colors hover:bg-rose-100/60"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-rose-200">
                  <LogOut size={18} className="text-rose-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold tracking-tight text-rose-700">Log out</p>
                  <p className="mt-0.5 text-xs text-rose-600/80">End session on this device</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-rose-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
