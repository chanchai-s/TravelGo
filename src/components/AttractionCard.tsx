"use client";

export default function AttractionCard({ title, distance, image }: { title: string; distance: string; image: string }) {
  return (
    <div className="min-w-[260px] bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-[Plus_Jakarta_Sans] font-semibold text-[#0A2540]">{title}</h3>
        <span className="text-xs text-[#00A8E8] font-semibold">{distance}</span>
      </div>
    </div>
  );
}
