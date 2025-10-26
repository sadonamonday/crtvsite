import makoImg from "../assets/Mako-crtvshots.jpg";

export default function About() {
    return (
        <section className="py-16 px-6 md:px-20 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left: Placeholder text */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold">About Me</h2>
                    <p className="text-gray-300">
                        Hey! I'm Makomborero—Mako for short. I'm a multidisciplinary
                        creative based in Johannesburg, South Africa, working across
                        photography, colour grading, video editing, cinematography, and
                        directing.
                    </p>
                    <p className="text-gray-300">
                        I bring stories to life through visuals that resonate.
                        With a deep passion for raw, authentic storytelling, I’ve had the
                        privilege of collaborating with underground, up-and-coming
                        artists and mainstream helping them translate their visions into
                        powerful visuals. My mission is simple: to turn dreams into reality
                    </p>
                </div>

                {/* Right: Image */}
                <div className="w-full">
                    <img
                        src={makoImg}
                        alt="Mako-crtvshots"
                        className="w-full h-auto rounded-lg shadow-lg object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
