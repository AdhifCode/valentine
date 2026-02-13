import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { footerData } from "@/data/valentineData";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-content", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="py-20 px-6 text-center">
      <div className="footer-content max-w-md mx-auto">
        {/* Pulsing heart */}
        <div className="text-5xl mb-6 animate-pulse">💗</div>
        <p className="font-serif-display text-2xl md:text-3xl font-bold text-primary mb-4">
          {footerData.message}
        </p>
        <p className="font-sans-body text-muted-foreground text-lg">
          {footerData.specialDate}
        </p>
        <div className="mt-8 flex justify-center gap-2">
          {["❤️", "🧡", "💛", "💚", "💙", "💜"].map((h, i) => (
            <span
              key={i}
              className="text-2xl"
              style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
            >
              {h}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
          }
        `}</style>
      </div>
    </footer>
  );
};

export default FooterSection;
