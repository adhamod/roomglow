import VibeSong from './VibeSong'

const ICONS = {
  palette: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  sofa: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
}

const ACCENT_COLORS = [
  { border: 'rgba(255,45,123,0.2)', text: 'text-neon-pink/70', dot: '#ff2d7b' },
  { border: 'rgba(0,240,255,0.2)', text: 'text-neon-cyan/70', dot: '#00f0ff' },
  { border: 'rgba(179,71,234,0.2)', text: 'text-neon-purple/70', dot: '#b347ea' },
  { border: 'rgba(255,159,67,0.2)', text: 'text-neon-orange/70', dot: '#ff9f43' },
]

function buildShopUrl(searchQuery) {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(searchQuery)}`
}

const CATEGORY_ICONS = {
  palette: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  sofa: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  sparkles: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
}

const PRODUCT_GRADIENTS = [
  'linear-gradient(135deg, rgba(255,45,123,0.15) 0%, rgba(179,71,234,0.1) 100%)',
  'linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(179,71,234,0.1) 100%)',
  'linear-gradient(135deg, rgba(179,71,234,0.15) 0%, rgba(255,45,123,0.1) 100%)',
  'linear-gradient(135deg, rgba(255,159,67,0.15) 0%, rgba(255,45,123,0.1) 100%)',
]

function ProductCard({ name, icon, accentIdx }) {
  return (
    <div
      className="w-full h-36 rounded-t-xl flex flex-col items-center justify-center gap-3"
      style={{ background: PRODUCT_GRADIENTS[accentIdx % PRODUCT_GRADIENTS.length] }}
    >
      <span className="text-white/25">
        {CATEGORY_ICONS[icon] || CATEGORY_ICONS.sparkles}
      </span>
      <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium px-6 text-center leading-relaxed">
        {name}
      </span>
    </div>
  )
}

export default function DesignTips({ data, preview, onReset, onRetakeQuiz, onRefreshRecommendations, refreshingProducts = false, styleTag, quizAnswers }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Image + overall impression */}
      <div className="flex flex-col items-center mb-12">
        {preview && (
          <div className="hero-card overflow-hidden mb-8">
            <img
              src={preview}
              alt="Your room"
              className="max-h-80 rounded-[20px] object-cover"
            />
          </div>
        )}

        {data.overall_impression && (
          <div className="glass-card rounded-2xl p-8 max-w-3xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-purple/60 mb-3">
              Overall Impression
            </h2>
            <p className="text-white/50 leading-relaxed text-sm">
              {data.overall_impression}
            </p>
          </div>
        )}
      </div>

      {/* Room Anthem */}
      {data.overall_impression && <VibeSong data={data} />}

      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan/60">
          Room Improvements & Recommended Products
        </h2>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {data.categories?.map((cat, i) => {
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length]
          return (
            <div
              key={cat.name}
              className="glass-card rounded-2xl p-6 transition-all duration-200 flex flex-col"
              style={{ borderColor: accent.border }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/6 bg-white/[0.03]">
                  <span className={accent.text}>
                    {ICONS[cat.icon] || ICONS.sparkles}
                  </span>
                </div>
                <h3 className={`font-semibold text-base ${accent.text}`}>
                  {cat.name}
                </h3>
              </div>

              <ul className="space-y-3 mb-6">
                {cat.tips?.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span
                      className="mt-2 w-1 h-1 rounded-full shrink-0"
                      style={{ background: accent.dot, opacity: 0.5 }}
                    />
                    <span className="text-white/40 text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>

              {cat.product && (
                <a
                  href={buildShopUrl(cat.product.search_query || cat.product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto rounded-xl overflow-hidden block group border border-white/8 transition-all duration-300 hover:border-white/15 hover:scale-[1.01]"
                >
                  <div className="relative overflow-hidden h-36">
                    <ProductCard name={cat.product.name} icon={cat.icon} accentIdx={i} />
                    <span
                      className={`absolute bottom-2 left-3 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm ${accent.text}`}
                    >
                      Buy Now
                    </span>
                    <svg
                      className="absolute top-2 right-2 w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <div className="px-4 py-3 bg-white/[0.03]">
                    <p className={`font-semibold text-sm mb-1 ${accent.text}`}>
                      {cat.product.name}
                    </p>
                    <p className="text-white/30 text-xs leading-relaxed mb-2">{cat.product.why}</p>
                    <span className="text-neon-cyan/50 text-xs font-semibold uppercase tracking-wider group-hover:text-neon-cyan/80 transition-colors">
                      Shop on Google →
                    </span>
                  </div>
                </a>
              )}
            </div>
          )
        })}
      </div>

      {/* Style Profile Summary */}
      {(styleTag || quizAnswers) && (
        <div className="glass-card rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink/60 mb-5 text-center">
            Your Style Profile
          </h3>
          <div className="flex flex-wrap justify-center gap-3 mb-5">
            {styleTag && (
              <span className="px-4 py-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/5 text-neon-pink text-xs tracking-widest uppercase font-semibold">
                {styleTag}
              </span>
            )}
            {quizAnswers?.vibe && (
              <span className="px-4 py-1.5 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan/70 text-xs tracking-widest uppercase font-medium">
                {quizAnswers.vibe}
              </span>
            )}
            {quizAnswers?.priority && (
              <span className="px-4 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/5 text-neon-purple/70 text-xs tracking-widest uppercase font-medium">
                {quizAnswers.priority}
              </span>
            )}
            {quizAnswers?.budget && (
              <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 text-xs tracking-widest uppercase font-medium">
                {quizAnswers.budget}
              </span>
            )}
          </div>
          <p className="text-white/30 text-xs text-center mb-5">
            Your recommendations above were tailored to this profile.
          </p>
          {onRetakeQuiz && (
            <div className="flex justify-center">
              <button
                onClick={onRetakeQuiz}
                className="text-neon-pink/60 hover:text-neon-pink text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer underline underline-offset-4"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reset */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="neon-btn-cyan text-white font-semibold py-3 px-10 rounded-xl text-sm cursor-pointer"
        >
          Analyze Another Room
        </button>
      </div>
    </div>
  )
}
