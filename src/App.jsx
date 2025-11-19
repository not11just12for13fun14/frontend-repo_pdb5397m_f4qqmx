import { useMemo } from 'react'

function App() {
  // Deterministic starfield positions so it looks the same on reload
  const stars = useMemo(() => {
    const countDim = 180 // very subtle, tiny points
    const countBright = 40 // slightly brighter ones

    const prng = (seed) => {
      let x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    const makeStar = (i, bright = false) => {
      const rx = prng(i * 13.37)
      const ry = prng(i * 91.91)
      const size = bright ? 1.6 + prng(i * 7.77) * 1.2 : 0.6 + prng(i * 5.55) * 0.9
      const alpha = bright ? 0.7 + prng(i * 3.21) * 0.25 : 0.18 + prng(i * 2.17) * 0.25
      const hueShift = 200 + prng(i * 4.2) * 15 // cold bluish white
      const delay = prng(i * 8.88) * 6
      const duration = 5 + prng(i * 6.66) * 7

      return {
        left: `${rx * 100}%`,
        top: `${ry * 100}%`,
        size,
        alpha,
        color: `hsla(${hueShift}, 40%, 92%, ${alpha})`,
        blur: bright ? 0.4 + prng(i * 1.11) * 0.6 : 0,
        delay,
        duration,
      }
    }

    const dim = Array.from({ length: countDim }, (_, i) => makeStar(i, false))
    const bright = Array.from({ length: countBright }, (_, i) => makeStar(i + 999, true))
    return [...dim, ...bright]
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-black">
      {/* Deep layered background gradient, colder near center/top, almost black edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(1200px 800px at 50% 15%, rgba(18,32,56,0.9), rgba(6,12,20,0.95) 55%, rgba(2,5,9,0.98) 70%, rgba(0,0,0,1) 100%)`,
        }}
      />

      {/* Subtle far nebulas (very low opacity) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] blur-3xl"
        style={{
          backgroundImage: `
            radial-gradient(350px 220px at 48% 22%, rgba(110,150,220,0.20), transparent 60%),
            radial-gradient(480px 260px at 54% 30%, rgba(90,130,210,0.18), transparent 60%),
            radial-gradient(420px 240px at 60% 38%, rgba(70,110,180,0.14), transparent 60%)
          `,
          backgroundBlendMode: 'screen',
        }}
      />

      {/* Wispy cloud layers (closer, irregular, semi-transparent) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          filter: 'blur(24px) contrast(120%)',
          backgroundImage: `
            radial-gradient(220px 160px at 40% 26%, rgba(160,200,255,0.10), transparent 65%),
            radial-gradient(260px 140px at 62% 28%, rgba(170,210,255,0.10), transparent 65%),
            radial-gradient(320px 180px at 50% 40%, rgba(150,190,250,0.08), transparent 70%),
            radial-gradient(280px 160px at 35% 36%, rgba(120,170,240,0.07), transparent 70%)
          `,
          backgroundBlendMode: 'screen',
        }}
      />

      {/* Subtle nearer cloud filaments for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          filter: 'blur(10px)',
          backgroundImage: `
            radial-gradient(160px 90px at 45% 22%, rgba(200,230,255,0.18), transparent 55%),
            radial-gradient(180px 100px at 55% 26%, rgba(205,235,255,0.15), transparent 60%)
          `,
          backgroundBlendMode: 'screen',
        }}
      />

      {/* Stars - many tiny, mostly barely visible, with subtle twinkle */}
      <div className="absolute inset-0">
        {stars.map((s, idx) => (
          <div
            key={idx}
            className="absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.color,
              filter: s.blur ? `blur(${s.blur}px)` : 'none',
              opacity: s.alpha,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Moon glow halo (soft, wide) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '5vh',
          width: '38vmin',
          height: '38vmin',
          background: 'radial-gradient(closest-side, rgba(180,210,255,0.16), rgba(60,100,170,0.10) 45%, rgba(20,35,60,0.0) 70%)',
          filter: 'blur(2px)',
          borderRadius: '9999px',
        }}
      />

      {/* Moon (no dark masking disc) */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: '4.5vh' }}
      >
        <div
          className="relative"
          style={{
            width: '9vmin',
            height: '9vmin',
            minWidth: 48,
            minHeight: 48,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 45%, #f7fbff 10%, #e6f0ff 55%, #c8dcff 85%)',
            boxShadow:
              '0 0 8px rgba(200,220,255,0.9), 0 0 28px rgba(130,170,255,0.45), 0 0 70px rgba(90,130,220,0.25)',
          }}
        />
      </div>

      {/* Strong vignette to push edges to near black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 85% at 50% 35%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.82) 85%, rgba(0,0,0,0.96) 100%)',
        }}
      />
    </div>
  )
}

export default App
