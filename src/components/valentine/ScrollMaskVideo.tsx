import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollMaskVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!maskRef.current) return;

      // Initial scale of the SVG mask — small heart in the center
      gsap.set(maskRef.current, { scale: 0.15 });

      // Scroll-driven scale animation
      // scrub: 1 controls smoothness (higher = smoother but laggier)
      // start/end controls how fast the zoom happens relative to scroll distance
      gsap.to(maskRef.current, {
        scale: 8, // Final scale — large enough to fill entire viewport
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // Controls the speed of enlargement — more height = slower zoom
          end: "bottom bottom",
          scrub: 1, // Smoothness factor for scroll tracking
          pin: false,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // Container height controls how long the scroll-zoom effect lasts
    // 250vh = 1.5x viewport of scrolling before the video fills the screen
    <section ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        {/* 
          Mask container — uses clip-path with an inline SVG heart shape.
          The heart SVG path is used as the clipping mask for the video.
        */}
        <div
          ref={maskRef}
          className="relative w-[80vmin] h-[80vmin] flex items-center justify-center"
          style={{
            // Heart-shaped clip-path using SVG path data
            clipPath: `path("M 250 450 
              C 250 450, 50 300, 50 175 
              C 50 80, 130 25, 200 25 
              C 230 25, 250 40, 250 40 
              S 270 25, 300 25 
              C 370 25, 450 80, 450 175 
              C 450 300, 250 450, 250 450 Z")`,
            // Normalize the path to the element's coordinate system
            clipRule: "evenodd",
          }}
        >
          {/* Video inside the heart mask */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            // Replace this src with your own video URL
            src="https://videos.pexels.com/video-files/3327513/3327513-uhd_2560_1440_30fps.mp4"
          />
        </div>

        {/* Decorative text behind the mask */}
        <p className="absolute font-serif-display text-2xl md:text-4xl text-muted-foreground/30 pointer-events-none select-none">
          Scroll untuk membuka hatiku 💕
        </p>
      </div>
    </section>
  );
};

export default ScrollMaskVideo;
