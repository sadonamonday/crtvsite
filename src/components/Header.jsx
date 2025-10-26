import { useState } from "react";
import { Menu, Maximize2 } from "lucide-react";
import logo from "../assets/logo.png";

export default function Header() {
    const [active, setActive] = useState("HOME" );
    const navItems = ["HOME",  "BOOKING", "MERCH", "GALLERY", "TESTIMONIALS", "ABOUT"];

    return (
        <header className="absolute top-0 left-0 z-20 flex items-center justify-between w-full px-10 py-6 bg-transparent text-white">
            {/* Left - Logo Placeholder */}
            <div className="flex items-center space-x-2">
                <div className="bg-white/10 w-[70px] h-[70px] flex items-center justify-center rounded">
                    <span className="text-white font-bold text-lg tracking-widest">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </span>
                </div>
            </div>

            {/* Center - Navigation */}
            <nav className="flex space-x-8">
                {navItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActive(item)}
                        className={`relative text-sm font-semibold tracking-wide uppercase ${
                            active === item ? "text-white" : "text-gray-300"
                        } hover:text-white transition`}
                    >
                        {item}
                        {active === item && (
                            <span className="absolute left-1/2 -bottom-1 w-4 h-[2px] bg-white transform -translate-x-1/2" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Right - Icons */}
            {/*<div className="flex items-center space-x-4">*/}
            {/*    <button className="p-2 hover:bg-white/10 rounded transition">*/}
            {/*        <Maximize2 size={18} />*/}
            {/*    </button>*/}
            {/*    <button className="p-2 hover:bg-white/10 rounded transition">*/}
            {/*        <Menu size={18} />*/}
            {/*    </button>*/}
            {/*</div>*/}
        </header>
    );
}
