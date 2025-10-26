import { Link } from 'react-router-dom';

export default function RecentWork() {
    return (
        <section id="recent-work" className="py-16 px-6 md:px-20 bg-black text-white">
            <h2 className="text-3xl font-semibold mb-8 text-center">Recent Work</h2>

            {/* 📷 MD Photos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {/* Replace with actual thumbnails */}
                <img src="/assets/md1.jpg" alt="MD Photo 1" />
                <img src="/assets/md2.jpg" alt="MD Photo 2" />
                <img src="/assets/md3.jpg" alt="MD Photo 3" />
            </div>

            <div className="text-center">
                <Link to="/gallery" className="underline text-lg">View Full Gallery</Link>
            </div>
        </section>
    );
}
