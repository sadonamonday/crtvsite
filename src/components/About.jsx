
export default function About() {
    return (
        <section className="py-20 px-6 md:px-20 bg-gray-50 text-gray-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Text Content */}
                <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-green-900 leading-tight">
                        About <span className="text-red-800">CRTVSHOTS</span>
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        We direct, shoot, and edit music videos that bring sound to life through cinematic visuals.
                        Working with underground and emerging artists such as KindlyNxsh, Blxckie, Blaqbonez,
                        Pabi Cooper, Brotherkupa, Jaykatana, Shouldbeyuang and Shekhinah.
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                        We aim to capture more than just performance—we tell stories, build moods, and create visuals
                        that elevate the music.
                    </p>

                    {/* Optional Call-to-Action Button */}
                    <a
                        href="/about"
                        className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-gray-900 transition-all duration-300"
                    >
                        More About Us
                    </a>
                </div>

                {/* Right: Image */}
                <div className="relative group">
                    {/* Decorative background shape */}
                    <div className="absolute -top-5 -left-5 w-full h-full bg-gray-200 rounded-3xl transform rotate-2 transition-transform duration-300 group-hover:rotate-0"></div>

                    <img
                        src="Mako-crtvshots.jpg"
                        alt="Mako - CRTV Shots"
                        className="relative w-full h-auto rounded-3xl shadow-xl object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
