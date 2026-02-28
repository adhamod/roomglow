import { useState } from 'react'

const ICONS = {
  palette: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  sofa: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  sparkles: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
}

const BORDER_COLORS = [
  'rgba(255, 45, 123, 0.35)',
  'rgba(0, 240, 255, 0.35)',
  'rgba(179, 71, 234, 0.35)',
  'rgba(255, 159, 67, 0.35)',
]

const ICON_BG = [
  'linear-gradient(135deg, rgba(255,45,123,0.2), rgba(255,45,123,0.05))',
  'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,240,255,0.05))',
  'linear-gradient(135deg, rgba(179,71,234,0.2), rgba(179,71,234,0.05))',
  'linear-gradient(135deg, rgba(255,159,67,0.2), rgba(255,159,67,0.05))',
]

const TEXT_COLORS = ['text-neon-pink', 'text-neon-cyan', 'text-neon-purple', 'text-neon-orange']

function buildShopUrl(searchQuery) {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(searchQuery)}`
}

function buildImageUrl(searchQuery) {
  return `https://source.unsplash.com/400x250/?${encodeURIComponent(searchQuery)},interior,decor`
}

function ProductImage({ searchQuery, name }) {
  const [errored, setErrored] = useState(false)
  if (errored) {
    return (
      <div className="w-full h-44 rounded-xl flex items-center justify-center bg-white/5 text-gray-600 text-xs">
        No preview
      </div>
    )
  }
  return (
    <img
      src={buildImageUrl(searchQuery || name)}
      alt={name}
      onError={() => setErrored(true)}
      className="w-full h-44 object-cover rounded-xl"
    />
  )
}

export default function DesignTips({ data, preview, onReset, onRefreshRecommendations, refreshingProducts = false }) {
  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* Room photo + overall impression */}
      <div className="flex flex-col items-center mb-10">
        {preview && (
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(179,71,234,0.2)]">
            <img src={preview} alt="Your room" className="max-h-80 rounded-2xl object-cover" />
          </div>
        )}
        {data.overall_impression && (
          <div className="glass-card rounded-2xl p-6 max-w-3xl text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neon-purple mb-3">
              Overall Impression
            </h2>
            <p className="text-gray-300 leading-relaxed">{data.overall_impression}</p>
          </div>
        )}
      </div>

      {/* Combined improvements + products section */}
      <div className="mb-10">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neon-cyan">
            Room Improvements & Recommended Products
          </h2>
        </div>

        {/* Design tip categories — each with embedded product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.categories?.map((cat, i) => (
            <div
              key={cat.name}
              className="glass-card rounded-2xl p-6 transition-all duration-300 flex flex-col"
              style={{ borderColor: BORDER_COLORS[i % BORDER_COLORS.length] }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: ICON_BG[i % ICON_BG.length] }}
                >
                  <span className={TEXT_COLORS[i % TEXT_COLORS.length]}>
                    {ICONS[cat.icon] || ICONS.sparkles}
                  </span>
                </div>
                <h3 className={`font-bold text-lg ${TEXT_COLORS[i % TEXT_COLORS.length]}`}>
                  {cat.name}
                </h3>
              </div>

              {/* Tips */}
              <ul className="space-y-3 mb-6">
                {cat.tips?.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: BORDER_COLORS[i % BORDER_COLORS.length].replace('0.35', '0.8') }}
                    />
                    <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>

              {/* Embedded product buy card */}
              {cat.product && (
                <a
                  href={buildShopUrl(cat.product.search_query || cat.product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto rounded-xl overflow-hidden block group border transition-all duration-300 hover:scale-[1.01]"
                  style={{ borderColor: BORDER_COLORS[i % BORDER_COLORS.length] }}
                >
                  {/* Product image */}
                  <div className="relative overflow-hidden h-36">
                    <ProductImage searchQuery={cat.product.search_query} name={cat.product.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span
                      className={`absolute bottom-2 left-3 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm ${TEXT_COLORS[i % TEXT_COLORS.length]}`}
                    >
                      Buy Now
                    </span>
                    <svg
                      className="absolute top-2 right-2 w-4 h-4 text-white/50 group-hover:text-white transition-colors"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  {/* Product info */}
                  <div className="px-4 py-3 bg-white/5">
                    <p className={`font-semibold text-sm mb-1 ${TEXT_COLORS[i % TEXT_COLORS.length]}`}>
                      {cat.product.name}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed mb-2">{cat.product.why}</p>
                    <span className="text-neon-cyan text-xs font-semibold uppercase tracking-wider group-hover:underline">
                      Shop on Google →
                    </span>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="neon-btn-cyan text-white font-bold py-3 px-8 rounded-xl uppercase tracking-wider text-sm cursor-pointer"
        >
          Analyze Another Room
        </button>
      </div>
    </div>
  )
}
