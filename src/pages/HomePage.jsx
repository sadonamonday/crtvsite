import Hero from '../components/Hero';
import About from '../components/About';
import RecentWork from '../components/RecentWork';
import MusicCarousel from '../components/MusicCarousel';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import Header from '../components/Header';

export default function HomePage() {
    return (
        <main className="bg-black text-white font-sans">
            <Header/>
            <Hero />
            <About />
            <RecentWork />
            <MusicCarousel />
            <Testimonials />
            <ContactForm />
        </main>
    );
}
