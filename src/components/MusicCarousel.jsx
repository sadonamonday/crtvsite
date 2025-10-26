import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Placeholder for YouTube API integration
const videoIds = ['dQw4w9WgXcQ', '3JZ_D3ELwOQ']; // Replace with dynamic fetch later

export default function MusicCarousel() {
    return (
        <section className="py-16 px-6 md:px-20 bg-gray-950 text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">CRTV SHOT IT</h2>

            <Swiper spaceBetween={20} slidesPerView={1} loop={true}>
                {videoIds.map((id, index) => (
                    <SwiperSlide key={index}>
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://youtube.com/playlist?list=PLt0fJ93Y4T4or_SqF7GybIBGZGjK8HG8t&si=soD-RzdvM69Ohh0t`}
                                title={`Music Video ${index + 1}`}
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 🔧 Later: Replace static IDs with YouTube API v3 fetch */}
        </section>
    );
}
