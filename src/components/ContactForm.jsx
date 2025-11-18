


import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format message for WhatsApp
        const whatsappMessage = `
*New Contact Form Submission from CRTV Shots Website*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Subject:* ${formData.subject}
*Message:* ${formData.message}

*Sent via CRTV Shots Website*
        `.trim();

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Business WhatsApp number (replace with actual number)
        const whatsappNumber = '+27712345678'; // Replace with actual business number

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <section className="pt-32 pb-20 px-6 md:px-20 bg-gradient-to-b from-[#0e0e0f] to-[#1b1b1d] text-gray-100 min-h-screen">
            {/* Added pt-32 for top padding to avoid header overlap */}

            <h2 className="text-4xl font-bold mb-12 text-center tracking-tight text-[#E63946]">
                Contact Us
            </h2>

            <form
                className="max-w-2xl mx-auto space-y-6 bg-[#141414]/60 backdrop-blur-md p-10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#2b2b2b]"
                onSubmit={handleSubmit}
            >
                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
                        required
                    />
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300"
                        required
                    />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2 font-medium">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message..."
                        rows="5"
                        className="w-full p-3 rounded-lg bg-[#1f1f21] border border-[#2f2f31] focus:border-[#E63946] outline-none text-gray-200 placeholder-gray-500 transition-all duration-300 resize-none"
                        required
                    />
                </div>

                {/* Button */}
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="px-10 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-[#E63946] to-[#ff5c5c] hover:shadow-[0_0_25px_rgba(230,57,70,0.6)] transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                        </svg>
                        Send via WhatsApp
                    </button>
                </div>
            </form>
        </section>
    );
}