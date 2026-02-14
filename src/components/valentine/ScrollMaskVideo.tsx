import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import videoSrc from "../../assets/mymy.mp4";

gsap.registerPlugin(ScrollTrigger);

// ─── Config ───────────────────────────────────────────────────────────────────

const HEART_PATH =
  "M 50 88 C 30 72, 8 58, 8 38 C 8 20, 22 12, 35 12 C 42 12, 47 16, 50 20 C 53 16, 58 12, 65 12 C 78 12, 92 20, 92 38 C 92 58, 70 72, 50 88 Z";

const CONFIG = {
  initialScale: 0.3,
  finalScale: 10,
  heartX: 50,
  heartY: 50,

  // ─── Gradient Config ───────────────────────────────────────────
  // Warna dasar overlay (dilapisi gradient di atasnya)
  baseColor: "hsl(340, 60%, 92%)",

  // Gradient 1 — kanan atas (gold accent)
  grad1: {
    color: "hsl(45, 80%, 60%)", // ← ganti warna gold di sini
    opacity: 0.2, // ← sesuai dengan / 0.2 di CSS
    cx: "80%",
    cy: "30%", // ← posisi ellipse (80% 30%)
    rx: "40%",
    ry: "40%", // ← radius (40% = ukuran ellipse)
  },

  // Gradient 2 — kiri bawah (maroon accent)
  grad2: {
    color: "hsl(0, 50%, 30%)", // ← ganti warna maroon di sini
    opacity: 0.08, // ← sesuai dengan / 0.08 di CSS
    cx: "20%",
    cy: "70%", // ← posisi ellipse (20% 70%)
    rx: "40%",
    ry: "40%",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const ScrollMaskVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heartRef.current,
        {
          scale: CONFIG.initialScale,
          svgOrigin: `${CONFIG.heartX} ${CONFIG.heartY}`,
        },
        {
          scale: CONFIG.finalScale,
          svgOrigin: `${CONFIG.heartX} ${CONFIG.heartY}`,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { grad1, grad2, baseColor } = CONFIG;

  return (
    <section ref={containerRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1: Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Layer 2: SVG full-screen dengan mask + gradient overlay */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* ── Mask: lubang hati ─────────────────────────────── */}
            <mask id="heartHole">
              <rect width="100" height="100" fill="white" />
              <g
                ref={heartRef}
                transform={`translate(${CONFIG.heartX}, ${CONFIG.heartY}) translate(-50, -50)`}
              >
                <path d={HEART_PATH} fill="black" />
              </g>
            </mask>

            {/* ── Gradient 1: radial kanan atas (gold) ─────────── */}
            <radialGradient
              id="gradGold"
              cx={grad1.cx}
              cy={grad1.cy}
              rx={grad1.rx}
              ry={grad1.ry}
              gradientUnits="objectBoundingBox"
            >
              <stop
                offset="0%"
                stopColor={grad1.color}
                stopOpacity={grad1.opacity}
              />
              <stop offset="100%" stopColor={grad1.color} stopOpacity="0" />
            </radialGradient>

            {/* ── Gradient 2: radial kiri bawah (maroon) ───────── */}
            <radialGradient
              id="gradMaroon"
              cx={grad2.cx}
              cy={grad2.cy}
              rx={grad2.rx}
              ry={grad2.ry}
              gradientUnits="objectBoundingBox"
            >
              <stop
                offset="0%"
                stopColor={grad2.color}
                stopOpacity={grad2.opacity}
              />
              <stop offset="100%" stopColor={grad2.color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/*
            Tiga rect ditumpuk, semuanya pakai mask yang sama:
            1. Base color solid
            2. Gold radial di atas
            3. Maroon radial di atas
            → hasil = radial-gradient(gold) + radial-gradient(maroon) di atas base
          */}
          <rect
            width="100"
            height="100"
            fill={baseColor}
            mask="url(#heartHole)"
          />
          <rect
            width="100"
            height="100"
            fill="url(#gradGold)"
            mask="url(#heartHole)"
          />
          <rect
            width="100"
            height="100"
            fill="url(#gradMaroon)"
            mask="url(#heartHole)"
          />
        </svg>
      </div>
    </section>
  );
};

export default ScrollMaskVideo;
