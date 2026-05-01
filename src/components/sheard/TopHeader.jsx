"use client";

import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { LuPhone, LuMapPin, LuClock, LuUser, LuUserPlus, LuMail } from "react-icons/lu";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

const TopHeader = () => {
  const [contactData, setContactData] = useState(null);

  // Fetch dynamic contact info from API
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

  // Dynamic values from API, with fallbacks
  const phone = contactData?.contactContent?.contactInfo?.phone || "+880 1XXX-XXXXXX";
  const email = contactData?.contactContent?.contactInfo?.email || "info@techlightit.com";
  const address = contactData?.contactContent?.contactInfo?.address || "Dhaka, Bangladesh";
  const officeHours = contactData?.contactContent?.contactInfo?.officeHours || "9:00 AM - 9:00 PM";
  const socialLinks = contactData?.contactContent?.socialLinks || {};

  // Social icons config — dynamic URLs from API
  const socials = [
    { icon: FaFacebookF, href: socialLinks.facebook || "#", label: "Facebook" },
    { icon: FaInstagram, href: socialLinks.instagram || "#", label: "Instagram" },
    { icon: FaLinkedinIn, href: socialLinks.linkedin || "#", label: "LinkedIn" },
    { icon: FaWhatsapp, href: socialLinks.whatsapp || "#", label: "WhatsApp" },
    { icon: FaYoutube, href: socialLinks.youtube || "#", label: "YouTube" },
  ];

  return (
    <div className="w-full py-2 text-[13px] bg-[#0D0E43] text-white/90 border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1440px]">
        <div className="flex justify-between items-center">

          {/* Left - Contact Info (dynamic from API) */}
          <div className="hidden md:flex items-center gap-5">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors group">
              <LuPhone className="w-3.5 h-3.5 text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]" />
              <span>{phone}</span>
            </a>
            <span className="w-[1px] h-3.5 bg-white/15"></span>
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors group">
              <LuMapPin className="w-3.5 h-3.5 text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]" />
              <span>{address}</span>
            </a>
            <span className="w-[1px] h-3.5 bg-white/15"></span>
            <div className="flex items-center gap-2">
              <LuClock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>{officeHours}</span>
            </div>
          </div>

          {/* Right - Email & Follow Us + Socials */}
          <div className="flex items-center gap-5 ml-auto">
            {/* Email */}
            <a href={`mailto:${email}`} className="hidden lg:flex items-center gap-2 hover:text-white transition-colors group">
              <LuMail className="w-3.5 h-3.5 text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]" />
              <span>{email}</span>
            </a>

            <span className="w-[1px] h-3.5 bg-white/15 hidden sm:block"></span>

            {/* Follow Us + Social Icons */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-white/70 text-[12px] uppercase tracking-wider font-medium">Follow Us:</span>
              <div className="flex items-center gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-primary)] text-white/70 hover:text-white transition-all duration-300"
                    title={label}
                  >
                    <Icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopHeader;
