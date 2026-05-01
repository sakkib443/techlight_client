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

export const metadata = {
  title: {
    template: "TECHLIGHT IT | %s",
    default: "TECHLIGHT IT | Home",
  },
  description:
    "ejobs it  a leading IT training institute and digital solutions provider. We specialize in professional courses, ready-made software, and premium website templates to help you grow your skills and business.",
  icons: {
    icon: "/images/Techlight IT Institutelogo.png",
    shortcut: "/images/Techlight IT Institutelogo.png",
    apple: "/images/Techlight IT Institutelogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable}`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId="GTM-MJ8GRP2J" />
      <body className="antialiased" suppressHydrationWarning>
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

