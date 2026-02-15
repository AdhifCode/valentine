import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { footerData } from "@/data/valentineData";

gsap.registerPlugin(ScrollTrigger);

const PETAL_COLORS = ["#f5f0eb", "#ede8e0", "#faf7f2", "#e8e2d9", "#f0ebe3"];

interface Flower {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  bloomProgress: number;
  flyPhase: boolean;
  flyVx: number;
  flyVy: number;
  flyRotSpeed: number;
  opacity: number;
  petalCount: number;
  color: string;
  delay: number;
}

const FooterSection = () => {
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowersRef = useRef<Flower[]>([]);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef<"idle" | "bloom" | "fly">("idle");
  const triggerTimeRef = useRef<number>(0);

  const spawnFlowers = (canvas: HTMLCanvasElement) => {
    const count = 28;
    const flowers: Flower[] = [];
    for (let i = 0; i < count; i++) {
      const col = i % 7;
      const row = Math.floor(i / 7);
      flowers.push({
        id: i,
        x: 70 + (col * (canvas.width - 140)) / 6 + (Math.random() - 0.5) * 55,
        y: canvas.height * 0.28 + row * 75 + (Math.random() - 0.5) * 28,
        scale: 0.55 + Math.random() * 0.7,
        rotation: (Math.random() - 0.5) * 0.6,
        bloomProgress: 0,
        flyPhase: false,
        flyVx: (Math.random() - 0.5) * 1.0,
        flyVy: -(0.35 + Math.random() * 1.1),
        flyRotSpeed: (Math.random() - 0.5) * 0.035,
        opacity: 0,
        petalCount: Math.random() > 0.4 ? 6 : 5,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        delay: i * 100 + Math.random() * 60,
      });
    }
    flowersRef.current = flowers;
  };

  const drawFlower = (ctx: CanvasRenderingContext2D, f: Flower) => {
    if (f.opacity <= 0.01) return;
    const {
      x,
      y,
      scale,
      rotation,
      bloomProgress: bp,
      opacity,
      petalCount,
      color,
    } = f;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);

      ctx.save();
      ctx.translate(0, -13 * bp);
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.5 * bp, 9 * bp, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(255,255,240,0.5)";
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "rgba(190,185,175,0.45)";
      ctx.lineWidth = 0.6;
      for (let s = -3; s <= 3; s++) {
        ctx.beginPath();
        ctx.moveTo(s * 1.1, -3);
        ctx.lineTo(s * 0.5, -20 * bp);
        ctx.stroke();
      }

      ctx.restore();
    }

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * bp, 1.2, 4.5 * bp, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c8c2b4";
      ctx.shadowColor = "rgba(255,255,220,0.7)";
      ctx.shadowBlur = 2;
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 3.5 * bp, 0, Math.PI * 2);
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 3.5 * bp);
    grd.addColorStop(0, "#ffe08a");
    grd.addColorStop(1, "#c8a84b");
    ctx.fillStyle = grd;
    ctx.shadowColor = "rgba(255,200,80,0.8)";
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();
  };

  // Langsung trigger saat mount karena komponen ini hanya
  // di-render setelah surpriseCaught = true
  useEffect(() => {
    setTimeout(() => {
      phaseRef.current = "bloom";
      triggerTimeRef.current = performance.now();

      gsap.to(".footer-text-content", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    }, 600);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    if (!canvas || !footer) return;

    const ctx = canvas.getContext("2d")!;
    let running = true;

    const resize = () => {
      canvas.width = footer.offsetWidth;
      canvas.height = footer.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    spawnFlowers(canvas);

    const render = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const flowers = flowersRef.current;
      const elapsed = now - triggerTimeRef.current;

      if (phaseRef.current === "bloom") {
        let allDone = true;
        const bloomDur = 1100;

        flowers.forEach((f) => {
          const local = elapsed - f.delay;
          if (local < 0) {
            allDone = false;
            return;
          }
          const t = Math.min(local / bloomDur, 1);
          const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          f.bloomProgress = e;
          f.opacity = Math.min(e * 1.6, 1);
          if (t < 1) allDone = false;
        });

        if (allDone) {
          const lastDelay = flowers[flowers.length - 1].delay;
          const flyStartElapsed = lastDelay + bloomDur + 1400;
          if (elapsed > flyStartElapsed) {
            phaseRef.current = "fly";
          }
        }
      } else if (phaseRef.current === "fly") {
        const lastDelay = flowers[flowers.length - 1].delay;
        const bloomDur = 1100;
        const flyBaseTime = lastDelay + bloomDur + 1400;

        flowers.forEach((f, i) => {
          if (!f.flyPhase) {
            const fd = elapsed - (flyBaseTime + i * 55);
            if (fd > 0) f.flyPhase = true;
          }

          if (f.flyPhase) {
            f.flyVx += (Math.random() - 0.495) * 0.05;
            f.flyVy += -0.007 + (Math.random() - 0.52) * 0.012;
            f.flyVx *= 0.995;
            f.x += f.flyVx;
            f.y += f.flyVy;
            f.rotation += f.flyRotSpeed;

            if (
              f.y < canvas.height * 0.12 ||
              f.x < -50 ||
              f.x > canvas.width + 50
            ) {
              f.opacity -= 0.018;
            }
            f.opacity = Math.max(f.opacity, 0);
          }
        });
      }

      flowers.forEach((f) => drawFlower(ctx, f));
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative pt-16 pb-24 px-6 text-center w-full"
      style={{
        // overflow-hidden mencegah canvas melampaui batas footer
        overflow: "hidden",
        background:
          "linear-gradient(to bottom, hsl(var(--valentine-cream) / 0.15) 0%, hsl(var(--valentine-cream) / 0.3) 100%)",
        minHeight: "0",
        marginTop: "-1px",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div
        className="footer-text-content relative z-10 max-w-md mx-auto"
        style={{
          opacity: 0,
          transform: "translateY(30px)",
        }}
      >
        <div
          className="text-5xl mb-6"
          style={{ filter: "drop-shadow(0 2px 8px rgba(255,255,255,0.6))" }}
        >
          🌼
        </div>
        <p
          className="font-serif-display text-2xl md:text-3xl font-bold text-primary mb-4"
          style={{
            textShadow: "0 2px 12px rgba(255,255,255,0.5)",
            letterSpacing: "0.02em",
          }}
        >
          {footerData.message}
        </p>
        <p
          className="font-sans-body text-muted-foreground text-lg"
          style={{ opacity: 0.8 }}
        >
          {footerData.specialDate}
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
