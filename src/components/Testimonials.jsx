import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const testimonials = [
    { name: 'Client A', quote: 'Working with Blessing was transformative.' },
    { name: 'Client B', quote: 'Their eye for detail is unmatched.' },
];

export default function Testimonials() {
    return (
        <section className="py-16 px-6 md:px-20 bg-black text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">Testimonials</h2>

            <Swiper spaceBetween={20} slidesPerView={1} loop={true}>
                {testimonials.map((t, i) => (
                    <SwiperSlide key={i}>
                        <div className="text-center max-w-xl mx-auto">
                            <p className="italic text-lg">"{t.quote}"</p>
                            <p className="mt-4 font-bold">{t.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
