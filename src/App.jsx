import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import CustomService from './pages/CustomService'; // <-- new import

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/custom" element={<CustomService />} /> {/* new route */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
