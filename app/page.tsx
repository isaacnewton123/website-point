import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import MusicPlayer from "@/components/MusicPlayer";
import AnniversarySection from "@/components/AnniversarySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <MusicPlayer />
      <AnniversarySection />
      <ContactSection />
      <Footer />
    </main>
  );
}
