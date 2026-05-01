"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import TopCategories from "@/components/Home/TopCategories";
import PopularCourse from "@/components/Home/PopularCourse";
import WhatWeProvide from "@/components/Home/WhatWeProvide";
import Testimonials from "@/components/Home/Testimonials";
import Newsletter from "@/components/Home/Newsletter";
import { fetchCoursesData } from "@/redux/CourseSlice";
import Lenis from 'lenis';

const HomePage = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize Lenis Smooth Scroll - Only on desktop
    if (window.innerWidth > 768) {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchCoursesData());
      dispatch(fetchCategories());
    }
  }, [dispatch, mounted]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-black selection:bg-[#7A85F0]/20 selection:text-[#7A85F0] font-poppins antialiased">
      <main className="relative">
        {/* 1. Hero Section */}
        <section className="relative w-full overflow-hidden z-0 bg-white dark:bg-black">
          <Hero />
        </section>

        {/* 2. Top Categories */}
        <TopCategories />

        {/* 3. Popular Courses */}
        <PopularCourse />

        {/* 4. What We Provide */}
        <WhatWeProvide />

        {/* 6. Testimonials */}
        <Testimonials />

        {/* 7. Newsletter */}
        <Newsletter />
      </main>
    </div>
  );
};

export default HomePage;
