import { useState, useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import defaultProfilePic from "../assets/profile.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { cartCount } = useCart();
    const [isDark, setIsDark] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const pathToItem = (pathname) => {
        if (pathname === "/" || pathname === "") return "HOME";
        if (pathname.startsWith("/booking")) return "BOOKING";
        if (pathname.startsWith("/merch")) return "MERCHANDISE";
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

    // Close mobile menu on route change
    useEffect(() => {
        if (menuOpen) setMenuOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

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
        <header
            className={`fixed top-0 left-0 z-20 w-full backdrop-blur-md transition-all duration-500 ${
                isDark
                    ? "text-white bg-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                    : "text-black bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
            }`}
        >
            <div className="mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-4 md:py-6">
                {/* Left - Logo */}
                <div className="flex items-center">
                    <div
                        className={`w-12 h-12 md:w-[70px] md:h-[70px] flex items-center justify-center rounded-lg transition ${
                            isDark ? "bg-white/10" : "bg-black/5"
                        }`}
                    >
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Center - Navigation (desktop) */}
                <nav className="hidden md:flex space-x-6 lg:space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item}
                            to={getPath(item)}
                            className={`relative text-xs lg:text-sm font-semibold tracking-wide uppercase transition-all ${
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
                                        isDark ? "bg-red-800" : "bg-black"
                                    }`}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right - Profile & Cart (desktop) */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Cart Icon */}
                    <button
                        onClick={() => navigate("/cart")}
                        className={`relative p-2 rounded-full transition-all ${
                            isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                        }`}
                    >
                        <ShoppingCartIcon
                            className={`h-6 w-6 transition ${isDark ? "text-red-800" : "text-black"}`}
                        />
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

                {/* Right - Mobile actions */}
                <div className="flex md:hidden items-center space-x-2">
                    {/* Cart */}
                    <button
                        onClick={() => navigate("/cart")}
                        className={`relative p-2 rounded-full transition-all ${
                            isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                        }`}
                        aria-label="Open cart"
                    >
                        <ShoppingCartIcon className={`h-6 w-6 ${isDark ? "text-red-800" : "text-black"}`} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className={`p-2 rounded-md transition ${
                            isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                        }`}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <XMarkIcon className={`h-7 w-7 ${isDark ? "text-red-800" : "text-black"}`} />
                        ) : (
                            <Bars3Icon className={`h-7 w-7 ${isDark ? "text-red-800" : "text-black"}`} />)
                        }
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div
                    className={`md:hidden w-full border-t backdrop-blur-md ${
                        isDark
                            ? "bg-black/50 border-white/10 text-white"
                            : "bg-white/80 border-black/10 text-black"
                    }`}
                >
                    <div className="px-4 sm:px-6 py-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item}
                                    to={getPath(item)}
                                    className={`block rounded-md px-3 py-2 text-sm font-semibold uppercase transition ${
                                        active === item
                                            ? isDark
                                                ? "bg-white/10 text-white"
                                                : "bg-black/10 text-black"
                                            : isDark
                                                ? "hover:bg-white/10 text-red-800 hover:text-white"
                                                : "hover:bg-black/10 text-gray-700 hover:text-black"
                                    }`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        <div className={`${isDark ? 'bg-white/10' : 'bg-black/10'} h-px w-full my-2`} />

                        {/* Profile/Login area */}
                        {user ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={defaultProfilePic}
                                        alt="Profile"
                                        className={`h-8 w-8 rounded-full border ${
                                            isDark ? "border-white/40" : "border-black/40"
                                        }`}
                                    />
                                    <span className="text-sm">Hi, {user.user_firstname}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`text-xs font-semibold px-3 py-1 rounded-md ${
                                        isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                                    }`}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={defaultProfilePic}
                                        alt="Profile"
                                        className={`h-8 w-8 rounded-full border ${
                                            isDark ? "border-white/40" : "border-black/40"
                                        }`}
                                    />
                                    <span className="text-sm">Guest</span>
                                </div>
                                <Link
                                    to="/login"
                                    className={`text-xs font-semibold px-3 py-1 rounded-md ${
                                        isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                                    }`}
                                >
                                    Login / Signup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
