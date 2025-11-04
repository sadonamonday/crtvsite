import { useState, useContext, useEffect } from "react";
import defaultProfilePic from "../assets/profile.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { cartCount } = useCart();
    const [isDark, setIsDark] = useState(false);

    const pathToItem = (pathname) => {
        if (pathname === "/" || pathname === "") return "HOME";
        if (pathname.startsWith("/booking")) return "BOOKING";
        if (pathname.startsWith("/merch")) return "MERCH";
        if (pathname.startsWith("/gallery")) return "GALLERY";
        if (pathname.startsWith("/reviews")) return "reviews";
        if (pathname.startsWith("/about")) return "ABOUT";
        return "";
    };

    const active = pathToItem(location.pathname);
    const navItems = ["HOME", "BOOKING", "MERCHANDISE", "GALLERY", "reviews", "ABOUT"];

    // 🧠 Detect background brightness behind header
    useEffect(() => {
        const detectBackground = () => {
            const header = document.querySelector("header");
            const elementUnder = document.elementFromPoint(window.innerWidth / 2, header.offsetHeight / 2);
            if (elementUnder) {
                const bg = window.getComputedStyle(elementUnder).backgroundColor;
                const rgb = bg.match(/\d+/g)?.map(Number);
                if (rgb) {
                    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
                    setIsDark(brightness < 160); // ⚙️ slightly higher threshold for better readability
                }
            }
        };

        detectBackground();
        window.addEventListener("scroll", detectBackground);
        window.addEventListener("resize", detectBackground);
        return () => {
            window.removeEventListener("scroll", detectBackground);
            window.removeEventListener("resize", detectBackground);
        };
    }, []);

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
        <header
            className={`fixed top-0 left-0 z-20 flex items-center justify-between w-full px-10 py-6 backdrop-blur-md transition-all duration-500 ${
                isDark
                    ? "text-white bg-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                    : "text-black bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
            }`}
        >
            {/* Left - Logo */}
            <div className="flex items-center space-x-2">
                <div
                    className={`w-[70px] h-[70px] flex items-center justify-center rounded-lg transition ${
                        isDark ? "bg-white/10" : "bg-black/5"
                    }`}
                >
                    <img src=/logo.png alt="Logo" className="w-full h-full object-contain" />
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
                            case "reviews":
                                return "/reviews";
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
                            className={`relative text-sm font-semibold tracking-wide uppercase transition-all ${
                                active === item
                                    ? isDark
                                        ? "text-red-800"
                                        : "text-black"
                                    : isDark
                                        ? "text-red-800 hover:text-white"
                                        : "text-gray-700 hover:text-black"
                            }`}
                        >
                            {item}
                            {active === item && (
                                <span
                                    className={`absolute left-1/2 -bottom-1 w-4 h-[2px] transform -translate-x-1/2 ${
                                        isDark ? "text-red-800" : "bg-black"
                                    }`}
                                />
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
                    className={`relative p-2 rounded-full transition-all ${
                        isDark
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-black/10 hover:bg-black/20"
                    }`}
                >
                    <ShoppingCartIcon
                        className={`h-6 w-6 transition ${isDark ? "text-red-800" : "text-black"}`}
                    />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-red-800 text-xs font-bold rounded-full px-1.5">
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
                            className={`h-8 w-8 rounded-full border transition ${
                                isDark ? "border-white/40" : "border-black/40"
                            }`}
                        />
                        <span className="text-sm">{user.user_firstname}</span>
                        <button
                            onClick={handleLogout}
                            className={`text-xs font-semibold transition ${
                                isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                            }`}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <img
                            src={defaultProfilePic}
                            alt="Profile"
                            className={`h-8 w-8 rounded-full border transition ${
                                isDark ? "border-white/40" : "border-black/40"
                            }`}
                        />
                        <Link
                            to="/login"
                            className={`text-sm transition ${
                                isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                            }`}
                        >
                            Login / Signup
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
