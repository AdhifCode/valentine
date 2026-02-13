import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { surpriseMessage } from "@/data/valentineData";

gsap.registerPlugin(ScrollTrigger);

const SurpriseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [caught, setCaught] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const maxEvades = 5;

  // Runaway button
  const handleMouseEnter = useCallback(() => {
    if (caught || !btnRef.current || !sectionRef.current) return;
    if (attempts >= maxEvades) return; // Let them click

    const section = sectionRef.current.getBoundingClientRect();
    const maxX = section.width - 160;
    const maxY = section.height - 60;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    gsap.to(btnRef.current, {
      x: newX - maxX / 2,
      y: newY - maxY / 2,
      duration: 0.3,
      ease: "power2.out",
    });

    setAttempts((p) => p + 1);
  }, [attempts, caught]);

  const triggerCelebration = () => {
    if (caught) return;
    setCaught(true);

    // Particle explosion
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; type: "heart" | "confetti";
      rotation: number; rotSpeed: number; life: number;
    }[] = [];

    const colors = [
      "hsl(350, 60%, 45%)", "hsl(0, 86%, 70%)", "hsl(33, 55%, 65%)",
      "hsl(345, 100%, 35%)", "hsl(0, 100%, 80%)", "hsl(330, 80%, 60%)",
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

    // Add falling hearts from top
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

    const drawHeart = (x: number, y: number, size: number, color: string, rot: number) => {
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

    // Show message after a delay
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
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ display: "none" }}
      />

      <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-center mb-4 text-gradient-valentine">
        Sebuah Kejutan ✨
      </h2>
      <p className="text-center text-muted-foreground mb-12 font-sans-body">
        {!caught ? "Coba tangkap tombolnya! 😜" : ""}
      </p>

      <div className="relative w-full max-w-lg h-48 flex items-center justify-center">
        {!caught && (
          <button
            ref={btnRef}
            onMouseEnter={handleMouseEnter}
            onClick={triggerCelebration}
            className="px-8 py-4 rounded-full font-sans-body font-semibold text-lg text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            style={{
              background: `linear-gradient(135deg, hsl(var(--valentine-rose)), hsl(var(--valentine-gold)))`,
            }}
          >
            Click Me 💕
          </button>
        )}
      </div>

      {showMessage && (
        <div
          ref={messageRef}
          className="mt-8 max-w-lg text-center p-8 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, hsl(var(--valentine-cream)), hsl(var(--card)))`,
            boxShadow: `0 20px 60px -15px hsl(var(--valentine-rose) / 0.2)`,
          }}
        >
          <p className="text-2xl mb-2">🥰</p>
          <p className="font-serif-display text-xl md:text-2xl font-semibold text-primary mb-2">
            Kamu berhasil menangkapnya!
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
