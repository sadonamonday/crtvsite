import React from 'react';
import Reviews from '../components/ReviewsData.jsx';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reviews />
      </div>
    </div>
  );
}
