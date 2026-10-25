"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import AppleScrollHero from "@/components/AppleScrollHero";
import BentoGrid from "@/components/BentoGrid";
import ModeSwitcher from "@/components/ModeSwitcher";
import AttractionCard from "@/components/AttractionCard";
import FloatingBookingDock from "@/components/FloatingBookingDock";

export default function ResortPage() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <main className="bg-[#F8FAFC]">
      <AppleScrollHero
        title="The Residence"
        subtitle="Ultra-Luxury Resort Experience"
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
      />
      <section className="max-w-[1360px] mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[Plus_Jakarta_Sans] text-3xl font-bold text-[#0A2540]">Experience</h2>
          <ModeSwitcher />
        </div>
        <BentoGrid />
      </section>
      <section className="max-w-[1360px] mx-auto px-6 py-16">
        <h2 className="font-[Plus_Jakarta_Sans] text-3xl font-bold text-[#0A2540] mb-6">Nearby Attractions</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <AttractionCard title="Cafe Aurora" distance="5 mins away" image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" />
          <AttractionCard title="Nature Trail" distance="10 mins away" image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80" />
          <AttractionCard title="Old Town" distance="15 mins away" image="https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=600&q=80" />
        </div>
      </section>
      <FloatingBookingDock price={4500} />
    </main>
  );
}
