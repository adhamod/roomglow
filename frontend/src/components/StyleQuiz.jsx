import { useState } from 'react'

const QUESTIONS = [
  {
    id: 'vibe',
    question: "What's your room vibe?",
    options: ['Cozy', 'Modern', 'Boho', 'Minimalist'],
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    options: ['Comfort', 'Aesthetics', 'Function'],
  },
  {
    id: 'budget',
    question: "What's your budget style?",
    options: ['Budget-friendly', 'Mid-range', 'Splurge-worthy'],
  },
]

export default function StyleQuiz({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL || ''
  const current = QUESTIONS[step]

  async function handleSelect(option) {
    const updated = { ...answers, [current.id]: option }
    setAnswers(updated)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }

    // Last question — save to backend and proceed
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const data = res.ok ? await res.json() : null
      onComplete(data?.style_tag || null, updated)
    } catch {
      onComplete(null, updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 md:p-10">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-8">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-neon-pink' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        <p className="text-white/40 text-xs tracking-[0.3em] uppercase text-center mb-3">
          Question {step + 1} of {QUESTIONS.length}
        </p>

        <h2 className="text-white/90 text-xl md:text-2xl font-semibold text-center mb-8">
          {current.question}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={saving}
              className="glass-card rounded-xl py-4 px-4 text-white/70 hover:text-white text-sm font-medium
                         hover:border-neon-pink/50 hover:bg-neon-pink/5 transition-all duration-200
                         border border-white/10 cursor-pointer disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>

        {saving && (
          <p className="text-center text-white/40 text-xs mt-6 tracking-widest uppercase animate-pulse">
            Saving your style...
          </p>
        )}
      </div>
    </div>
  )
}
