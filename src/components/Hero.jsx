import { Instagram, Youtube, Music } from "lucide-react";

import backgroundVideo from "../assets/backgroundVideo.mp4";
export default function Hero() {
    return (
        <div className="relative w-full h-screen bg-black text-white overflow-hidden">

            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Centered Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
                <h1 className="text-2xl md:text-4xl tracking-[0.25em] font-semibold uppercase">
                    ONE SHOT AT A TIME
                </h1>

                <div className="text-sm md:text-base text-gray-200 space-y-1">
                    <p>Videographer</p>
                    <p>Photographer</p>
                    <p>Director</p>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-6 pt-6">
                    <a href="https://www.instagram.com/crtvshots" className="hover:opacity-70 transition">
                        <Instagram size={22} />
                    </a>
                    <a href="https://www.youtube.com/@CRTVSHOTS" className="hover:opacity-70 transition">
                        <Youtube size={22} />
                    </a>
                    <a href="#" className="hover:opacity-70 transition">
                        <Music size={22} />
                    </a>
                </div>
            </div>
        </div>
    );
}
