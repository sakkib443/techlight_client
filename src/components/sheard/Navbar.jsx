"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiMenu, BiX } from "react-icons/bi";
import {
  LuLogOut, LuLayoutDashboard, LuShoppingCart,
  LuUser, LuArrowRight, LuHeart
} from "react-icons/lu";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setTimeout(() => setUser(JSON.parse(storedUser)), 0);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setUser(null);
    closeMobileMenu();
    router.replace("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Menu items based on client requirements
  const menu = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed lg:hidden top-0 left-0 w-[85%] max-w-[320px] h-full bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight"><span className="text-[#7A85F0]">Tech</span><span className="text-gray-800">light</span></span>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest leading-tight">IT<br/>Institute</span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:text-[#7A85F0] transition-colors"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex-1 overflow-y-auto p-5">
                <nav className="space-y-1">
                  {menu.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobileMenu}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-[15px] font-medium ${
                        pathname === href
                          ? "bg-[#7A85F0]/10 text-[#7A85F0]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Auth Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7A85F0] text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-white shadow-md">
                      {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : (user.name?.charAt(0) || "U")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <button onClick={handleLogout} className="text-xs text-[#7A85F0] font-medium hover:underline">Sign Out</button>
                    </div>
                    <Link href="/dashboard/user" onClick={closeMobileMenu} className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                      <LuLayoutDashboard />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={closeMobileMenu} className="py-3 text-center rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-white transition-all">Sign In</Link>
                    <Link href="/register" onClick={closeMobileMenu} className="py-3 text-center rounded-xl bg-[#7A85F0] text-white font-semibold text-sm shadow-lg shadow-[#7A85F0]/20 hover:bg-[#5A65D0] transition-all">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isSticky
            ? "bg-white/95 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm"
            : "bg-white border-gray-100 py-4"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-[1440px]">
          <div className="flex items-center justify-between gap-6">

            {/* Left: Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <span className={`font-extrabold tracking-tight transition-all duration-300 ${isSticky ? 'text-xl' : 'text-2xl'}`}>
                  <span className="text-[#7A85F0]">Tech</span><span className="text-gray-800">light</span>
                </span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest leading-tight">IT<br/>Institute</span>
              </Link>
            </div>

            {/* Center: Navigation Links — Flat, No Dropdowns */}
            <div className="hidden lg:flex items-center gap-1">
              {menu.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-5 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                    pathname === href
                      ? "text-[#7A85F0] bg-[#7A85F0]/5"
                      : "text-gray-600 hover:text-[#7A85F0] hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 lg:gap-4">

              {/* Wishlist — circular border */}
              <Link href="#" className="hidden lg:flex relative w-11 h-11 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:text-[#7A85F0] hover:border-[#7A85F0] transition-all duration-300">
                <LuHeart size={18} />
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#7A85F0] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">0</span>
              </Link>

              {/* Cart — circular border */}
              <Link href="/cart" className="relative w-11 h-11 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:text-[#7A85F0] hover:border-[#7A85F0] transition-all duration-300">
                <LuShoppingCart size={18} />
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#7A85F0] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {mounted ? items.length : 0}
                </span>
              </Link>

              {/* Join Us Button / Profile */}
              {mounted && user ? (
                <div className="profile-dropdown-container relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-[#7A85F0]/30 overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#7A85F0] flex items-center justify-center text-white text-sm font-bold uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-5 border-b border-gray-100">
                          <p className="font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email || user.gmail}</p>
                        </div>
                        <div className="p-2">
                          <Link href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <LuLayoutDashboard size={16} />
                            <span>Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LuLogOut size={16} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : mounted ? (
                <Link href="/login" className="hidden sm:inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#7A85F0] hover:bg-[#5A65D0] text-white text-[14px] font-semibold transition-all duration-300 shadow-lg shadow-[#7A85F0]/25 hover:shadow-[#7A85F0]/40">
                  <span>Join Us</span>
                  <LuArrowRight size={16} />
                </Link>
              ) : (
                <div className="w-32 h-10 bg-gray-100 rounded-full animate-pulse hidden sm:block"></div>
              )}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-900 transition-all"
                onClick={toggleMobileMenu}
              >
                <BiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
