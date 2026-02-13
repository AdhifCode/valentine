import { useEffect, useRef } from "react";
import gsap from "gsap";

const FloatingHearts = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const hearts = ["❤️", "💕", "💗", "💖", "🩷", "🤍"];

    const createHeart = () => {
      const heart = document.createElement("span");
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 12}px;
        pointer-events: none;
        opacity: 0;
        left: ${Math.random() * 100}%;
        top: 100%;
      `;
      container.appendChild(heart);

      gsap.to(heart, {
        y: -(window.innerHeight + 100),
        x: `random(-80, 80)`,
        opacity: 0.6,
        duration: `random(6, 12)`,
        ease: "none",
        onComplete: () => heart.remove(),
      });

      gsap.to(heart, {
        opacity: 0,
        delay: `random(4, 9)`,
        duration: 2,
      });

      gsap.to(heart, {
        rotation: `random(-40, 40)`,
        duration: `random(2, 4)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    const interval = setInterval(createHeart, 800);
    // Create a few initially
    for (let i = 0; i < 6; i++) setTimeout(createHeart, i * 200);

    return () => {
      clearInterval(interval);
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default FloatingHearts;
