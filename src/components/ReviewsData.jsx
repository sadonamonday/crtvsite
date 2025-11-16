// src/components/ReviewsData.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const API_BASE = 'https://crtvshotss.atwebpages.com';

export default function Reviews() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/reviews_read.php`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data || []);
            } else {
                setError(data.message || 'Failed to load reviews');
            }
        } catch (e) {
            setError('Unable to load reviews. Please try again later.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (!name.trim() || !quote.trim()) {
            setSubmitError('Name and review text are required');
            return;
        }

        if (quote.trim().length < 10) {
            setSubmitError('Review must be at least 10 characters');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: name.trim(),
                quote: quote.trim(),
                rating: Number(rating)
            };

            const res = await fetch(`${API_BASE}/reviews_create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setSubmitSuccess('✓ Review submitted! It will appear after approval.');
                setName('');
                setQuote('');
                setRating(5);
                setTimeout(() => {
                    setShowForm(false);
                    setSubmitSuccess('');
                }, 3000);
            } else {
                setSubmitError(data.message || 'Failed to submit review');
            }
        } catch (err) {
            setSubmitError('Server error. Please try again later.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 px-6 md:px-20 bg-[#121212] text-white">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-gray-400">Loading reviews…</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-6 md:px-20 bg-[#121212] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none"></div>
            <div className="relative max-w-5xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">reviews</h2>
                <p className="text-gray-400 mb-12 text-lg">
                    Hear from some of the incredible people I've had the chance to collaborate with.
                </p>

                {/* Submit Review Form */}
                <div className="mb-12">
                    {!showForm ? (
                        <button
                            onClick={() => navigate('/reviews')}
                            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
                        >
                            Write a Review
                        </button>
                    ) : (
                        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold mb-6">Share Your Experience</h3>
                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-[#0d0d0d] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none transition"
                                        disabled={submitting}
                                    />
                                </div>

                                {/* Review Text */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Your Review *</label>
                                    <textarea
                                        value={quote}
                                        onChange={(e) => setQuote(e.target.value)}
                                        placeholder="What was your experience? (10-1000 characters)"
                                        className="w-full bg-[#0d0d0d] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none transition resize-none"
                                        rows="4"
                                        disabled={submitting}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{quote.length} characters</p>
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setRating(r)}
                                                className={`text-2xl transition ${
                                                    r <= rating ? 'text-yellow-400' : 'text-gray-500'
                                                }`}
                                                disabled={submitting}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Errors */}
                                {submitError && (
                                    <p className="text-red-400 text-sm">{submitError}</p>
                                )}

                                {/* Success */}
                                {submitSuccess && (
                                    <p className="text-green-400 text-sm">{submitSuccess}</p>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        {submitting ? 'Submitting…' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setSubmitError('');
                                            setSubmitSuccess('');
                                        }}
                                        disabled={submitting}
                                        className="flex-1 bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Reviews Display */}
                {error ? (
                    <p className="text-red-400">{error}</p>
                ) : reviews.length === 0 ? (
                    <p className="text-gray-400">No reviews yet. Be the first to share!</p>
                ) : (
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={reviews.length > 1}
                        autoplay={reviews.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
                        pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet !bg-gray-500', bulletActiveClass: '!bg-white' }}
                        modules={[Autoplay, Pagination]}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id}>
                                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-10 shadow-lg mx-auto max-w-3xl">
                                    <p className="italic text-xl leading-relaxed text-gray-200">"{review.quote}"</p>
                                    <div className="mt-6 text-gray-400 text-sm uppercase tracking-widest">
                                        — {review.name}
                                        {review.rating ? (
                                            <span className="ml-2 text-yellow-400">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}