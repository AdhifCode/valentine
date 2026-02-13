import FloatingHearts from "@/components/valentine/FloatingHearts";
import HeroSection from "@/components/valentine/HeroSection";
import LoveLetter from "@/components/valentine/LoveLetter";
import PhotoGallery from "@/components/valentine/PhotoGallery";
import SurpriseSection from "@/components/valentine/SurpriseSection";
import AudioPlayer from "@/components/valentine/AudioPlayer";
import FooterSection from "@/components/valentine/FooterSection";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <FloatingHearts />
      <HeroSection />
      <LoveLetter />
      <PhotoGallery />
      <SurpriseSection />
      <FooterSection />
      <AudioPlayer />
    </main>
  );
};

export default Index;
