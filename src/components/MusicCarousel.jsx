import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef } from "react";

// YouTube video IDs
const videoIds = ["H8oF4yLO9Zw", "s8HTwvXLG94", "MSkP0MEEyE4", "AtvnwGUUL-s", "n6i7p4Lgq70"];

export default function MusicCarousel() {
    const swiperRef = useRef(null);

    useEffect(() => {
        // Detect YouTube player state via postMessage API
        const handleMessage = (event) => {
            if (typeof event.data === "string" && event.data.includes("playerState")) {
                const data = JSON.parse(event.data);
                const playerState = data.playerState;

                // 1 = playing, 2 = paused, 0 = ended
                if (playerState === 1 && swiperRef.current) {
                    swiperRef.current.autoplay.stop();
                } else if ((playerState === 2 || playerState === 0) && swiperRef.current) {
                    swiperRef.current.autoplay.start();
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <section className="py-16 px-6 md:px-20 bg-gray-950 text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">CRTV SHOT IT</h2>

            <div className="relative">
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    slidesPerView={1.3}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Navigation, Pagination]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    pagination={{
                        clickable: true,
                        el: ".swiper-pagination",
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2.3 },
                        1024: { slidesPerView: 3.3 },
                    }}
                >
                    {videoIds.map((id, index) => (
                        <SwiperSlide key={index}>
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 scale-90 swiper-slide-active:scale-110">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0`}
                                    title={`Music Video ${index + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation buttons */}
                <div className="swiper-button-prev !text-white !bg-black/50 !rounded-full !w-12 !h-12 !top-1/2 !-translate-y-1/2 !left-2 hover:!bg-black/70 transition-all duration-300"></div>
                <div className="swiper-button-next !text-white !bg-black/50 !rounded-full !w-12 !h-12 !top-1/2 !-translate-y-1/2 !right-2 hover:!bg-black/70 transition-all duration-300"></div>

                {/* Pagination */}
                <div className="swiper-pagination !bottom-4"></div>
            </div>
        </section>
    );
}
