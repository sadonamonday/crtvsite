import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import Gallery from './pages/Gallery';
import MerchPage from './pages/MerchPage';
import ReviewsPage from './pages/Reviews.jsx';
import AboutPage from './pages/AboutPage';
import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ProductDetail from './pages/ProductDetail';
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login";
import Verify2FA from "./pages/Verify2fa.jsx";
import AdminDashboard from './pages/AdminDashboard.jsx';
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Contact from "./pages/ContactPage.jsx";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideHeader = isAdminRoute || location.pathname === '/login' || location.pathname === '/Verify2FA';

  return (
    <div className="relative min-h-screen">
      {!hideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Verify2FA" element={<Verify2FA />} />
          <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />

        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
