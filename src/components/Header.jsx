import { useState } from "react";
import { Menu, Maximize2 } from "lucide-react";
import logo from "../assets/logo.png";
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  // map current path to nav item label
  const pathToItem = (pathname) => {
    if (pathname === '/' || pathname === '') return 'HOME';
    if (pathname.startsWith('/booking')) return 'BOOKING';
    if (pathname.startsWith('/merch')) return 'MERCH';
    if (pathname.startsWith('/gallery')) return 'GALLERY';
    if (pathname.startsWith('/testimonials')) return 'TESTIMONIALS';
    if (pathname.startsWith('/about')) return 'ABOUT';
    return '';
  };

  const active = pathToItem(location.pathname);
  const navItems = ["HOME", "BOOKING", "MERCH", "GALLERY", "TESTIMONIALS", "ABOUT"];

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
              case "HOME": return "/";
              case "BOOKING": return "/booking";
              case "GALLERY": return "/gallery";
              case "MERCH": return "/merch";
              case "TESTIMONIALS": return "/testimonials";
              case "ABOUT": return "/about";
              default: return "#";
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

      {/* Right - Icons (kept commented) */}
      {/*<div className="flex items-center space-x-4">*/}
      {/*  <button className="p-2 hover:bg-white/10 rounded transition">*/}
      {/*    <Maximize2 size={18} />*/}
      {/*  </button>*/}
      {/*  <button className="p-2 hover:bg-white/10 rounded transition">*/}
      {/*    <Menu size={18} />*/}
      {/*  </button>*/}
      {/*</div>*/}
    </header>
  );
}
