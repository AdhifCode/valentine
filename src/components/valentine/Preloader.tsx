import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    // Text fades in first
    tl.from(textRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power2.out",
    })
      // Hold for a moment
      .to(textRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: "power2.in",
        delay: 0.6,
      })
      // Curtains open
      .to(
        leftCurtainRef.current,
        {
          xPercent: -100,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "-=0.2"
      )
      .to(
        rightCurtainRef.current,
        {
          xPercent: 100,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "<"
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
    >
      {/* Left curtain */}
      <div
        ref={leftCurtainRef}
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background: "linear-gradient(135deg, hsl(345 100% 25%), hsl(350 60% 45%))",
          boxShadow: "4px 0 30px hsl(345 100% 15% / 0.5)",
        }}
      >
        {/* Curtain fold lines */}
        <div className="absolute inset-0 flex">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r"
              style={{
                borderColor: "hsl(345 80% 20% / 0.3)",
                background:
                  i % 2 === 0
                    ? "linear-gradient(180deg, transparent, hsl(345 80% 20% / 0.1), transparent)"
                    : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right curtain */}
      <div
        ref={rightCurtainRef}
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background: "linear-gradient(-135deg, hsl(345 100% 25%), hsl(350 60% 45%))",
          boxShadow: "-4px 0 30px hsl(345 100% 15% / 0.5)",
        }}
      >
        <div className="absolute inset-0 flex">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-l"
              style={{
                borderColor: "hsl(345 80% 20% / 0.3)",
                background:
                  i % 2 === 0
                    ? "linear-gradient(180deg, transparent, hsl(345 80% 20% / 0.1), transparent)"
                    : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Center text */}
      <div ref={textRef} className="relative z-10 text-center">
        <span className="font-serif-display text-4xl md:text-6xl font-bold text-primary-foreground drop-shadow-lg">
          💕 Happy Valentine 💕
        </span>
      </div>
    </div>
  );
};

export default Preloader;
