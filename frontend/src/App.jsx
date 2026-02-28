import { useState, useCallback } from 'react'
import UploadZone from './components/UploadZone'
import LoadingState from './components/LoadingState'
import DesignTips from './components/DesignTips'

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
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="pt-10 pb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">
          <span className="text-neon-pink neon-glow-pink">Room</span>
          <span className="text-neon-cyan neon-glow-cyan">Glow</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase">
          by Stellar Haus
        </p>
        <p className="text-gray-500 mt-1 text-xs">
          AI-powered interior design tips from your photo
        </p>
      </header>

      {/* Main content */}
      <main className="px-4 pb-16 pt-4">
        {view === STATES.UPLOAD && <UploadZone onUpload={handleUpload} />}

        {view === STATES.LOADING && <LoadingState preview={preview} />}

        {view === STATES.RESULTS && tips && (
          <DesignTips data={tips} preview={preview} onReset={handleReset} />
        )}

        {view === STATES.ERROR && (
          <div className="max-w-lg mx-auto text-center">
            <div className="glass-card rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Something went wrong</h2>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="neon-btn text-white font-bold py-3 px-8 rounded-xl uppercase tracking-wider text-sm cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center pb-6 text-gray-600 text-xs tracking-wider uppercase">
        Stellar Haus &middot; 2026
      </footer>
    </div>
  )
}
