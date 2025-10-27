import Hero from '../components/Hero';
import About from '../components/About';
import RecentWork from '../components/RecentWork';
import MusicCarousel from '../components/MusicCarousel';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      <RecentWork />
      <MusicCarousel />
      <Testimonials />
      <ContactForm />
    </div>
  );
}
