import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
    {
        name: "Thando",
        quote: "Working with CRTVSHOTS was amazing. The visuals captured the soul of our brand perfectly.",
    },
    {
        name: "Blxckie",
        quote: "Their eye for detail is unmatched — everything feels intentional and cinematic.",
    },
    {
        name: "shekinah",
        quote: "A visionary creative who brings authenticity and energy into every frame.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 px-6 md:px-20 bg-[#121212] text-white relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none"></div>

            <div className="relative max-w-5xl mx-auto text-center">
                {/* Section Title */}
                <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">
                    Testimonials
                </h2>
                <p className="text-gray-400 mb-12 text-lg">
                    Hear from some of the incredible people I’ve had the chance to collaborate with.
                </p>

                {/* Swiper Carousel */}
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        bulletClass: "swiper-pagination-bullet !bg-gray-500",
                        bulletActiveClass: "!bg-white",
                    }}
                    modules={[Autoplay, Pagination]}
                >
                    {testimonials.map((t, i) => (
                        <SwiperSlide key={i}>
                            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-10 shadow-lg mx-auto max-w-3xl">
                                <p className="italic text-xl leading-relaxed text-gray-200">
                                    “{t.quote}”
                                </p>
                                <div className="mt-6 text-gray-400 text-sm uppercase tracking-widest">
                                    — {t.name}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
