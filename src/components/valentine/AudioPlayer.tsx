import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { audioUrl } from "@/data/valentineData";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    audio.loop = true;

    // Try autoplay (will likely be blocked by browser)
    const tryPlay = async () => {
      try {
        audio.muted = true;
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked, user needs to interact
      }
    };
    tryPlay();
  }, []);

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
        // play failed
      }
    } else {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
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
        {/* Equalizer bars */}
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 bg-white/80 rounded-full transition-all duration-300"
              style={{
                height: !isMuted && isPlaying ? `${Math.random() * 12 + 4}px` : "4px",
                animation: !isMuted && isPlaying ? `equalizer${i} 0.5s ease-in-out infinite alternate` : "none",
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
