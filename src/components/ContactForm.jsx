export default function ContactForm() {
    return (
        <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#0e0e0f] to-[#1b1b1d] text-gray-100">
            <h2 className="text-4xl font-bold mb-12 text-center tracking-tight text-[#E63946]">
                Contact Me
            </h2>

            <form
                className="max-w-2xl mx-auto space-y-6 bg-[#141414]/60 backdrop-blur-md p-10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#2b2b2b]"
                onSubmit={(e) => e.preventDefault()}
            >
                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
                    />
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Subject</label>
                    <input
                        type="text"
                        placeholder="What’s this about?"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
                    />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Message</label>
                    <textarea
                        placeholder="Write your message..."
                        rows="5"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300 resize-none"
                    />
                </div>

                {/* Button */}
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="px-10 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-[#E63946] to-[#ff5c5c] hover:shadow-[0_0_25px_rgba(230,57,70,0.6)] transition-all duration-300"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </section>
    );
}
