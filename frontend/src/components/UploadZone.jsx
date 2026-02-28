import { useCallback, useRef, useState } from 'react'

const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export default function UploadZone({ onUpload }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const validate = (file) => {
    if (!ALLOWED.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image.'
    }
    if (file.size > MAX_SIZE) {
      return 'Image must be under 10 MB.'
    }
    return null
  }

  const handleFile = useCallback(
    (file) => {
      const err = validate(file)
      if (err) {
        setError(err)
        return
      }
      setError(null)
      onUpload(file)
    },
    [onUpload],
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragActive(false)
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile],
  )

  const onDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const onDragLeave = () => setDragActive(false)

  const onClickBrowse = () => inputRef.current?.click()

  const onChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClickBrowse}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-12
          transition-all duration-300 text-center
          ${
            dragActive
              ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_40px_rgba(0,240,255,0.15)]'
              : 'border-neon-purple/40 hover:border-neon-pink/60 hover:shadow-[0_0_30px_rgba(255,45,123,0.1)]'
          }
        `}
      >
        {/* Upload icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,45,123,0.15), rgba(179,71,234,0.15))',
              border: '1px solid rgba(179,71,234,0.3)',
            }}
          >
            <svg
              className="w-10 h-10 text-neon-pink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
        </div>

        <p className="text-lg font-semibold text-white mb-2">
          Drop your room photo here
        </p>
        <p className="text-sm text-gray-400">
          or{' '}
          <span className="text-neon-cyan underline underline-offset-2">
            click to browse
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-3">
          JPEG, PNG, or WebP &middot; up to 10 MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={onChange}
        />
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
}
