import { useState, useRef, useEffect } from 'react'

const STATES = { IDLE: 'idle', LOADING: 'loading', READY: 'ready', ERROR: 'error' }

export default function VibeSong({ data }) {
  const [state, setState] = useState(STATES.IDLE)
  const [lyrics, setLyrics] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  const handleGenerate = async () => {
    setState(STATES.LOADING)
    setLyrics(null)
    setIsPlaying(false)

    try {
      const res = await fetch('/api/vibe-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overall_impression: data.overall_impression,
          categories: data.categories,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || 'Failed to generate song')
      }

      const result = await res.json()
      setLyrics(result.lyrics)

      // Decode base64 audio and create a blob URL
      const binary = atob(result.audio_base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const mimeType = result.format === 'wav' ? 'audio/wav' : 'audio/mpeg'
      const blob = new Blob([bytes], { type: mimeType })
      const url = URL.createObjectURL(blob)

      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.load()
      }

      setState(STATES.READY)
    } catch (err) {
      console.error(err)
      setState(STATES.ERROR)
    }
  }

  const handlePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleEnded = () => setIsPlaying(false)

  return (
    <div className="glass-card rounded-2xl p-6 mb-10" style={{ borderColor: 'rgba(179, 71, 234, 0.4)' }}>
      <audio ref={audioRef} onEnded={handleEnded} />

      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Label */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-neon-purple mb-1">
            Room Anthem
          </h3>
        <p className="text-gray-500 text-xs">
          AI-generated song sung by Bark · may take ~30s to generate
        </p>
        </div>

        {/* Action button */}
        {state === STATES.IDLE && (
          <button
            onClick={handleGenerate}
            className="neon-btn text-white font-bold py-3 px-6 rounded-xl uppercase tracking-wider text-sm cursor-pointer flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
            Generate Room Anthem
          </button>
        )}

        {state === STATES.LOADING && (
          <div className="flex items-center gap-3 text-neon-purple">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider">Composing… (~30s)</span>
          </div>
        )}

        {state === STATES.READY && (
          <button
            onClick={handlePlay}
            className="neon-btn-cyan text-white font-bold py-3 px-6 rounded-xl uppercase tracking-wider text-sm cursor-pointer flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Play Anthem
              </>
            )}
          </button>
        )}

        {state === STATES.ERROR && (
          <button
            onClick={handleGenerate}
            className="text-sm text-red-400 underline cursor-pointer"
          >
            Failed — try again
          </button>
        )}

        {/* Re-generate button once ready */}
        {state === STATES.READY && (
          <button
            onClick={handleGenerate}
            className="text-xs text-neon-purple/60 hover:text-neon-purple transition-colors uppercase tracking-wider cursor-pointer"
          >
            ↻ New anthem
          </button>
        )}
      </div>

      {/* Lyrics */}
      {lyrics && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Lyrics</p>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line italic">
            {lyrics}
          </p>
        </div>
      )}
    </div>
  )
}
