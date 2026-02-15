import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { surpriseMessage } from "@/data/valentineData";

gsap.registerPlugin(ScrollTrigger);

interface SurpriseSectionProps {
  onCaught: () => void;
}

const BUTTON_W = 160;
const BUTTON_H = 56;
const PADDING = 24;

const SurpriseSection = ({ onCaught }: SurpriseSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [caught, setCaught] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const maxEvades = 5;

  const handleMouseEnter = useCallback(() => {
    if (caught || !btnRef.current || !containerRef.current) return;
    if (attempts >= maxEvades) return;

    const container = containerRef.current.getBoundingClientRect();

    const maxX = container.width - BUTTON_W - PADDING * 2;
    const maxY = container.height - BUTTON_H - PADDING * 2;

    if (maxX <= 0 || maxY <= 0) return;

    const btnRect = btnRef.current.getBoundingClientRect();
    const currentX = btnRect.left - container.left;
    const currentY = btnRect.top - container.top;

    let newX: number;
    let newY: number;
    let tries = 0;

    do {
      newX = PADDING + Math.random() * maxX;
      newY = PADDING + Math.random() * maxY;
      tries++;
    } while (
      tries < 10 &&
      Math.abs(newX - currentX) < BUTTON_W &&
      Math.abs(newY - currentY) < BUTTON_H
    );

    // Hitung center-relative offset
    const centerX = container.width / 2 - BUTTON_W / 2;
    const centerY = container.height / 2 - BUTTON_H / 2;

    // Clamp agar tidak pernah keluar batas container
    const maxTranslateX = centerX - PADDING;
    const maxTranslateY = centerY - PADDING;

    const translateX = Math.max(
      -maxTranslateX,
      Math.min(maxTranslateX, newX - centerX),
    );
    const translateY = Math.max(
      -maxTranslateY,
      Math.min(maxTranslateY, newY - centerY),
    );

    gsap.to(btnRef.current, {
      x: translateX,
      y: translateY,
      duration: 0.3,
      ease: "power2.out",
    });

    setAttempts((p) => p + 1);
  }, [attempts, caught]);

  const triggerCelebration = () => {
    if (caught) return;
    setCaught(true);
    onCaught();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      type: "heart" | "confetti";
      rotation: number;
      rotSpeed: number;
      life: number;
    }[] = [];

    const colors = [
      "hsl(350, 60%, 45%)",
      "hsl(0, 86%, 70%)",
      "hsl(33, 55%, 65%)",
      "hsl(345, 100%, 35%)",
      "hsl(0, 100%, 80%)",
      "hsl(330, 80%, 60%)",
    ];

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 5,
        size: Math.random() * 12 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.5 ? "heart" : "confetti",
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
      });
    }

    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        particles.push({
          x: Math.random() * canvas.width,
          y: -20,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 18 + 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: "heart",
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 5,
          life: 1,
        });
      }, i * 50);
    }

    const drawHeart = (
      x: number,
      y: number,
      size: number,
      color: string,
      rot: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.beginPath();
      const s = size / 10;
      ctx.moveTo(0, s * 3);
      ctx.bezierCurveTo(-s * 5, -s * 2, -s * 2, -s * 7, 0, -s * 4);
      ctx.bezierCurveTo(s * 2, -s * 7, s * 5, -s * 2, 0, s * 3);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    let animFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rotation += p.rotSpeed;
        p.life -= 0.005;

        ctx.globalAlpha = Math.max(0, p.life);
        if (p.type === "heart") {
          drawHeart(p.x, p.y, p.size, p.color, p.rotation);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      });

      ctx.globalAlpha = 1;

      if (alive) {
        animFrame = requestAnimationFrame(animate);
      } else {
        canvas.style.display = "none";
      }
    };

    animate();

    setTimeout(() => {
      setShowMessage(true);
      if (messageRef.current) {
        gsap.from(messageRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(2)",
        });
      }

      setTimeout(() => {
        const footer = document.querySelector("footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 800);
    }, 1500);

    return () => cancelAnimationFrame(animFrame);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        duration: 1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-24 md:pt-32 pb-0 px-6 min-h-[60vh] flex flex-col items-center justify-center"
      style={{
        // overflow-hidden di sini saja cukup — TIDAK di body/html
        overflow: "hidden",
        background:
          "linear-gradient(to bottom, transparent 0%, hsl(var(--valentine-cream) / 0.15) 100%)",
      }}
    >
      {/* Canvas celebration: fixed agar tidak affect layout */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ display: "none" }}
      />

      <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-center mb-4 text-gradient-valentine">
        For You ✨
      </h2>
      <p className="text-center text-muted-foreground mb-12 font-sans-body">
        {!caught ? "Catch me! 😜" : ""}
      </p>

      {/*
        Container tombol:
        - overflow-hidden wajib ada di sini
        - position: relative + width fixed agar GSAP transform tidak melampaui batas
      */}
      <div
        ref={containerRef}
        className="relative w-full max-w-lg h-48 flex items-center justify-center rounded-2xl"
        style={{ overflow: "hidden" }}
      >
        {!caught && (
          <button
            ref={btnRef}
            onMouseEnter={handleMouseEnter}
            onClick={triggerCelebration}
            className="absolute px-6 py-4 rounded-full font-sans-body font-semibold text-lg text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            style={{
              width: `${BUTTON_W}px`,
              height: `${BUTTON_H}px`,
              background: `linear-gradient(135deg, hsl(var(--valentine-rose)), hsl(var(--valentine-gold)))`,
              left: "50%",
              top: "50%",
              marginLeft: `-${BUTTON_W / 2}px`,
              marginTop: `-${BUTTON_H / 2}px`,
              // Pastikan tidak ada transform awal yang aneh
              willChange: "transform",
            }}
          >
            Click Me 💕
          </button>
        )}
      </div>

      {showMessage && (
        <div
          ref={messageRef}
          className="mt-8 mb-16 max-w-lg text-center p-8 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, hsl(var(--valentine-cream)), hsl(var(--card)))`,
            boxShadow: `0 20px 60px -15px hsl(var(--valentine-rose) / 0.2)`,
          }}
        >
          <p className="text-2xl mb-2">🥰</p>
          <p className="font-serif-display text-xl md:text-2xl font-semibold text-primary mb-2">
            U got me sayang!
          </p>
          <p className="font-sans-body text-foreground/80 text-lg leading-relaxed">
            {surpriseMessage}
          </p>
        </div>
      )}
    </section>
  );
};

export default SurpriseSection;
