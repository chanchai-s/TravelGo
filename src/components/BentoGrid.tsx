"use client";

import { motion } from "framer-motion";

const items = [
  { title: "Infinity Pool", desc: "Panoramic views", span: "col-span-2" },
  { title: "Spa", desc: "Wellness", span: "" },
  { title: "Dining", desc: "Fine cuisine", span: "" },
  { title: "Suites", desc: "Luxury rooms", span: "col-span-2" },
];

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`${it.span} bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:scale-[1.02] transition`}
        >
          <h3 className="font-[Plus_Jakarta_Sans] text-xl font-semibold text-[#0A2540]">{it.title}</h3>
          <p className="text-[#64748B] text-sm mt-1">{it.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
