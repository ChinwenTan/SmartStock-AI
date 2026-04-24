import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
      />
    </div>
  )
}

export default function AuthSignup({ onBack, onSwitchSignIn, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSuccess?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full px-6 py-10 flex flex-col justify-center"
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-bento ring-1 ring-black/5 hover:bg-zinc-50"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      ) : null}

      <div className="rounded-[36px] bg-white p-6 shadow-bento ring-1 ring-black/5">
        <p className="font-display text-2xl text-zinc-900">Create your account</p>
        <p className="mt-2 text-sm text-zinc-500">Start tracking inventory and generating promos.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <Field
            icon={User}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="mt-2 w-full rounded-[32px] bg-ink px-6 py-5 text-sm font-semibold text-white shadow-bento transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Create account
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Already have an account?</p>
          <button
            type="button"
            onClick={onSwitchSignIn}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Sign in
          </button>
        </div>
      </div>
    </motion.div>
  )
}
