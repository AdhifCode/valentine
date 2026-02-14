import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import audioUrl from "../../assets/lagu.mp3";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;
    audio.loop = true;
    audio.muted = true;

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked sepenuhnya, tunggu interaksi user
      }
    };

    tryAutoplay();
  }, []);

  // Unmute otomatis saat user pertama kali berinteraksi dengan halaman
  useEffect(() => {
    if (hasInteracted) return;

    const handleFirstInteraction = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      setHasInteracted(true);

      // Jika audio belum play sama sekali (autoplay blocked), mulai play
      if (audio.paused) {
        try {
          audio.muted = false;
          await audio.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch {
          // tetap gagal
        }
      } else {
        // Audio sudah play dalam kondisi muted, unmute sekarang
        audio.muted = false;
        setIsMuted(false);
      }

      // Hapus listener setelah interaksi pertama
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      try {
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        // play gagal
      }
    } else {
      const newMuted = !audio.muted;
      audio.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, hsl(var(--valentine-rose) / 0.9), hsl(var(--valentine-maroon) / 0.9))`,
          color: "white",
        }}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 bg-white/80 rounded-full transition-all duration-300"
              style={{
                height:
                  !isMuted && isPlaying ? `${Math.random() * 12 + 4}px` : "4px",
                animation:
                  !isMuted && isPlaying
                    ? `equalizer${i} 0.5s ease-in-out infinite alternate`
                    : "none",
              }}
            />
          ))}
        </div>

        {isMuted || !isPlaying ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}

        <style>{`
          @keyframes equalizer1 { 0% { height: 4px; } 100% { height: 14px; } }
          @keyframes equalizer2 { 0% { height: 8px; } 100% { height: 16px; } }
          @keyframes equalizer3 { 0% { height: 6px; } 100% { height: 10px; } }
        `}</style>
      </button>
    </>
  );
};

export default AudioPlayer;
