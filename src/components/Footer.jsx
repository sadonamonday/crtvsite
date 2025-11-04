import { useEffect, useState } from "react";
import { Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const [isDark, setIsDark] = useState(true);

    // Detect brightness of the section above footer
    useEffect(() => {
        const detectBackground = () => {
            const footer = document.querySelector("footer");
            const elementAbove = document.elementFromPoint(window.innerWidth / 2, footer.offsetTop - 5);
            if (elementAbove) {
                const bg = window.getComputedStyle(elementAbove).backgroundColor;
                const rgb = bg.match(/\d+/g)?.map(Number);
                if (rgb) {
                    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
                    setIsDark(brightness < 160);
                }
            }
        };
        detectBackground();
        window.addEventListener("scroll", detectBackground);
        window.addEventListener("resize", detectBackground);
        return () => {
            window.removeEventListener("scroll", detectBackground);
            window.removeEventListener("resize", detectBackground);
        };
    }, []);

    return (
        <footer
            className={`w-full px-10 py-12 transition-all duration-500 ${
                isDark ? "bg-black text-white" : "bg-gray-100 text-black"
            }`}
        >
            {/* Top Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-8">
                {/* Logo and About */}
                <div className="space-y-3">
                    <img
                        src="/Logo.png"
                        alt="Logo"
                        className="w-16 h-16 object-contain"
                    />
                    <p
                        className={`text-sm leading-relaxed ${
                            isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        CRTV Shots captures timeless stories through film and photography.
                        Professional. Creative. Authentic.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul
                        className={`space-y-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                        <li><a href="/" className="hover:text-primary transition">Home</a></li>
                        <li><a href="/booking" className="hover:text-primary transition">Booking</a></li>
                        <li><a href="/gallery" className="hover:text-primary transition">Gallery</a></li>
                        <li><a href="/merch" className="hover:text-primary transition">Merchandise</a></li>
                        <li><a href="/reviews" className="hover:text-primary transition">reviews</a></li>
                        <li><a href="/about" className="hover:text-primary transition">About</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="font-semibold mb-4">Contact</h4>
                    <ul
                        className={`space-y-3 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                        <li className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>info@crtvshots.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>+27 71 234 5678</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>Germiston, South Africa</span>
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-5">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full transition ${
                                isDark
                                    ? "bg-white/10 hover:bg-white/20"
                                    : "bg-black/10 hover:bg-black/20"
                            }`}
                        >
                            <Instagram size={18} />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full transition ${
                                isDark
                                    ? "bg-white/10 hover:bg-white/20"
                                    : "bg-black/10 hover:bg-black/20"
                            }`}
                        >
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
           <div className=" border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>© 2025 CRTV SHOTS. All rights reserved.</p>
                </div>
        </footer>
    );
}
