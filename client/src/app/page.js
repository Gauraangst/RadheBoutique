import Hero from '@/components/Hero';
import FeaturedCollections from '@/components/FeaturedCollections';
import Bestsellers from '@/components/Bestsellers';
import AboutUs from '@/components/AboutUs';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import InstagramGallery from '@/components/InstagramGallery';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main>
        <Hero />
        <FeaturedCollections />
        <Bestsellers />
        <AboutUs />
        <WhyChooseUs />
        <Testimonials />
        <InstagramGallery />
      </main>
    </>
  );
}
