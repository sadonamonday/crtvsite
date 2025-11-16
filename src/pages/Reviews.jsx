import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer.jsx';

const API_BASE = 'https://crtvshotss.atwebpages.com';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const userEmail = sessionStorage.getItem('user_email');
    setIsAuthenticated(!!userEmail);
    fetchServices();
  }, []);

  // Fetch services from admin endpoint (same as AdminDashboard)
  const fetchServices = async () => {
    try {
      const res = await fetch('https://crtvshotss.atwebpages.com/services_list.php');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServices(json.data);
        if (json.data.length > 0) {
          setSelectedServiceId(json.data[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading services:', e);
    }
  };

  // Fetch reviews when service changes
  useEffect(() => {
    if (!selectedServiceId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    fetchReviews();
  }, [selectedServiceId]);

  // Smooth carousel auto-scroll animation
  useEffect(() => {
    if (!isHovering && services.length > 0 && carouselRef.current) {
      const carousel = carouselRef.current;
      let currentPosition = carousel.scrollLeft || 0;

      const animate = () => {
        currentPosition += 0.8; // Smooth pixel-by-pixel movement
        carousel.scrollLeft = currentPosition;

        // Reset to start when reaching end (seamless loop)
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        if (currentPosition > maxScroll) {
          currentPosition = 0;
          carousel.scrollLeft = 0;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isHovering, services.length]);

  const handleArrowClick = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 200; // Pixels to scroll per click
      const carousel = carouselRef.current;
      const newPosition =
        direction === 'left'
          ? Math.max(carousel.scrollLeft - scrollAmount, 0)
          : carousel.scrollLeft + scrollAmount;

      carousel.scrollLeft = newPosition;
      setIsHovering(true); // Pause animation when user clicks
      setTimeout(() => setIsHovering(false), 3000); // Resume after 3 seconds
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_BASE}/reviews_read.php?service_id=${selectedServiceId}&limit=100`;
      const res = await fetch(url);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    // Check authentication
    const userEmail = sessionStorage.getItem('user_email');
    if (!userEmail) {
      navigate('/login');
      return;
    }

    if (!name.trim() || !quote.trim()) {
      setSubmitError('Name and review text are required');
      return;
    }

    if (quote.trim().length < 10) {
      setSubmitError('Review must be at least 10 characters');
      return;
    }

    if (!selectedServiceId) {
      setSubmitError('Please select a service');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        quote: quote.trim(),
        rating: Number(rating),
        service_id: selectedServiceId
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

  // Filter reviews by selected service (already done server-side, but for safety)
  const filteredReviews = useMemo(() => {
    // Server already filters by service_id, so just use reviews directly
    return reviews;
  }, [reviews]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-16 px-6 md:px-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            CLIENT <span className="text-green-400">TESTIMONIALS</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            See what clients loved about working with us on each service.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Reviews Section */}
          {filteredReviews && filteredReviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8">Featured Review</h2>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-green-900/20 to-transparent rounded-xl p-8 border border-green-400/30 shadow-lg shadow-green-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-green-400">{filteredReviews[0]?.name || 'Anonymous'}</h3>
                    <p className="text-gray-400 text-sm">Verified Client</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < (filteredReviews[0]?.rating || 5) ? 'text-yellow-400' : 'text-gray-700'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed italic">"{filteredReviews[0]?.quote || ''}"</p>
              </motion.div>
            </motion.div>
          )}

          {/* Service Filter Tabs */}
          {services.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Filter by Service</h2>
              
              {/* Service Carousel with Auto-Scroll */}
              <div className="relative group">
                {/* Left Arrow */}
                <button
                  onClick={() => handleArrowClick('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-500 hover:bg-green-600 text-black p-2 rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 duration-300"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Carousel Container */}
                <div
                  ref={carouselRef}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="flex gap-3 overflow-x-hidden scroll-smooth px-12 py-4 bg-gray-900/30 rounded-lg border border-gray-800/50"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setIsHovering(true);
                        setTimeout(() => setIsHovering(false), 3000);
                      }}
                      className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedServiceId === service.id
                          ? 'bg-green-500 text-black shadow-lg shadow-green-500/50 scale-105'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => handleArrowClick('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-500 hover:bg-green-600 text-black p-2 rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 duration-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Reviews Grid Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-2 text-center">
              {services.find(s => s.id === selectedServiceId)?.name} Reviews
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              {filteredReviews.length} verified reviews from happy clients
            </p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading reviews…</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No reviews yet for this service. Be the first to share!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -10 }}
                    className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-green-400/50 transition-all duration-300"
                  >
                    {/* Stars */}
                    <div className="flex justify-start mb-4">
                      {review.rating ? (
                        <div className="text-lg">
                          <span className="text-yellow-400">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Quote */}
                    <p className="italic text-gray-200 mb-6 line-clamp-4">
                      "{review.quote}"
                    </p>

                    {/* Author */}
                    <div className="pt-4 border-t border-gray-700">
                      <p className="font-semibold text-white">{review.name}</p>
                      <p className="text-xs text-gray-500">Verified Client</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Call to Action - Submit Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-20 border-t border-gray-800"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Share Your Experience</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {isAuthenticated
                  ? 'Have you worked with us? We\'d love to hear about your experience.'
                  : 'Sign in to submit your own review and share your experience with our community.'}
              </p>
            </div>

            {!showForm ? (
              <div className="text-center">
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-all duration-300 text-lg shadow-lg hover:shadow-green-500/50"
                  >
                    Write a Review
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-all duration-300 text-lg shadow-lg hover:shadow-green-500/50"
                  >
                    Sign In to Review
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 max-w-2xl mx-auto border border-gray-800"
              >
                <h3 className="text-3xl font-bold mb-8">Share Your Review</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Select Service *</label>
                    <select
                      value={selectedServiceId || ''}
                      onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none transition-colors"
                      disabled={submitting}
                    >
                      <option value="">Choose a service...</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-green-400 focus:outline-none transition-colors"
                      disabled={submitting}
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Your Review *</label>
                    <textarea
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Tell us about your experience working with CRTVSHOTS... (min 10 characters)"
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-green-400 focus:outline-none transition-colors resize-none"
                      rows="5"
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 mt-2">{quote.length} characters</p>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Rating</label>
                    <div className="flex gap-3 items-center">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRating(r)}
                          className={`text-4xl transition-colors ${
                            r <= rating ? 'text-yellow-400' : 'text-gray-600'
                          } hover:text-yellow-300`}
                          disabled={submitting}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Errors & Success */}
                  {submitError && (
                    <div className="bg-red-900/30 border border-red-600 rounded-lg p-4">
                      <p className="text-red-400 text-sm">{submitError}</p>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                      <p className="text-green-400 text-sm">{submitSuccess}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setSubmitError('');
                        setSubmitSuccess('');
                        setName('');
                        setQuote('');
                        setRating(5);
                      }}
                      disabled={submitting}
                      className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
