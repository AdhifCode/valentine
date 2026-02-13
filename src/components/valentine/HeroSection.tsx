import { useEffect, useRef } from "react";
import gsap from "gsap";
import { heroData } from "@/data/valentineData";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bgLayer1 = useRef<HTMLDivElement>(null);
  const bgLayer2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(bgLayer1.current, { x: x * 30, y: y * 20, duration: 1, ease: "power2.out" });
      gsap.to(bgLayer2.current, { x: x * -15, y: y * -10, duration: 1, ease: "power2.out" });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Title reveal
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(titleRef.current, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    }).from(
      subtitleRef.current,
      { y: 30, opacity: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax BG layers */}
      <div
        ref={bgLayer1}
        className="absolute inset-0 -inset-x-20 -inset-y-20"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, hsl(var(--valentine-pink)) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, hsl(var(--valentine-rose) / 0.15) 0%, transparent 50%)`,
        }}
      />
      <div
        ref={bgLayer2}
        className="absolute inset-0 -inset-x-20 -inset-y-20"
        style={{
          background: `radial-gradient(ellipse at 80% 30%, hsl(var(--valentine-gold) / 0.2) 0%, transparent 40%),
                        radial-gradient(ellipse at 20% 70%, hsl(var(--valentine-maroon) / 0.08) 0%, transparent 40%)`,
        }}
      />

      {/* Large decorative hearts */}
      <div className="absolute top-10 left-10 text-6xl md:text-8xl opacity-[0.07] select-none pointer-events-none">💕</div>
      <div className="absolute bottom-20 right-10 text-7xl md:text-9xl opacity-[0.05] select-none pointer-events-none">❤️</div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1
          ref={titleRef}
          className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-valentine leading-tight mb-6"
        >
          {heroData.title}
        </h1>
        <p
          ref={subtitleRef}
          className="font-sans-body text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto"
        >
          {heroData.subtitle}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary/50" />
      </div>
    </section>
  );
};

export default HeroSection;
