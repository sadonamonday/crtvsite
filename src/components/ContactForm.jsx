export default function ContactForm() {
    return (
        <section className="py-16 px-6 md:px-20 bg-gray-900 text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">Contact Me</h2>

            <form className="max-w-xl mx-auto space-y-6">
                <input type="text" placeholder="Name" className="w-full p-3 bg-black border border-white" />
                <input type="email" placeholder="Email" className="w-full p-3 bg-black border border-white" />
                <input type="text" placeholder="Subject" className="w-full p-3 bg-black border border-white" />
                <textarea placeholder="Message" rows="5" className="w-full p-3 bg-black border border-white" />
                <button type="submit" className="px-6 py-2 bg-white text-black font-bold">Send</button>
            </form>
        </section>
    );
}
