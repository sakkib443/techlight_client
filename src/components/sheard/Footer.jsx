/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { LuSend, LuArrowUpRight, LuHeart, LuGraduationCap } from "react-icons/lu";
import { API_BASE_URL } from "@/config/api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/designs/contact`);
        const data = await res.json();
        if (data.success && data.data) {
          setContactData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };
    fetchContactInfo();
  }, []);

  const phone = contactData?.contactContent?.contactInfo?.phone || "+880 1XXX-XXXXXX";
  const emailAddr = contactData?.contactContent?.contactInfo?.email || "info@techlightit.com";
  const address = contactData?.contactContent?.contactInfo?.address || "Dhaka, Bangladesh";
  const social = contactData?.contactContent?.socialLinks || {};

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/courses", label: "Courses" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/faq", label: "FAQ" },
  ];

  const categories = [
    { key: "Programming", label: "Programming" },
    { key: "Digital Marketing", label: "Digital Marketing" },
    { key: "Art & Design", label: "Art & Design" },
    { key: "Networking", label: "Networking" },
    { key: "Database", label: "Database" },
    { key: "Language Skills", label: "Language Skills" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: social.facebook || "#", label: "Facebook", color: "#1877F2" },
    { icon: FaLinkedinIn, href: social.linkedin || "#", label: "LinkedIn", color: "#0A66C2" },
    { icon: FaYoutube, href: social.youtube || "#", label: "YouTube", color: "#FF0000" },
    { icon: FaInstagram, href: social.instagram || "#", label: "Instagram", color: "#E4405F" },
    { icon: FaWhatsapp, href: social.whatsapp || "#", label: "WhatsApp", color: "#25D366" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#7A85F0]/[0.06] rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#7A85F0]/[0.04] rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7A85F0]/[0.03] rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(122,133,240,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(122,133,240,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Top CTA Banner */}
      <div className="relative border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-16 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#7A85F0] to-[#5A65D0] rounded-2xl p-8 lg:p-10 shadow-xl shadow-[#7A85F0]/15">
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                Start Learning Today — Unlock Your Potential!
              </h3>
              <p className="text-white/70 text-sm">
                Join thousands of students building their future with Techlight IT Institute
              </p>
            </div>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#7A85F0] rounded-full font-semibold hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              <span>Explore Courses</span>
              <LuArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-16 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#7A85F0] rounded-xl flex items-center justify-center shadow-lg shadow-[#7A85F0]/20">
                <LuGraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="text-[#7A85F0]">Tech</span><span className="text-gray-800">light</span>
                </span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest ml-1.5">IT Institute</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Your trusted platform for premium courses, expert mentorship, and career-ready skills. Building the next generation of tech leaders in Bangladesh.
            </p>

            {/* Social Links */}
            <div className="flex gap-2.5">
              {socialLinks.map((s, index) => (
                <a
                  key={index}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:border-transparent hover:shadow-lg transition-all duration-300 overflow-hidden"
                  title={s.label}
                >
                  <s.icon className="text-gray-400 group-hover:text-white transition-colors relative z-10 text-sm" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" style={{ backgroundColor: s.color }}></div>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-3">
              <h4 className="text-gray-800 font-semibold mb-3 text-sm">Subscribe to Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#7A85F0] focus:ring-2 focus:ring-[#7A85F0]/10 transition-all"
                />
                <button className="px-5 py-2.5 bg-[#7A85F0] hover:bg-[#5A65D0] text-white rounded-full transition-colors shadow-md shadow-[#7A85F0]/20 hover:shadow-lg hover:shadow-[#7A85F0]/30">
                  <LuSend className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#7A85F0] rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className="text-gray-500 hover:text-[#7A85F0] text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#7A85F0] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#7A85F0] rounded-full"></span>
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(cat.key)}`}
                    className="text-gray-500 hover:text-[#7A85F0] text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#7A85F0] transition-all duration-300"></span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#7A85F0] rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7A85F0]/10 flex items-center justify-center shrink-0 group-hover:bg-[#7A85F0]/20 transition-colors">
                    <IoCallOutline className="text-[#7A85F0]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-gray-600 text-sm group-hover:text-[#7A85F0] transition-colors">{phone}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${emailAddr}`} className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7A85F0]/10 flex items-center justify-center shrink-0 group-hover:bg-[#7A85F0]/20 transition-colors">
                    <IoMailOutline className="text-[#7A85F0]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-gray-600 text-sm group-hover:text-[#7A85F0] transition-colors break-all">{emailAddr}</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7A85F0]/10 flex items-center justify-center shrink-0">
                    <IoLocationOutline className="text-[#7A85F0]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-gray-600 text-sm">{address}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-16 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Techlight IT Institute. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                Made with <LuHeart className="text-red-500 text-xs" /> in Bangladesh
              </span>
              <span className="text-gray-400 text-sm">
                Developed by <a href="https://extrainweb.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#7A85F0] transition-colors text-gray-500">Extrain Web</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
