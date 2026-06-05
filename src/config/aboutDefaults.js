// ===================================================================
// TECHLIGHT Frontend - About Page Default Content
// Shared defaults used by both the admin editor
// (dashboard/admin/design/about) and the public About page.
// Stored single-language (English). Icons & colors are NOT stored here —
// they stay fixed in the components and are matched by index.
// ===================================================================

export const ABOUT_DEFAULTS = {
    hero: {
        badge: "About Us",
        titlePart1: "Building Skills,",
        titleHighlight: "Shaping Futures",
        description:
            "Since 2020, Techlight IT Institute has helped thousands of students transform their careers. With industry-expert mentors, practical curriculum, and real-world projects — we build futures.",
        primaryButtonText: "Explore Courses",
        primaryButtonLink: "/courses",
        secondaryButtonText: "Watch Video",
        miniStats: [
            { value: "5+", label: "Years Experience" },
            { value: "50K+", label: "Happy Students" },
            { value: "4.9", label: "Rating" },
        ],
    },

    // 4 counter cards. `value` is the number (string), `suffix` appended after it.
    stats: [
        { value: "50", suffix: "K+", label: "Active Students" },
        { value: "120", suffix: "+", label: "Expert Mentors" },
        { value: "500", suffix: "+", label: "Premium Courses" },
        { value: "98", suffix: "%", label: "Success Rate" },
    ],

    missionVision: {
        badge: "Our Purpose",
        headingPart1: "Driven by Purpose,",
        headingHighlight: "Fueled by Passion",
        subtitle:
            "We believe in the transformative power of education. Our platform connects ambitious learners with industry experts.",
        mission: {
            title: "Our Mission",
            description:
                "To democratize quality tech education globally. We want every talented mind to flourish, regardless of resources.",
            points: [
                "Affordable premium courses",
                "Equal opportunity for all",
                "Industry-ready curriculum",
            ],
        },
        vision: {
            title: "Our Vision",
            description:
                "A world where anyone can build their dream career. To become South Asia's leading tech education platform.",
            points: [
                "Transform 1M+ careers",
                "Build global tech hubs",
                "AI-powered personalized learning",
            ],
        },
    },

    whyChooseUs: {
        badge: "Why Choose Us",
        headingPart1: "What Makes Us",
        headingHighlight: "Different",
        subtitle:
            "Every course and support system is designed to set you up for success.",
        // 6 feature cards (icon & color fixed in component, matched by index)
        features: [
            { title: "Industry Experts", desc: "Learn from top professionals in the tech industry." },
            { title: "Practical Projects", desc: "Build a portfolio by working on real-world projects." },
            { title: "Verified Certificates", desc: "Earn industry-recognized certificates you can showcase on LinkedIn." },
            { title: "1-on-1 Mentorship", desc: "Personal guidance and weekly mentorship sessions." },
            { title: "Lifetime Access", desc: "Enroll once and get lifetime access to courses and updates." },
            { title: "Job Placement", desc: "Career support, interview prep, and placement assistance." },
        ],
    },
};

// Deep-merge stored About content over the defaults so any missing field
// (or empty array) falls back gracefully. Shared by the admin editor and
// the public About page.
export const mergeAboutContent = (c = {}) => {
    const D = ABOUT_DEFAULTS;
    return {
        hero: {
            ...D.hero,
            ...(c.hero || {}),
            miniStats: c.hero?.miniStats?.length ? c.hero.miniStats : D.hero.miniStats,
        },
        stats: c.stats?.length ? c.stats : D.stats,
        missionVision: {
            ...D.missionVision,
            ...(c.missionVision || {}),
            mission: {
                ...D.missionVision.mission,
                ...(c.missionVision?.mission || {}),
                points: c.missionVision?.mission?.points?.length
                    ? c.missionVision.mission.points
                    : D.missionVision.mission.points,
            },
            vision: {
                ...D.missionVision.vision,
                ...(c.missionVision?.vision || {}),
                points: c.missionVision?.vision?.points?.length
                    ? c.missionVision.vision.points
                    : D.missionVision.vision.points,
            },
        },
        whyChooseUs: {
            ...D.whyChooseUs,
            ...(c.whyChooseUs || {}),
            features: c.whyChooseUs?.features?.length ? c.whyChooseUs.features : D.whyChooseUs.features,
        },
    };
};
