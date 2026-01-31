"use client";

import { useMotionTemplate, useMotionValue, motion, animate } from "framer-motion";
import { useEffect } from "react";

export const AuroraHero = ({ children }: { children: React.ReactNode }) => {
    const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
    const color = useMotionValue(COLORS[0]);
    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

    useEffect(() => {
        animate(color, COLORS, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    return (
        <motion.section
            style={{ backgroundImage }}
            className="relative min-h-[500px] w-full grid place-content-center overflow-hidden bg-gray-950 text-gray-200"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none brightness-100 contrast-150"></div>
            <div className="relative z-10 container mx-auto px-4">
                {children}
            </div>
        </motion.section>
    );
};
