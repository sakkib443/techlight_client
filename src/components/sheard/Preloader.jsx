"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic preloader for Techlight IT Institute.
 * - Top curtain holds logo + wordmark
 * - Horizontal split line aligns directly under the wordmark
 * - Bottom curtain holds sub-label, progress, status
 * - Rich layered background animations (no sweeping beam)
 */
const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [percent, setPercent] = useState(0);
    const [statusIdx, setStatusIdx] = useState(0);
    const [particles, setParticles] = useState([]);

    // Generate particle configs only on the client (avoids SSR hydration mismatch)
    useEffect(() => {
        const list = [...Array(30)].map(() => ({
            size: Math.random() * 2.5 + 1,
            xStart: Math.random() * 100,
            yStart: Math.random() * 100,
            xEnd: Math.random() * 100,
            yEnd: Math.random() * 100,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 3,
        }));
        setParticles(list);
    }, []);

    const statuses = [
        "Initializing system",
        "Loading assets",
        "Preparing experience",
        "Optimizing interface",
        "Almost there",
        "Welcome",
    ];

    // Lock scroll + remove the SSR initial cover once Preloader is mounted
    useEffect(() => {
        document.body.style.overflow = "hidden";

        // Hand off from static SSR cover to animated Preloader
        const cover = document.getElementById("initial-cover");
        if (cover) {
            // Wait one paint frame so React Preloader is on screen, then remove cover
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    cover.remove();
                });
            });
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Counter
    useEffect(() => {
        const start = performance.now();
        const duration = 3800;
        let raf;

        const tick = (now) => {
            const elapsed = now - start;
            const p = Math.min(100, (elapsed / duration) * 100);
            setPercent(Math.floor(p));

            const idx = Math.min(statuses.length - 1, Math.floor((p / 100) * statuses.length));
            setStatusIdx(idx);

            if (p < 100) {
                raf = requestAnimationFrame(tick);
            } else {
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const t = setTimeout(() => {
                document.body.style.overflow = "auto";
            }, 1400);
            return () => clearTimeout(t);
        }
    }, [isLoading]);

    // ===== Curtain split position =====
    // 50% — line + content sit perfectly centered on screen
    const SPLIT = "50%";
    const SPLIT_REMAINING = "50%";

    // === Exit animations ===
    const containerExit = {
        exit: { transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } },
    };
    const topCurtain = {
        exit: { y: "-100%", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } },
    };
    const bottomCurtain = {
        exit: { y: "100%", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } },
    };
    const contentFadeOut = {
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5, ease: "easeIn" } },
    };

    const wordmark = "TECHLIGHT";

    const letterContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 },
        },
    };

    const letterChild = {
        hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    // Animated background blobs (each slowly orbits + pulses, not sliding)
    const blobs = [
        { color: "rgba(122,133,240,0.5)", size: 600, x: "25%", y: "30%", duration: 16, delay: 0 },
        { color: "rgba(90,101,208,0.45)", size: 700, x: "75%", y: "70%", duration: 20, delay: 2 },
        { color: "rgba(165,174,255,0.4)", size: 500, x: "60%", y: "20%", duration: 18, delay: 4 },
        { color: "rgba(76,99,237,0.35)", size: 550, x: "30%", y: "75%", duration: 22, delay: 1 },
        { color: "rgba(122,133,240,0.3)", size: 450, x: "80%", y: "40%", duration: 19, delay: 3 },
    ];

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    variants={containerExit}
                    exit="exit"
                    className="fixed inset-0 z-[9999] pointer-events-none"
                >
                    {/* === Top Curtain (42% — holds logo + wordmark) === */}
                    <motion.div
                        variants={topCurtain}
                        exit="exit"
                        className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-auto"
                        style={{ height: SPLIT, backgroundColor: "#06060d" }}
                    >
                        {/* Animated mesh blobs (fade in gradually, then pulse) */}
                        <div className="absolute inset-0">
                            {blobs.slice(0, 3).map((blob, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{
                                        opacity: [0, 0.4, 0.8, 0.5, 0.8, 0.4],
                                        scale: [0.6, 1, 1.5, 1.2, 1.5, 1],
                                    }}
                                    transition={{
                                        duration: blob.duration,
                                        delay: blob.delay + 0.4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.1, 0.3, 0.5, 0.75, 1],
                                    }}
                                    className="absolute rounded-full blur-3xl"
                                    style={{
                                        width: blob.size,
                                        height: blob.size,
                                        backgroundColor: blob.color,
                                        left: blob.x,
                                        top: blob.y,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Animated grid that pulses opacity */}
                        <motion.div
                            animate={{ opacity: [0.04, 0.07, 0.04] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(122,133,240,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(122,133,240,0.7) 1px, transparent 1px)",
                                backgroundSize: "50px 50px",
                                maskImage:
                                    "radial-gradient(ellipse 80% 100% at 50% 100%, black 30%, transparent 80%)",
                            }}
                        />

                        {/* Concentric expanding rings from center-bottom */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={`top-ring-${i}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    scale: [0.5, 2.5],
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    delay: 0.8 + i * 1.3,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    times: [0, 0.2, 1],
                                }}
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#7A85F0]/40 pointer-events-none"
                            />
                        ))}
                    </motion.div>

                    {/* === Bottom Curtain (58%) === */}
                    <motion.div
                        variants={bottomCurtain}
                        exit="exit"
                        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-auto"
                        style={{ height: SPLIT_REMAINING, backgroundColor: "#06060d" }}
                    >
                        {/* Animated mesh blobs (fade in gradually, then pulse) */}
                        <div className="absolute inset-0">
                            {blobs.slice(2, 5).map((blob, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{
                                        opacity: [0, 0.4, 0.8, 0.5, 0.8, 0.4],
                                        scale: [0.6, 1, 1.5, 1.2, 1.5, 1],
                                    }}
                                    transition={{
                                        duration: blob.duration,
                                        delay: blob.delay + 0.4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.1, 0.3, 0.5, 0.75, 1],
                                    }}
                                    className="absolute rounded-full blur-3xl"
                                    style={{
                                        width: blob.size,
                                        height: blob.size,
                                        backgroundColor: blob.color,
                                        left: blob.x,
                                        top: blob.y,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Animated grid */}
                        <motion.div
                            animate={{ opacity: [0.04, 0.07, 0.04] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(122,133,240,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(122,133,240,0.7) 1px, transparent 1px)",
                                backgroundSize: "50px 50px",
                                maskImage:
                                    "radial-gradient(ellipse 80% 100% at 50% 0%, black 30%, transparent 80%)",
                            }}
                        />

                        {/* Concentric expanding rings from center-top */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={`bot-ring-${i}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    scale: [0.5, 2.5],
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    delay: 1.0 + i * 1.3,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    times: [0, 0.2, 1],
                                }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#7A85F0]/40 pointer-events-none"
                            />
                        ))}
                    </motion.div>

                    {/* === Animated Split Line (sits at SPLIT position) === */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            scaleX: 0,
                            transition: { duration: 0.3, ease: "easeIn" },
                        }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="absolute left-0 right-0 z-[6] pointer-events-none"
                        style={{ top: SPLIT, transform: "translateY(-50%)" }}
                    >
                        {/* Glow halo behind line */}
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[60%] h-12 rounded-full"
                            style={{
                                background:
                                    "radial-gradient(ellipse, rgba(122,133,240,0.4) 0%, transparent 70%)",
                                filter: "blur(20px)",
                            }}
                        />

                        {/* Main line — gradient with traveling shimmer */}
                        <div className="relative h-px w-full overflow-hidden">
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent 0%, rgba(122,133,240,0.4) 30%, rgba(165,174,255,0.9) 50%, rgba(122,133,240,0.4) 70%, transparent 100%)",
                                }}
                            />
                            {/* Shimmer pass */}
                            <motion.div
                                animate={{ x: ["-30%", "130%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-y-0 w-[30%] bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
                            />
                        </div>

                        {/* Center diamond accent */}
                        <motion.div
                            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 w-2 h-2 rotate-45 bg-gradient-to-br from-[#A5AEFF] to-[#7A85F0] shadow-[0_0_15px_rgba(122,133,240,0.9)]"
                        />
                    </motion.div>

                    {/* === Floating Particles (client-only to avoid hydration mismatch) === */}
                    <motion.div
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        className="absolute inset-0 pointer-events-none overflow-hidden z-[5]"
                    >
                        {particles.map((p, i) => (
                            <motion.span
                                key={i}
                                initial={{
                                    x: `${p.xStart}%`,
                                    y: `${p.yStart}%`,
                                    opacity: 0,
                                }}
                                animate={{
                                    y: [`${p.yStart}%`, `${p.yEnd}%`],
                                    x: [`${p.xStart}%`, `${p.xEnd}%`],
                                    opacity: [0, 0.9, 0],
                                }}
                                transition={{
                                    duration: p.duration,
                                    repeat: Infinity,
                                    delay: p.delay,
                                    ease: "linear",
                                }}
                                className="absolute rounded-full bg-[#A5AEFF]"
                                style={{
                                    width: p.size,
                                    height: p.size,
                                    boxShadow: `0 0 ${p.size * 5}px rgba(122,133,240,1)`,
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* === Pulsing breath glow at split point === */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0, 0.25, 0.55, 0.25, 0.55, 0.25],
                            scale: [0.5, 1, 1.4, 1, 1.4, 1],
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.3, ease: "easeIn" },
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.15, 0.4, 0.55, 0.8, 1],
                        }}
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-[3]"
                        style={{
                            top: SPLIT,
                            background:
                                "radial-gradient(circle, rgba(122,133,240,0.3) 0%, rgba(122,133,240,0.1) 40%, transparent 70%)",
                            filter: "blur(40px)",
                        }}
                    />

                    {/* === TOP CONTENT — Logo + Wordmark (sits above split) === */}
                    <motion.div
                        variants={contentFadeOut}
                        exit="exit"
                        className="absolute top-0 left-0 right-0 flex items-end justify-center px-6 z-10 pointer-events-none"
                        style={{ height: SPLIT, paddingBottom: "32px" }}
                    >
                        <div className="flex flex-col items-center w-full max-w-md">
                            {/* Logo Mark */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                                className="relative mb-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-2xl bg-[#7A85F0]/40 blur-2xl"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute inset-0 rounded-2xl bg-[#A5AEFF]/30 blur-xl"
                                />
                                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7A85F0] via-[#6B74E8] to-[#5A65D0] flex items-center justify-center shadow-2xl shadow-[#7A85F0]/50 border border-white/10">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.2, delay: 0.5 }}
                                            d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.7, delay: 1.4 }}
                                            d="M9 12l2 2 4-4"
                                            stroke="white"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Wordmark */}
                            <motion.div
                                variants={letterContainer}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center justify-center"
                            >
                                {Array.from(wordmark).map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        variants={letterChild}
                                        className="text-3xl md:text-5xl font-bold text-white tracking-[0.2em] inline-block"
                                        style={{
                                            fontFamily: "var(--font-poppins)",
                                            textShadow:
                                                "0 0 40px rgba(122,133,240,0.6), 0 0 80px rgba(122,133,240,0.3)",
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* === BOTTOM CONTENT — Sub-label + Progress (sits right below split line) === */}
                    <motion.div
                        variants={contentFadeOut}
                        exit="exit"
                        className="absolute bottom-0 left-0 right-0 flex flex-col items-start justify-start px-6 z-10 pointer-events-none"
                        style={{ height: SPLIT_REMAINING, paddingTop: "32px" }}
                    >
                        <div className="flex flex-col items-center w-full max-w-md mx-auto">
                            {/* Sub label */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.7, duration: 0.6 }}
                                className="flex items-center gap-3 mb-7"
                            >
                                <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#7A85F0]" />
                                <span
                                    className="text-[10px] md:text-xs font-medium text-[#A5AEFF] tracking-[0.5em] uppercase"
                                    style={{ fontFamily: "var(--font-poppins)" }}
                                >
                                    IT Institute
                                </span>
                                <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#7A85F0]" />
                            </motion.div>

                            {/* Progress Track */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.9, duration: 0.5 }}
                                className="w-full max-w-xs"
                            >
                                <div className="relative h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-full"
                                        style={{
                                            width: `${percent}%`,
                                            background:
                                                "linear-gradient(90deg, #7A85F0 0%, #A5AEFF 50%, #7A85F0 100%)",
                                            boxShadow:
                                                "0 0 12px rgba(122,133,240,0.8), 0 0 24px rgba(122,133,240,0.4)",
                                        }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <motion.div
                                            animate={{ x: ["-100%", "300%"] }}
                                            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                                        />
                                    </motion.div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={statusIdx}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.35 }}
                                            className="text-[10px] font-medium text-white/60 tracking-widest uppercase flex items-center gap-2"
                                            style={{ fontFamily: "var(--font-poppins)" }}
                                        >
                                            <span className="relative flex w-1.5 h-1.5">
                                                <span className="absolute inline-flex w-full h-full rounded-full bg-[#7A85F0] opacity-75 animate-ping" />
                                                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#7A85F0]" />
                                            </span>
                                            {statuses[statusIdx]}
                                        </motion.span>
                                    </AnimatePresence>

                                    <span
                                        className="text-[10px] font-bold text-white/80 tabular-nums"
                                        style={{ fontFamily: "var(--font-poppins)" }}
                                    >
                                        {String(percent).padStart(3, "0")}%
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* === Corner accents === */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="absolute top-6 left-6 z-20 pointer-events-none"
                    >
                        <div
                            className="flex items-center gap-2 text-[10px] font-medium text-white/40 tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-poppins)" }}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#7A85F0] animate-pulse" />
                            <span>System Online</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="absolute top-6 right-6 z-20 pointer-events-none"
                    >
                        <span
                            className="text-[10px] font-medium text-white/40 tracking-widest uppercase tabular-nums"
                            style={{ fontFamily: "var(--font-poppins)" }}
                        >
                            v2.0 — Premium
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-6 left-6 z-20 pointer-events-none"
                    >
                        <span
                            className="text-[10px] font-medium text-white/40 tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-poppins)" }}
                        >
                            © Techlight IT Institute
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="absolute bottom-6 right-6 z-20 pointer-events-none"
                    >
                        <div
                            className="flex items-center gap-2 text-[10px] font-medium text-white/40 tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-poppins)" }}
                        >
                            <span>Premium Experience</span>
                            <span className="w-2 h-2 rounded-full bg-[#A5AEFF] animate-pulse" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
