export default function LoadingState({ preview }) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {preview && (
        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(179,71,234,0.2)]">
          <img
            src={preview}
            alt="Your room"
            className="max-h-72 rounded-2xl object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 to-transparent" />
        </div>
      )}

      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#ff2d7b',
            borderRightColor: '#b347ea',
            animation: 'spin-slow 1.2s linear infinite',
          }}
        />
        <div
          className="absolute w-10 h-10 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: '#00f0ff',
            borderLeftColor: '#b347ea',
            animation: 'spin-slow 0.8s linear infinite reverse',
          }}
        />
      </div>

      <div className="text-center">
        <p
          className="text-xl font-bold tracking-wide uppercase text-neon-cyan"
          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
        >
          Analyzing your space&hellip;
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Our AI is studying every detail of your room
        </p>
      </div>
    </div>
  )
}
