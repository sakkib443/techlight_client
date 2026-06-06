'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiMessageSquare,
  FiImage,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiArrowLeft,
  FiGlobe,
  FiShoppingBag,
  FiAward,
  FiBarChart2,
  FiSettings,
  FiLayers,
  FiCode,
  FiPlay,
  FiStar,
  FiCreditCard,
  FiUserCheck,
  FiDownload,
  FiGrid,
  FiFileText,
  FiClipboard,
  FiBell,
  FiLock,
  FiTag,
  FiEdit3,
  FiPlus,
  FiInbox,
  FiHelpCircle,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'next/navigation';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState([]);
  const pathname = usePathname();
  const { isDark } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Exact match for active state
  const isActive = (href) => pathname === href;

  // Check if any child of a submenu is active (for parent highlight and auto-expand)
  const hasActiveChild = (submenu) => submenu?.some((s) => pathname === s.href);

  // Auto-expand parent menu when a child route is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu && hasActiveChild(item.submenu)) {
        setOpenMenus(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
      }
    });
  }, [pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const isMenuOpen = (menu) => openMenus.includes(menu);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: FiHome,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'LMS',
      icon: FiBook,
      gradient: 'from-amber-500 to-orange-500',
      submenu: [
        { title: 'All Courses', href: '/dashboard/admin/course', icon: FiBook },
        { title: 'Create Course', href: '/dashboard/admin/course/create', icon: FiFileText },
        // ──── Hidden Features (uncomment when needed) ────
        // { title: 'All Modules', href: '/dashboard/admin/module', icon: FiLayers },
        // { title: 'Create Module', href: '/dashboard/admin/module/create', icon: FiFileText },
        // { title: 'All Lessons', href: '/dashboard/admin/lesson', icon: FiPlay },
        // { title: 'Create Lesson', href: '/dashboard/admin/lesson/create', icon: FiFileText },
        // ──── End Hidden ────
      ],
    },
    {
      title: 'Certificates',
      icon: FiAward,
      gradient: 'from-yellow-500 to-orange-500',
      submenu: [
        { title: 'All Certificates', href: '/dashboard/admin/certification', icon: FiAward },
        { title: 'Certificate Batches', href: '/dashboard/admin/certification/batches', icon: FiLayers },
      ],
    },
    {
      title: 'Mentor',
      icon: FiUserCheck,
      gradient: 'from-teal-500 to-cyan-500',
      submenu: [
        { title: 'All Mentors', href: '/dashboard/admin/instructor', icon: FiUsers },
        { title: 'Add Mentor', href: '/dashboard/admin/instructor/create', icon: FiPlus },
      ],
    },
    // ──── Marketplace REMOVED (was: Websites + Design Templates) ────
    {
      title: 'Categories',
      icon: FiLayers,
      gradient: 'from-violet-500 to-purple-500',
      submenu: [
        { title: 'All Categories', href: '/dashboard/admin/category', icon: FiLayers },
        { title: 'Create Category', href: '/dashboard/admin/category/create', icon: FiFileText },
      ],
    },
    {
      title: 'Users',
      icon: FiUsers,
      gradient: 'from-blue-500 to-cyan-500',
      submenu: [
        { title: 'All Users', href: '/dashboard/admin/user', icon: FiUsers },
        { title: 'Create User', href: '/dashboard/admin/user/create', icon: FiFileText },
      ],
    },
    {
      title: 'Orders',
      href: '/dashboard/admin/orders',
      icon: FiShoppingBag,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Messages',
      href: '/dashboard/admin/messages',
      icon: FiInbox,
      gradient: 'from-[#E31E27] to-rose-500'
    },
    {
      title: 'Testimonials',
      href: '/dashboard/admin/testimonials',
      icon: FiMessageSquare,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'FAQ',
      href: '/dashboard/admin/faq',
      icon: FiHelpCircle,
      gradient: 'from-teal-500 to-emerald-500'
    },
    {
      title: 'Blog',
      icon: FiEdit3,
      gradient: 'from-red-500 to-cyan-500',
      submenu: [
        { title: 'All Blogs', href: '/dashboard/admin/blog', icon: FiEdit3 },
        { title: 'Create Blog', href: '/dashboard/admin/blog/create', icon: FiFileText },
      ],
    },
    {
      title: 'Site Content',
      icon: FiGlobe,
      gradient: 'from-indigo-500 to-purple-500',
      submenu: [
        { title: 'Home', href: '/dashboard/admin/design/home', icon: FiHome },
        { title: 'About Page', href: '/dashboard/admin/design/about', icon: FiUsers },
        { title: 'Contact Page', href: '/dashboard/admin/design/contact', icon: FiMessageSquare },
        { title: 'Payment Options', href: '/dashboard/admin/design/payment', icon: FiCreditCard },
      ],
    },
    {
      title: 'Settings',
      href: '/dashboard/admin/settings',
      icon: FiSettings,
      gradient: 'from-slate-500 to-slate-700'
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#E31E27] to-[#E31E27] text-white shadow-lg shadow-[#E31E27]/30 hover:shadow-xl hover:shadow-[#E31E27]/40 transition-all"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40
        ${isOpen ? 'w-72' : 'w-0 lg:w-72'} overflow-hidden
        ${isDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-slate-200'
          }`}
      >
        {/* Decorative Elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-[#E31E27]/10 to-transparent' : 'bg-gradient-to-br from-[#E31E27]/5 to-transparent'
          }`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-tr from-[#E31E27]/10 to-transparent' : 'bg-gradient-to-tr from-[#E31E27]/5 to-transparent'
          }`} />

        {/* Logo */}
        <div className={`relative px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="Techlight IT"
              className="h-12 w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Back to Website */}
        <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/5'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
            <span className="text-sm font-medium">Back to Website</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="relative px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <p className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Main Menu</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            /* SUBMENU */
            if (item.submenu) {
              const activeSub = hasActiveChild(item.submenu);
              const menuOpen = isMenuOpen(item.title);

              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                    ${activeSub
                        ? isDark
                          ? 'bg-gradient-to-r from-[#E31E27]/20 to-[#E31E27]/20 text-white'
                          : 'bg-gradient-to-r from-[#E31E27]/10 to-[#E31E27]/10 text-slate-800'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeSub
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                        : isDark
                          ? 'bg-slate-800 group-hover:bg-slate-700'
                          : 'bg-slate-200 group-hover:bg-slate-300'
                        } transition-all`}>
                        <Icon size={18} className={activeSub ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                      </div>
                      <span className="text-sm font-medium">{item.title}</span>
                    </span>
                    <FiChevronDown
                      className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                      size={16}
                    />
                  </button>

                  {/* Submenu Items */}
                  <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[800px] mt-1' : 'max-h-0'}`}>
                    <div className={`ml-6 pl-4 border-l-2 space-y-1 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                      {item.submenu.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = isActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                            ${isSubActive
                                ? 'bg-gradient-to-r from-[#E31E27] to-[#E31E27] text-white font-semibold shadow-lg shadow-[#E31E27]/30'
                                : isDark
                                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                              }`}
                          >
                            <SubIcon size={15} className={isSubActive ? 'text-white' : ''} />
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            /* NORMAL MENU */
            return (
              <div key={item.title || item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${isActive(item.href)
                      ? isDark
                        ? 'bg-gradient-to-r from-[#E31E27]/20 to-[#E31E27]/20 text-white'
                        : 'bg-gradient-to-r from-[#E31E27]/10 to-[#E31E27]/10 text-slate-800'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive(item.href)
                    ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                    : isDark
                      ? 'bg-slate-800 group-hover:bg-slate-700'
                      : 'bg-slate-200 group-hover:bg-slate-300'
                    } transition-all`}>
                    <Icon size={18} className={isActive(item.href) ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                  </div>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom - Logout Only */}
        <div className={`absolute bottom-0 left-0 w-full p-3 border-t backdrop-blur-sm ${isDark ? 'border-white/5 bg-slate-900/95' : 'border-slate-200 bg-white/95'
          }`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut size={16} />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
