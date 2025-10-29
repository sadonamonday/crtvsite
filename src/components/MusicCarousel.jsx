import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";

const API_KEY = "AIzaSyBtwoYiS91VUqmFVAgBVhhQOEZaxhQqtQ4";
const PLAYLIST_ID = "PLt0fJ93Y4T4or_SqF7GybIBGZGjK8HG8t";

export default function MusicCarousel() {
    const swiperRef = useRef(null);
    const [videos, setVideos] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch YouTube Playlist
    useEffect(() => {
        async function fetchPlaylistVideos() {
            try {
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
                );
                const data = await res.json();
                setVideos(data.items || []);
            } catch (err) {
                console.error("Error fetching YouTube playlist:", err);
            }
        }

        fetchPlaylistVideos();
    }, []);

    // Pause autoplay when video plays
    useEffect(() => {
        const handleMessage = (event) => {
            if (typeof event.data === "string" && event.data.includes("playerState")) {
                const data = JSON.parse(event.data);
                const playerState = data.playerState;
                if (playerState === 1 && swiperRef.current) swiperRef.current.autoplay.stop();
                else if ((playerState === 2 || playerState === 0) && swiperRef.current)
                    swiperRef.current.autoplay.start();
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <section className="py-20 px-6 md:px-20 bg-gray-100 text-gray-900">
            <h2 className="text-4xl font-bold mb-10 text-center tracking-tight">
                CRTV SHOT IT
            </h2>

            <div className="relative">
                <Swiper
                    spaceBetween={40}
                    centeredSlides={true}
                    slidesPerView={1.2}
                    loop={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Navigation, Pagination]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    pagination={{
                        clickable: true,
                        el: ".swiper-pagination",
                    }}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3.2 },
                    }}
                    className="pb-16"
                >
                    {videos.length > 0 ? (
                        videos.map((video, index) => {
                            const vid = video.snippet.resourceId?.videoId;
                            const title = video.snippet.title;

                            return (
                                <SwiperSlide key={vid || index}>
                                    <div
                                        className={`relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-black transition-all duration-500 ${
                                            index === activeIndex ? "scale-105 z-20" : "scale-90 opacity-90"
                                        }`}
                                    >
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${vid}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0`}
                                            title={title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                        {/* Video title overlay */}
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-white">
                                            <h3 className="text-sm md:text-base font-semibold truncate">
                                                {title}
                                            </h3>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">
                            Loading videos...
                        </p>
                    )}
                </Swiper>

                {/* Navigation + Pagination below */}
                <div className="flex flex-col items-center gap-4 mt-10">
                    <div className="flex items-center gap-6">
                        <button className="swiper-button-prev !static !text-black !bg-white !rounded-full !w-12 !h-12 !shadow-md hover:!bg-gray-200 transition-all duration-300"></button>
                        <button className="swiper-button-next !static !text-black !bg-white !rounded-full !w-12 !h-12 !shadow-md hover:!bg-gray-200 transition-all duration-300"></button>
                    </div>
                    <div className="swiper-pagination !static"></div>
                </div>
            </div>
        </section>
    );
}
