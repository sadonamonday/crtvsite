


import React from "react";
import { Link } from "react-router-dom";

export default function RecentWork() {
    // Photography data from your Gallery page
    const portfolioData = {
        street: [
            { id: "street1", type: "image", src: "https://i.pinimg.com/736x/0b/36/1b/0b361b0bd9a37a8dbc507f3d87b771bb.jpg", caption: "City Life Moments", category: "street", aspect: "portrait", comingSoon: false },
            { id: "street2", type: "image", src: "https://i.pinimg.com/736x/ca/4c/3d/ca4c3d99ec1f116829085f297e19081e.jpg", caption: "Urban Exploration", category: "street", aspect: "portrait", comingSoon: false },
            { id: "street3", type: "image", src: "https://i.pinimg.com/736x/78/c9/ea/78c9eaf18b002f146c8418acd1e92178.jpg", caption: "Cityscape Stories", category: "street", aspect: "portrait", comingSoon: false }
        ],
        lifestyle: [
            { id: "lifestyle1", type: "image", src: "https://i.pinimg.com/736x/44/39/87/443987dfaa6123232313b6e35a14a965.jpg", caption: "Sacred Moments", category: "lifestyle", aspect: "portrait", comingSoon: false },
            { id: "lifestyle2", type: "image", src: "https://i.pinimg.com/736x/f0/dc/00/f0dc0063923a50011fa719393f473711.jpg", caption: "Real Moments Captured", category: "lifestyle", aspect: "portrait", comingSoon: false },
            { id: "lifestyle3", type: "image", src: "https://i.pinimg.com/736x/d3/1c/68/d31c686cc9086e703792e770f162408f.jpg", caption: "Daily Life", category: "lifestyle", aspect: "portrait", comingSoon: false }
        ],
        urbanFashion: [
            { id: "fashion1", type: "image", src: "https://i.pinimg.com/736x/f1/67/43/f167434b585fc493bac0e7edf4adf160.jpg", caption: "Urban Fashion", category: "urbanFashion", aspect: "portrait", comingSoon: false },
            { id: "fashion2", type: "image", src: "https://i.pinimg.com/736x/5e/67/f7/5e67f72aa24e4155e53f77345586f667.jpg", caption: "Street Style Fashion", category: "urbanFashion", aspect: "portrait", comingSoon: false }
        ],
        services: [
            { id: "service1", type: "image", src: "/Images/services/services/birthdayparty.jpg", caption: "Birthday Photography", category: "services", aspect: "portrait", comingSoon: false },
            { id: "service2", type: "image", src: "/Images/services/services/commercialphoto.jpg", caption: "Commercial Photography", category: "services", aspect: "portrait", comingSoon: false },
            { id: "service3", type: "image", src: "/Images/services/services/personalphoto.jpg", caption: "Personal Photography", category: "services", aspect: "portrait", comingSoon: false }
        ]
    };

    // Combine images from all categories for the homepage
    const featuredImages = [
        ...portfolioData.street,
        ...portfolioData.lifestyle,
        ...portfolioData.urbanFashion,
        ...portfolioData.services
    ].slice(0, 9); // Show 9 images total

    return (
        <section id="recent-work" className="py-20 px-6 md:px-20 bg-[#121212] text-white relative">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-white">
                        Recent Work
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                        A glimpse into my latest creative projects — capturing stories, emotions, and moments through every frame.
                    </p>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                    {featuredImages.map((image, idx) => (
                        <div
                            key={image.id}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src={image.src}
                                    alt={image.caption}
                                    loading="lazy"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                            </div>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                                <div className="p-4 w-full">
                                    <p className="text-white text-sm font-medium">{image.caption}</p>
                                    <p className="text-gray-300 text-xs capitalize">{image.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="text-center">
                    <Link
                        to="/gallery"
                        className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300"
                    >
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
}