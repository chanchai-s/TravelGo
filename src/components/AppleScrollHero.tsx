"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AppleScrollHero({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <motion.img
        src={image}
        alt={title}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <motion.div style={{ opacity }} className="absolute bottom-20 left-0 right-0 px-6 md:px-16 max-w-[1360px] mx-auto">
        <h1 className="font-[Plus_Jakarta_Sans] text-5xl md:text-7xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-white/90 text-lg mt-3">{subtitle}</p>
      </motion.div>
    </div>
  );
}
