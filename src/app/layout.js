import {
  Poppins,
} from "next/font/google";
import "./globals.css";
import Navbar from "../components/sheard/Navbar";
import Footer from "@/components/sheard/Footer";
import TopHeader from "@/components/sheard/TopHeader";
import Preloader from "@/components/sheard/Preloader";

import ReduxProviderWrapper from "@/components/ReduxProvaiderWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import GTMPageViewTracker from "@/components/sheard/GoogleTagManager";

// Google Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
  const seo = await getSeoContent();
  const siteName = seo.siteName || 'TECHLIGHT IT';
  return {
    title: {
      template: `${siteName} | %s`,
      default: seo.home?.title || `${siteName} | Home`,
    },
    description: seo.home?.description || 'Techlight IT Solution — a leading IT training institute and digital solutions provider in Bangladesh.',
    icons: {
      icon: '/images/Techlight IT Institutelogo.png',
      shortcut: '/images/Techlight IT Institutelogo.png',
      apple: '/images/Techlight IT Institutelogo.png',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable}`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId="GTM-MJ8GRP2J" />
      <body className="antialiased" suppressHydrationWarning>
        {/* Dark cover — prevents page flash before Preloader hydrates.
            Preloader will hide this via CSS class instead of DOM removal. */}
        <div
          id="initial-cover"
          aria-hidden="true"
          suppressHydrationWarning
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#06060d",
            zIndex: 10000,
            pointerEvents: "none",
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Google Tag Manager (noscript) — using dangerouslySetInnerHTML to avoid hydration mismatch */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJ8GRP2J" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
          }}
        />
        <Suspense fallback={null}>
          <GTMPageViewTracker />
        </Suspense>
        <Preloader />
        <ReduxProviderWrapper>
          <LanguageProvider>
            <Toaster position="top-center" reverseOrder={false} />

            {children}
          </LanguageProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}

