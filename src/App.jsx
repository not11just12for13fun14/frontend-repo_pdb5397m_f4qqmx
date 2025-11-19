import { useMemo } from 'react'

function App() {
  // Particles/stars: three parallax layers
  const { far, mid, near } = useMemo(() => {
    const prng = (seed) => {
      let x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    const makeLayer = (count, seedBase, sizeMin, sizeMax, alphaMin, alphaMax) =>
      Array.from({ length: count }, (_, i) => {
        const rx = prng(seedBase + i * 13.73)
        const ry = prng(seedBase + i * 91.19)
        const size = sizeMin + prng(seedBase + i * 7.1) * (sizeMax - sizeMin)
        const alpha = alphaMin + prng(seedBase + i * 5.3) * (alphaMax - alphaMin)
        const hue = 200 + prng(seedBase + i * 2.7) * 18 // bluish white
        const blur = prng(seedBase + i * 3.9) < 0.2 ? 0.6 + prng(i) * 1.2 : 0
        const delay = prng(seedBase + i * 4.1) * 8
        const duration = 10 + prng(seedBase + i * 4.7) * 18
        return {
          left: `${rx * 100}%`,
          top: `${ry * 100}%`,
          size,
          alpha,
          color: `hsla(${hue}, 45%, 92%, ${alpha})`,
          blur,
          delay,
          duration,
        }
      })

    return {
      far: makeLayer(140, 123, 0.6, 1.2, 0.10, 0.28),
      mid: makeLayer(90, 777, 0.8, 1.8, 0.14, 0.32),
      near: makeLayer(50, 2025, 1.0, 2.6, 0.18, 0.36),
    }
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-black">
      {/* SVG filters for water ripple/distortion */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="ripple" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.007 0.01" numOctaves="2" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="22s" values="0.006 0.009; 0.008 0.012; 0.006 0.009" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" dur="18s" values="7;11;7" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>

          {/* Gradient for the crescent fill */}
          <radialGradient id="glowGrad" cx="60%" cy="45%" r="60%">
            <stop offset="8%" stopColor="#f7fbff" />
            <stop offset="55%" stopColor="#e6f0ff" />
            <stop offset="88%" stopColor="#c8dcff" />
          </radialGradient>

          {/* Mask to create a crescent without any dark circle visible */}
          <mask id="crescentMask">
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            {/* White circle: visible area */}
            <circle cx="80" cy="80" r="70" fill="white" />
            {/* Black circle overlapping to carve the inner side, shifted to the right */}
            <circle cx="98" cy="80" r="72" fill="black" />
          </mask>

          {/* Soft external halo blur for the crescent (SVG filter) */}
          <filter id="crescentGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.86  0 0 0 0 1  0 0 0 0.65 0" />
          </filter>
        </defs>
      </svg>

      {/* Background gradient: brighter near top-center, fading to dark teal/black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 800px at 50% 15%, rgba(18,34,46,0.9), rgba(6,18,24,0.95) 55%, rgba(3,8,12,0.98) 70%, rgba(0,0,0,1) 100%)',
        }}
      />

      {/* Distant nebulas/tones adding depth (teal/navy hints) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] blur-3xl"
        style={{
          backgroundImage: `
            radial-gradient(360px 220px at 50% 22%, rgba(70,150,170,0.18), transparent 60%),
            radial-gradient(520px 280px at 58% 30%, rgba(50,110,160,0.16), transparent 60%),
            radial-gradient(440px 260px at 62% 38%, rgba(40,90,140,0.14), transparent 60%)
          `,
          backgroundBlendMode: 'screen',
        }}
      />

      {/* Caustic light patterns near upper middle */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(500px 320px at 50% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'radial-gradient(500px 320px at 50% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
          backgroundImage:
            'radial-gradient(120px 80px at 40% 20%, rgba(170,210,255,0.12) 0%, rgba(170,210,255,0.0) 70%),
             radial-gradient(140px 90px at 60% 22%, rgba(170,210,255,0.10) 0%, rgba(170,210,255,0.0) 70%)',
          backgroundBlendMode: 'screen',
          filter: 'blur(8px) contrast(120%)',
          animation: 'causticsMove 26s ease-in-out infinite',
          opacity: 0.25,
        }}
      />

      {/* Distorted content wrapper (stars + guiding light) */}
      <div className="absolute inset-0" style={{ filter: 'url(#ripple)' }}>
        {/* Guiding Light: drifting, pulsing crescent with halo */}
        <div
          className="absolute left-1/2"
          style={{ top: '4.5vh', transform: 'translateX(-50%)' }}
        >
          {/* Outer soft halo behind the crescent */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: '-1vmin',
              width: '42vmin',
              height: '42vmin',
              background:
                'radial-gradient(closest-side, rgba(190,220,255,0.14), rgba(80,140,200,0.10) 50%, rgba(20,35,60,0.0) 72%)',
              filter: 'blur(2px)',
              borderRadius: '9999px',
              animation: 'softPulse 12s ease-in-out infinite',
            }}
          />

          {/* Crescent SVG (masked), gently floats */}
          <div
            className="relative"
            style={{
              width: '11vmin',
              height: '11vmin',
              minWidth: 56,
              minHeight: 56,
              animation: 'floatXY 16s ease-in-out infinite',
              willChange: 'transform, filter',
            }}
          >
            <svg viewBox="0 0 160 160" width="100%" height="100%">
              {/* Glow group for a soft edge */}
              <g filter="url(#crescentGlow)">
                <g mask="url(#crescentMask)">
                  <circle cx="80" cy="80" r="70" fill="url(#glowGrad)" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Parallax particle layers */}
        {/* Far layer: slow vertical drift */}
        <div
          className="absolute inset-0"
          style={{ animation: 'driftDownSlow 60s linear infinite' }}
        >
          {far.map((p, i) => (
            <div
              key={`far-${i}`}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                filter: p.blur ? `blur(${p.blur}px)` : 'none',
                opacity: p.alpha,
                animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Mid layer: diagonal drift for parallax */}
        <div
          className="absolute inset-0"
          style={{ animation: 'driftDiagonal 48s linear infinite' }}
        >
          {mid.map((p, i) => (
            <div
              key={`mid-${i}`}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                filter: p.blur ? `blur(${p.blur}px)` : 'none',
                opacity: p.alpha,
                animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Near layer: subtle sideways drift */}
        <div
          className="absolute inset-0"
          style={{ animation: 'driftSideSlow 36s linear infinite' }}
        >
          {near.map((p, i) => (
            <div
              key={`near-${i}`}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                filter: p.blur ? `blur(${p.blur}px)` : 'none',
                opacity: p.alpha,
                animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Strong vignette to push edges to near black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 30%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.48) 60%, rgba(0,0,0,0.85) 84%, rgba(0,0,0,0.97) 100%)',
        }}
      />
    </div>
  )
}

export default App
