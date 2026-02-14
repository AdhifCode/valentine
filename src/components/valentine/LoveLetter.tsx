import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loveLetterLines } from "@/data/valentineData";

gsap.registerPlugin(ScrollTrigger);

const LoveLetter = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.05,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="pb-24 pt-0 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-center mb-16 text-gradient-valentine">
          Surat Cinta 💌
        </h2>
        <div
          className="relative rounded-2xl p-8 md:p-12"
          style={{
            background: `linear-gradient(135deg, hsl(var(--valentine-cream)), hsl(var(--card)))`,
            boxShadow: `0 20px 60px -15px hsl(var(--valentine-rose) / 0.15)`,
          }}
        >
          {/* Decorative quote mark */}
          <span className="absolute top-4 left-6 text-6xl font-serif-display text-primary/10 select-none leading-none">
            "
          </span>
          <div className="space-y-1 pt-8">
            {loveLetterLines.map((line, i) => (
              <p
                key={i}
                ref={(el) => {
                  linesRef.current[i] = el;
                }}
                className={`font-sans-body text-base md:text-lg leading-relaxed ${
                  line === ""
                    ? "h-4"
                    : line.startsWith("—")
                      ? "text-primary font-medium italic mt-4"
                      : line.endsWith(",") && i === 0
                        ? "font-serif-display text-xl md:text-2xl text-primary font-semibold"
                        : "text-foreground/80"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveLetter;
