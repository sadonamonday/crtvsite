import makoImg from "../assets/Mako-crtvshots.jpg";

export default function About() {
    return (
        <section className="py-20 px-6 md:px-20 bg-gray-50 text-gray-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Text Content */}
                <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-green-900 leading-tight">
                        About <span className="text-red-800">Me</span>
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        Hey! I'm <span className="font-semibold text-gray-900">Makomborero</span> — Mako for short. I'm a
                        multidisciplinary creative based in Johannesburg, South Africa,
                        working across <span className="font-medium">photography, colour grading, video editing,
            cinematography,</span> and <span className="font-medium">directing</span>.
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                        I bring stories to life through visuals that resonate. With a deep
                        passion for <span className="italic">raw, authentic storytelling</span>, I’ve had the privilege
                        of collaborating with underground, up-and-coming artists and
                        established names — helping them translate their visions into
                        powerful visuals. My mission is simple:{" "}
                        <span className="font-semibold text-gray-900">
              to turn dreams into reality.
            </span>
                    </p>

                    {/* Optional Call-to-Action Button */}
                    <a
                        href="/about"
                        className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-gray-900 transition-all duration-300"
                    >
                        More About Me
                    </a>
                </div>

                {/* Right: Image */}
                <div className="relative group">
                    {/* Decorative background shape */}
                    <div className="absolute -top-5 -left-5 w-full h-full bg-gray-200 rounded-3xl transform rotate-2 transition-transform duration-300 group-hover:rotate-0"></div>

                    <img
                        src={makoImg}
                        alt="Mako - CRTV Shots"
                        className="relative w-full h-auto rounded-3xl shadow-xl object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
