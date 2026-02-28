import { useState, useCallback } from 'react'
import UploadZone from './components/UploadZone'
import LoadingState from './components/LoadingState'
import DesignTips from './components/DesignTips'
import SynthwaveBackground from './components/SynthwaveBackground'

const STATES = { UPLOAD: 'upload', LOADING: 'loading', RESULTS: 'results', ERROR: 'error' }

export default function App() {
  const [view, setView] = useState(STATES.UPLOAD)
  const [preview, setPreview] = useState(null)
  const [tips, setTips] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = useCallback(async (file) => {
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setView(STATES.LOADING)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || `Server error (${res.status})`)
      }

      const data = await res.json()
      setTips(data)
      setView(STATES.RESULTS)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setView(STATES.ERROR)
    }
  }, [])

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setView(STATES.UPLOAD)
    setPreview(null)
    setTips(null)
    setError(null)
  }, [preview])

  return (
    <>
      <SynthwaveBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        {/* Brand Header */}
        <header className="text-center mb-12 md:mb-16 pt-10">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.1em] leading-tight">
            <span className="text-neon-pink brand-glow-pink">ROOM</span>
            <span className="text-neon-cyan brand-glow-cyan">GLOW</span>
          </h1>
          <p className="text-white/40 mt-4 text-xs md:text-sm tracking-[0.3em] uppercase font-medium">
            BY STELLAR HAUS
          </p>
          <p className="text-white/50 mt-4 text-sm md:text-base font-light tracking-wide">
            Your space deserves better. We'll show you how.
          </p>
        </header>

        {/* Main content */}
        <main className="w-full px-4 pb-20 flex flex-col items-center">
          {view === STATES.UPLOAD && <UploadZone onUpload={handleUpload} />}

          {view === STATES.LOADING && <LoadingState preview={preview} />}

          {view === STATES.RESULTS && tips && (
            <DesignTips data={tips} preview={preview} onReset={handleReset} />
          )}

          {view === STATES.ERROR && (
            <div className="max-w-lg mx-auto text-center">
              <div className="glass-card rounded-2xl p-10">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center border border-red-500/20 bg-red-500/5">
                  <svg className="w-7 h-7 text-red-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-white/90 font-semibold text-lg mb-2">Something went wrong</h2>
                <p className="text-white/40 text-sm mb-8">{error}</p>
                <button
                  onClick={handleReset}
                  className="neon-btn text-white font-semibold py-3 px-8 rounded-xl text-sm cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
