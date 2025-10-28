import { useState, useContext } from "react";
import { Menu, Maximize2 } from "lucide-react";
import logo from "../assets/logo.png";
import defaultProfilePic from "../assets/profile.png"; // ✅ Correct path
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { cartCount } = useCart();

  // Map pathnames to nav item labels
  const pathToItem = (pathname) => {
    if (pathname === "/" || pathname === "") return "HOME";
    if (pathname.startsWith("/booking")) return "BOOKING";
    if (pathname.startsWith("/merch")) return "MERCH";
    if (pathname.startsWith("/gallery")) return "GALLERY";
    if (pathname.startsWith("/testimonials")) return "TESTIMONIALS";
    if (pathname.startsWith("/about")) return "ABOUT";
    return "";
  };

  const active = pathToItem(location.pathname);
  const navItems = ["HOME", "BOOKING", "MERCHANDISE", "GALLERY", "TESTIMONIALS", "ABOUT"];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost/crtvsite/backend/users/logout.php", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="absolute top-0 left-0 z-20 flex items-center justify-between w-full px-10 py-6 bg-transparent text-white">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-white/10 w-[70px] h-[70px] flex items-center justify-center rounded">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Center - Navigation */}
      <nav className="flex space-x-8">
        {navItems.map((item) => {
          const getPath = (item) => {
            switch (item) {
              case "HOME":
                return "/";
              case "BOOKING":
                return "/booking";
              case "GALLERY":
                return "/gallery";
              case "MERCHANDISE":
                return "/merch";
              case "TESTIMONIALS":
                return "/testimonials";
              case "ABOUT":
                return "/about";
              default:
                return "#";
            }
          };

          return (
            <Link
              key={item}
              to={getPath(item)}
              className={`relative text-sm font-semibold tracking-wide uppercase ${
                active === item ? "text-white" : "text-gray-300"
              } hover:text-white transition`}
            >
              {item}
              {active === item && (
                <span className="absolute left-1/2 -bottom-1 w-4 h-[2px] bg-white transform -translate-x-1/2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right - Profile & Cart */}
      <div className="flex items-center space-x-6">
        {/* Cart Icon */}
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ShoppingCartIcon className="h-6 w-6 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile Icon / Login */}
        {user ? (
          <div className="flex items-center space-x-2">
            <img
              src={defaultProfilePic}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-white/40"
            />
            <span className="text-sm">{user.user_firstname}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-300 hover:text-white font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <img
              src={defaultProfilePic}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-white/40"
            />
            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
              Login / Signup
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
