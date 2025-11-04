import Hero from '../components/Hero';
import About from '../components/About';
import RecentWork from '../components/RecentWork';
import MusicCarousel from '../components/MusicCarousel';
import Reviews from '../components/ReviewsData.jsx';
import ContactForm from '../components/ContactForm';
import Footer from "../components/Footer.jsx";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      <RecentWork />
      <MusicCarousel />
      <Reviews />
      <ContactForm />
      <Footer />
    </div>
  );
}
