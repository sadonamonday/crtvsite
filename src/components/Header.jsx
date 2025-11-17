import { useState, useContext, useEffect } from "react";
import logo from "../assets/Logo.png";
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
    const [showDropdown, setShowDropdown] = useState(false);
    const [sessionChecked, setSessionChecked] = useState(false);

    const pathToItem = (pathname) => {
        if (pathname === "/" || pathname === "") return "HOME";
        if (pathname.startsWith("/booking")) return "BOOKING";
        if (pathname.startsWith("/merch")) return "MERCHANDISE";
        if (pathname.startsWith("/gallery")) return "GALLERY";
        if (pathname.startsWith("/reviews")) return "REVIEWS";
        if (pathname.startsWith("/about")) return "ABOUT";
        if (pathname.startsWith("/admin")) return "ADMIN";
        return "";
    };

    const active = pathToItem(location.pathname);
    
    // Add ADMIN to nav items if user is admin
    const baseNavItems = ["HOME", "BOOKING", "MERCHANDISE", "GALLERY", "REVIEWS", "ABOUT"];
    const navItems = user?.is_admin === 1 
        ? [...baseNavItems, "ADMIN"] 
        : baseNavItems;

    // Check localStorage for user on mount
    useEffect(() => {
        if (!sessionChecked) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    console.log("User loaded from localStorage:", userData);
                    setUser(userData);
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                console.log("No user found in localStorage");
                setUser(null);
            }
            setSessionChecked(true);
        }
    }, [sessionChecked, setUser]);

    useEffect(() => {
        const detectBackground = () => {
            const header = document.querySelector("header");
            const elementUnder = document.elementFromPoint(window.innerWidth / 2, header.offsetHeight / 2);
            if (elementUnder) {
                const bg = window.getComputedStyle(elementUnder).backgroundColor;
                const rgb = bg.match(/\d+/g)?.map(Number);
                if (rgb) {
                    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
                    setIsDark(brightness < 160);
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

    useEffect(() => {
        if (menuOpen) setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await fetch("https://crtvshotss.atwebpages.com/sessions/logout_simple.php", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            localStorage.removeItem('user');
            setSessionChecked(false);
            navigate("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const getPath = (item) => {
        switch (item) {
            case "HOME": return "/";
            case "BOOKING": return "/booking";
            case "GALLERY": return "/gallery";
            case "MERCHANDISE": return "/merch";
            case "REVIEWS": return "/reviews";
            case "ABOUT": return "/about";
            case "ADMIN": return "/admin";
            default: return "#";
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
                {/* Logo */}
                <div className="flex items-center">
                    <div
                        className={`w-12 h-12 md:w-[70px] md:h-[70px] flex items-center justify-center rounded-lg transition ${
                            isDark ? "bg-white/10" : "bg-black/5"
                        }`}
                    >
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Nav (desktop) */}
                <nav className="hidden md:flex space-x-6 lg:space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item}
                            to={getPath(item)}
                            className={`relative text-xs lg:text-sm font-semibold tracking-wide uppercase transition-transform duration-200 ${
                                active === item
                                    ? isDark
                                        ? "text-red-800"
                                        : "text-black"
                                    : isDark
                                        ? "text-red-800 hover:text-white"
                                        : "text-gray-700 hover:text-black"
                            } hover:scale-110`} // ✨ scale on hover
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="hidden md:flex items-center space-x-6 relative">
                    {/* Cart */}
                    <button
                        onClick={() => navigate("/cart")}
                        className={`relative p-2 rounded-full transition-all ${
                            isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                        }`}
                    >
                        <ShoppingCartIcon className={`h-6 w-6 transition ${isDark ? "text-red-800" : "text-black"}`} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Profile or Login */}
                    {user ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <button
                                className={`flex items-center space-x-3 px-3 py-2 rounded-full transition ${
                                    isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
                                }`}
                            >
                                <img
                                    src={defaultProfilePic}
                                    alt="Profile"
                                    className={`h-8 w-8 rounded-full border ${isDark ? "border-white/40" : "border-black/40"}`}
                                />
                                <span className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>
                                    {user.firstname || user.email}
                                </span>
                            </button>

                            {showDropdown && (
                                <div
                                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border backdrop-blur-md ${
                                        isDark
                                            ? "bg-black/80 border-white/10 text-white"
                                            : "bg-white/80 border-black/10 text-black"
                                    }`}
                                >
                                    <div className="py-2 text-sm">
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="font-semibold">{user.firstname || "User"}</p>
                                            <p className="text-xs opacity-75">{user.email}</p>
                                            {user.is_admin === 1 && (
                                                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-600 text-white rounded">Admin</span>
                                            )}
                                        </div>
                                        {user.is_admin === 1 && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 hover:bg-white/10"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 hover:bg-white/10"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-500"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                                    isDark
                                        ? "bg-white/10 hover:bg-white/20 text-white"
                                        : "bg-black/10 hover:bg-black/20 text-black"
                                }`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                                    isDark
                                        ? "bg-red-800 hover:bg-red-700 text-white"
                                        : "bg-red-800 hover:bg-red-700 text-white"
                                }`}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile actions */}
                <div className="flex md:hidden items-center space-x-2">
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
                            <Bars3Icon className={`h-7 w-7 ${isDark ? "text-red-800" : "text-black"}`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
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
                                    className={`block rounded-md px-3 py-2 text-sm font-semibold uppercase transition-transform duration-200 hover:scale-105 ${
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

                        {user ? (
                            <div className="pt-3 border-t border-black/10 dark:border-white/10">
                                <div className="px-3 py-2 mb-2">
                                    <p className="font-semibold text-sm">{user.firstname || "User"}</p>
                                    <p className="text-xs opacity-75">{user.email}</p>
                                    {user.is_admin === 1 && (
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-600 text-white rounded">Admin</span>
                                    )}
                                </div>
                                {user.is_admin === 1 && (
                                    <Link
                                        to="/admin"
                                        className={`block px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                                            isDark
                                                ? "hover:bg-white/10 text-white"
                                                : "hover:bg-black/10 text-black"
                                        }`}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold transition-all text-red-500 ${
                                        isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                                    }`}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex space-x-3">
                                <Link
                                    to="/login"
                                    className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                                        isDark
                                            ? "bg-white/10 hover:bg-white/20 text-white"
                                            : "bg-black/10 hover:bg-black/20 text-black"
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                                        isDark
                                            ? "bg-red-800 hover:bg-red-700 text-white"
                                            : "bg-red-800 hover:bg-red-700 text-white"
                                    }`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
