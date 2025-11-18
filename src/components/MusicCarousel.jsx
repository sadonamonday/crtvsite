import { useEffect, useState } from "react";

const API_KEY = "AIzaSyBtwoYiS91VUqmFVAgBVhhQOEZaxhQqtQ4";
const PLAYLIST_ID = "PLt0fJ93Y4T4or_SqF7GybIBGZGjK8HG8t";

export default function MusicCarousel() {
    const [videos, setVideos] = useState([]);

    // Fetch YouTube Playlist
    useEffect(() => {
        async function fetchPlaylistVideos() {
            try {
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
                );
                const data = await res.json();
                setVideos(data.items || []);
            } catch (err) {
                console.error("Error fetching YouTube playlist:", err);
            }
        }

        fetchPlaylistVideos();
    }, []);

    return (
        <section className="py-20 px-6 md:px-20 bg-gray-100 text-gray-900">
            <h2 className="text-4xl font-bold mb-10 text-center tracking-tight">
                CRTV SHOT IT
            </h2>

            {/* GRID LAYOUT */}
            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-10
                "
            >
                {videos.length > 0 ? (
                    videos.map((video, index) => {
                        const vid = video.snippet.resourceId?.videoId;
                        const title = video.snippet.title;

                        return (
                            <div
                                key={vid || index}
                                className="
                                    relative
                                    aspect-video
                                    rounded-2xl
                                    overflow-hidden
                                    shadow-xl
                                    bg-black
                                    transform
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:shadow-2xl
                                "
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1&showinfo=0`}
                                    title={title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                    className="object-cover"
                                />

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white">
                                    <h3 className="text-xs md:text-sm font-semibold truncate">
                                        {title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        Loading videos...
                    </p>
                )}
            </div>
        </section>
    );
}
