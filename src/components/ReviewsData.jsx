// src/components/ReviewsData.jsx
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                // Change to your actual endpoint URL
                const res = await fetch('http://crtvshotss.atwebpages.com/reviews/read.php');
                const data = await res.json();
                if (data.success) setReviews(data.data);
                else setError(data.message || 'Failed to load reviews');
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <section className="py-20 px-6 md:px-20 bg-[#121212] text-white">Loading reviews…</section>;
    if (error) return <section className="py-20 px-6 md:px-20 text-red-400">{error}</section>;
    if (reviews.length === 0) return <section className="py-20 px-6 md:px-20 text-gray-400">No reviews yet.</section>;

    return (
        <section className="py-20 px-6 md:px-20 bg-[#121212] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none"></div>
            <div className="relative max-w-5xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">reviews</h2>
                <p className="text-gray-400 mb-12 text-lg">
                    Hear from some of the incredible people I’ve had the chance to collaborate with.
                </p>
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet !bg-gray-500', bulletActiveClass: '!bg-white' }}
                    modules={[Autoplay, Pagination]}
                >
                    {reviews.map((t) => (
                        <SwiperSlide key={t.id}>
                            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-10 shadow-lg mx-auto max-w-3xl">
                                <p className="italic text-xl leading-relaxed text-gray-200">“{t.quote}”</p>
                                <div className="mt-6 text-gray-400 text-sm uppercase tracking-widest">— {t.name}
                                    {typeof t.rating === 'number' && t.rating > 0 ? (
                                        <span className="ml-2 text-yellow-400">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                                    ) : null}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}