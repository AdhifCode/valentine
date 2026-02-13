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

const Index = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />
      <main className="relative min-h-screen bg-background overflow-x-hidden">
        <FloatingHearts />
        <HeroSection />
        <ScrollMaskVideo />
        <LoveLetter />
        <PhotoGallery />
        <SurpriseSection />
        <FooterSection />
        <AudioPlayer />
      </main>
    </>
  );
};

export default Index;
