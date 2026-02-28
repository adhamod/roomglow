export default function SynthwaveBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050510]">
      <img
        src="/background.png"
        alt="Synthwave Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.8 }}
      />
      {/* Overlay gradient to ensure text readability if image is too bright */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,16,0.4) 0%, rgba(5,5,16,0.2) 50%, rgba(5,5,16,0.6) 100%)',
        }}
      />
    </div>
  )
}
