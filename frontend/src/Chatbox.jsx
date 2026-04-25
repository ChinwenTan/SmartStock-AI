import { AnimatePresence, motion } from 'framer-motion'
import { Camera, ImagePlus, Mic, Paperclip, Plus, Send, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown';

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function Bubble({ role, children }) {
  const isUser = role === 'user'
  return (
    <div className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={
          'max-w-[85%] rounded-[26px] px-4 py-3 shadow-sm ring-1 ' +
          (isUser ? 'bg-ink text-white ring-black/10' : 'bg-white text-zinc-900 ring-black/5')
        }
      >
        {children}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <Bubble role="assistant">
      <div className="flex items-center gap-1.5 py-1">
        <span
          className="h-2 w-2 rounded-full bg-zinc-400"
          style={{ animation: 'bd-bounce 1s infinite ease-in-out' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-zinc-400"
          style={{ animation: 'bd-bounce 1s infinite ease-in-out', animationDelay: '0.12s' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-zinc-400"
          style={{ animation: 'bd-bounce 1s infinite ease-in-out', animationDelay: '0.24s' }}
        />
        <style>{`
          @keyframes bd-bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: .55; }
            40% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </div>
    </Bubble>
  )
}

function useMediaRecorder() {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [isRecording, setIsRecording] = useState(false)

  const start = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) return { ok: false, reason: 'unsupported' }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = (e) => {
      if (e.data?.size) chunksRef.current.push(e.data)
    }
    mr.onstop = () => stream.getTracks().forEach((t) => t.stop())
    mr.start()
    mediaRecorderRef.current = mr
    setIsRecording(true)
    return { ok: true }
  }

  const stop = async () => {
    const mr = mediaRecorderRef.current
    if (!mr) return { ok: false }
    return new Promise((resolve) => {
      mr.onstop = () => {
        mr.stream?.getTracks?.().forEach?.((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        mediaRecorderRef.current = null
        setIsRecording(false)
        resolve({ ok: true, blob })
      }
      mr.stop()
    })
  }

  return { isRecording, start, stop }
}

export default function Chatbox({ onNavigate }) {
  const [text, setText] = useState('')
  const [showTools, setShowTools] = useState(false)
  const [toast, setToast] = useState(null)
  const listRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)

  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const { isRecording, start, stop } = useMediaRecorder()

  const [messages, setMessages] = useState(() => [
    {
      id: nowId(),
      role: 'assistant',
      type: 'text',
      text: "Hi! I’m your SyncBite assistant. Upload a photo, send a voice note, or ask for a promo idea.",
    },
  ])

  const canSend = useMemo(() => text.trim().length > 0, [text])

  useEffect(() => {
    setTimeout(
      () => listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight, behavior: 'smooth' }),
      40,
    )
  }, [messages.length])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const pushAssistant = (t) => {
    setMessages((prev) => [...prev, { id: nowId(), role: 'assistant', type: 'text', text: t }])
  }

  const sendText = async () => {
    const t = text.trim()
    if (!t) return
    
    setMessages((prev) => [...prev, { id: nowId(), role: 'user', type: 'text', text: t }])
    setText('')
    setShowTools(false)

    setIsTyping(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/chat';
    
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t }),
      });
      
      const data = await res.json();
      
      pushAssistant(data.reply || data.error);
    } catch (err) {
      pushAssistant("Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }
  const onPickFiles = (files, kind) => {
    const arr = Array.from(files || [])
    if (!arr.length) return
    setShowTools(false)
    setMessages((prev) => [
      ...prev,
      ...arr.map((f) => {
        const url = kind === 'image' || kind === 'camera' ? URL.createObjectURL(f) : null
        return {
          id: nowId(),
          role: 'user',
          type: kind === 'file' ? 'file' : 'image',
          name: f.name,
          size: f.size,
          mime: f.type,
          url,
        }
      }),
    ])
    setIsTyping(true)
    setTimeout(() => {
      pushAssistant('Received. Want me to extract items and flag expiry risks automatically?')
      setIsTyping(false)
    }, 450)
  }

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const res = await start()
        if (!res.ok) setToast('Voice recording not supported on this device.')
        else setToast('Recording… tap again to stop')
      } else {
        const res = await stop()
        if (res.ok && res.blob) {
          const url = URL.createObjectURL(res.blob)
          setMessages((prev) => [...prev, { id: nowId(), role: 'user', type: 'audio', url }])
          setIsTyping(true)
          setTimeout(() => {
            pushAssistant('Voice note received. Do you want a 1-hour flash sale message template?')
            setIsTyping(false)
          }, 450)
        }
      }
    } catch {
      setToast('Microphone permission blocked.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="p-6 min-h-full flex flex-col"
    >
      {/* Header */}
      <div className="rounded-[32px] bg-ink text-white shadow-bento ring-1 ring-black/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">SyncBite AI</p>
              <p className="mt-0.5 text-xs text-white/65">Chat • Voice • Photos • Files</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            Back
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="mt-4 flex-1 overflow-y-auto rounded-[32px] bg-white shadow-bento ring-1 ring-black/5 px-5 py-4 space-y-3"
      >
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role}>
              {m.type === 'text' ? (
                <div
                  className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                    m.role === 'user'
                      ? 'text-white/95 prose-invert prose-headings:text-white prose-strong:text-white prose-li:text-white/95'
                      : 'text-zinc-800 prose-headings:text-zinc-900 prose-strong:text-zinc-900 prose-li:text-zinc-700'
                  }`}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ) : null}

            {m.type === 'file' ? (
              <div>
                <p className={'text-sm font-semibold ' + (m.role === 'user' ? 'text-white' : 'text-zinc-900')}>
                  {m.name}
                </p>
                <p className={'mt-1 text-xs ' + (m.role === 'user' ? 'text-white/70' : 'text-zinc-500')}>
                  {formatBytes(m.size)}
                </p>
              </div>
            ) : null}

            {m.type === 'image' ? (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 bg-zinc-100">
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img src={m.url} alt="Uploaded image" className="block w-full h-auto" />
                </div>
                <p className={'text-xs ' + (m.role === 'user' ? 'text-white/70' : 'text-zinc-500')}>
                  {m.name}
                </p>
              </div>
            ) : null}

            {m.type === 'audio' ? <audio controls src={m.url} className="w-[260px] max-w-full" /> : null}
          </Bubble>
        ))}
        {isTyping ? <TypingIndicator /> : null}
      </div>

      {/* Composer */}
      <div className="mt-4 rounded-[28px] bg-white shadow-bento ring-1 ring-black/5 overflow-hidden">
        <div className="flex items-end gap-2 p-3">
          <button
            type="button"
            onClick={() => setShowTools((s) => !s)}
            className="h-11 w-11 rounded-2xl bg-zinc-100 text-zinc-700 ring-1 ring-black/5 flex items-center justify-center hover:bg-zinc-200"
            aria-label="Tools"
          >
            <Plus size={18} />
          </button>

          <div className="flex-1">
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message SyncBite AI…"
              className="w-full resize-none bg-transparent px-2 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={sendText}
            disabled={!canSend}
            className={
              'h-11 w-11 rounded-2xl ring-1 flex items-center justify-center transition-colors ' +
              (canSend
                ? 'bg-ink text-white ring-black/10 hover:bg-black'
                : 'bg-zinc-100 text-zinc-400 ring-black/5 cursor-not-allowed')
            }
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>

        <AnimatePresence>
          {showTools ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="border-t border-black/5 bg-zinc-50"
            >
              <div className="grid grid-cols-4 gap-2 p-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[22px] bg-white px-3 py-3 text-xs font-semibold text-zinc-800 ring-1 ring-black/5 shadow-sm"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
                    <Paperclip size={18} className="text-zinc-700" />
                  </div>
                  File
                </button>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="rounded-[22px] bg-white px-3 py-3 text-xs font-semibold text-zinc-800 ring-1 ring-black/5 shadow-sm"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
                    <ImagePlus size={18} className="text-zinc-700" />
                  </div>
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="rounded-[22px] bg-white px-3 py-3 text-xs font-semibold text-zinc-800 ring-1 ring-black/5 shadow-sm"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
                    <Camera size={18} className="text-zinc-700" />
                  </div>
                  Camera
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={
                    'rounded-[22px] px-3 py-3 text-xs font-semibold ring-1 shadow-sm ' +
                    (isRecording ? 'bg-rose-600 text-white ring-rose-700/30' : 'bg-white text-zinc-800 ring-black/5')
                  }
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
                    <Mic size={18} className="text-zinc-700" />
                  </div>
                  {isRecording ? 'Stop' : 'Voice'}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => onPickFiles(e.target.files, 'file')}
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => onPickFiles(e.target.files, 'image')}
      />
      <input
        ref={cameraInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => onPickFiles(e.target.files, 'camera')}
      />

      {/* toast */}
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-none mt-3 flex justify-center"
          >
            <div className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-bento">
              {toast}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
