import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// YouTube video IDs for embedding
const videoIds = ['H8oF4yLO9Zw', 's8HTwvXLG94','MSkP0MEEyE4','AtvnwGUUL-s', 'n6i7p4Lgq70']; 

export default function MusicCarousel() {
    return (
        <section className="py-16 px-6 md:px-20 bg-gray-950 text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">CRTV SHOT IT</h2>

            <div className="relative">
                <Swiper 
                    spaceBetween={20} 
                    slidesPerView={1} 
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                    }}
                    modules={[Autoplay, Navigation, Pagination]}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                    }}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        }
                    }}
                >
                    {videoIds.map((id, index) => (
                        <SwiperSlide key={index}>
                            <div className="aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&showinfo=0&autoplay=0`}
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
                <div className="swiper-button-prev !text-white !bg-black/50 !rounded-full !w-12 !h-12 !mt-0 !top-1/2 !-translate-y-1/2 !left-2 hover:!bg-black/70 transition-all duration-300"></div>
                <div className="swiper-button-next !text-white !bg-black/50 !rounded-full !w-12 !h-12 !mt-0 !top-1/2 !-translate-y-1/2 !right-2 hover:!bg-black/70 transition-all duration-300"></div>
                
                {/* Pagination dots */}
                <div className="swiper-pagination !bottom-4"></div>
            </div>
        </section>
    );
}