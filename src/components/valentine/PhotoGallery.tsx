import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photos } from "@/data/valentineData";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PhotoGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          ease: "back.out(1.5)",
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 15,
      rotateX: -y * 15,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleTiltReset = (card: HTMLDivElement) => {
    gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  };

  const navigateLightbox = (dir: number) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + photos.length) % photos.length;
    setLightboxIndex(next);
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-center mb-4 text-gradient-valentine">
          Memory Lane 📸
        </h2>
        <p className="text-center text-muted-foreground mb-16 font-sans-body">
          Kumpulan momen indah kita bersama
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" style={{ perspective: "1000px" }}>
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              style={{ transformStyle: "preserve-3d" }}
              onMouseMove={(e) => cardsRef.current[i] && handleTilt(e, cardsRef.current[i]!)}
              onMouseLeave={() => cardsRef.current[i] && handleTiltReset(cardsRef.current[i]!)}
              onClick={() => setLightboxIndex(i)}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-3 left-3 right-3 text-sm text-white font-sans-body opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none overflow-hidden">
          {lightboxIndex !== null && (
            <div className="relative">
              <img
                src={photos[lightboxIndex].url.replace("w=400&h=500", "w=800&h=1000")}
                alt={photos[lightboxIndex].caption}
                className="w-full max-h-[80vh] object-contain"
              />
              <p className="absolute bottom-4 left-0 right-0 text-center text-white font-sans-body text-lg">
                {photos[lightboxIndex].caption}
              </p>
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PhotoGallery;
