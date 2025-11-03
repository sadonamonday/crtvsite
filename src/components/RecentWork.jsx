import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecentWork() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchImages = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("https://crtvshotss.atwebpages.com/gallery_list.php", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                if (!cancelled) {
                    if (data.success && Array.isArray(data.images)) {
                        setImages(data.images);
                    } else {
                        throw new Error("Invalid response format");
                    }
                }
            } catch (err) {
                console.error("Error fetching gallery images:", err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchImages();
        return () => {
            cancelled = true;
        };
    }, []);

    const visibleImages = images.slice(0, 9);

    return (
        <section id="recent-work" className="py-20 px-6 md:px-20 bg-[#121212] text-white relative">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-white">
                        Recent Work
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                        A glimpse into my latest creative projects — capturing stories, emotions, and motion through every frame.
                    </p>
                </div>

                {/* Error Notice */}
                {error && (
                    <div className="text-red-400 text-sm mb-6 text-center bg-red-900/20 py-2 rounded-lg">
                        Using fallback images due to connection issue
                    </div>
                )}

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-40">
                        <div className="text-gray-300 text-lg font-medium animate-pulse">
                            Loading recent work...
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                        {visibleImages.map((image, idx) => (
                            <div
                                key={idx}
                                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    src={image.url || image}
                                    alt={image.alt || `Recent ${idx + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Button */}
                <div className="text-center">
                    <Link
                        to="/gallery"
                        className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300"
                    >
                        View More
                    </Link>
                </div>
            </div>
        </section>
    );
}
