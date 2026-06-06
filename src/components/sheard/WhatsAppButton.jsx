"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

const buildWhatsAppLink = (raw) => {
    if (!raw || typeof raw !== "string") return "#";
    const value = raw.trim();
    if (value === "" || value === "#") return "#";
    if (/^https?:\/\//i.test(value)) return value;
    const digits = value.replace(/[^0-9]/g, "");
    return digits ? `https://wa.me/${digits}` : "#";
};

const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState("#");

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/designs/contact`);
                const data = await res.json();
                const info = data?.data?.contactContent;
                const raw = info?.contactInfo?.whatsapp || info?.socialLinks?.whatsapp || info?.contactInfo?.phone;
                const link = buildWhatsAppLink(raw);
                if (link !== "#") setWhatsappLink(link);
            } catch {
                /* keep "#" fallback */
            }
        };
        fetchLink();
    }, []);

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
        >
            {/* Tooltip */}
            <div
                className={`px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-full shadow-lg transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
            >
                Chat with us!
            </div>

            {/* Button */}
            <div className="relative">
                {/* Pulse Animation */}
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30"></div>

                {/* Main Button */}
                <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                    <FaWhatsapp className="text-white text-3xl" />
                </div>
            </div>
        </a>
    );
};

export default WhatsAppButton;
