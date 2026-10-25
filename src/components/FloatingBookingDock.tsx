"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/stores/bookingStore";

export default function FloatingBookingDock({ price }: { price: number }) {
  const guests = useBookingStore((s) => s.guests);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg px-6 py-3 flex items-center gap-6"
      >
        <span className="font-semibold text-[#00A8E8]">฿{price}/คืน</span>
        <span className="text-sm text-[#64748B]">{guests} ผู้เข้าพัก</span>
        <button className="bg-[#00A8E8] text-white px-5 py-2 rounded-full text-sm font-semibold">จองเลย</button>
      </motion.div>
    </AnimatePresence>
  );
}
