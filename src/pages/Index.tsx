import { useState } from "react";
import Preloader from "@/components/valentine/Preloader";
import FloatingHearts from "@/components/valentine/FloatingHearts";
import HeroSection from "@/components/valentine/HeroSection";
import ScrollMaskVideo from "@/components/valentine/ScrollMaskVideo";
import LoveLetter from "@/components/valentine/LoveLetter";
import PhotoGallery from "@/components/valentine/PhotoGallery";
import SurpriseSection from "@/components/valentine/SurpriseSection";
import AudioPlayer from "@/components/valentine/AudioPlayer";
import FooterSection from "@/components/valentine/FooterSection";
import CircularGallery from "@/components/valentine/CircularGallery";

const Index = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [surpriseCaught, setSurpriseCaught] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />
      <main className="relative min-h-screen bg-background overflow-x-hidden">
        <FloatingHearts />
        <HeroSection />
        <ScrollMaskVideo />
        <LoveLetter />
        <div style={{ height: "600px", position: "relative" }}>
          <CircularGallery
            bend={3}
            textColor="#FDE2E4"
            borderRadius={0.05}
            scrollEase={0.02}
            bend={1}
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
        <PhotoGallery />
        <div className="flex flex-col">
          <SurpriseSection onCaught={() => setSurpriseCaught(true)} />
          {surpriseCaught && <FooterSection />}
        </div>
        <AudioPlayer />
      </main>
    </>
  );
};

export default Index;
