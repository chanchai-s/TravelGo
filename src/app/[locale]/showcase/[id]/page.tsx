"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGetHotelById, apiHostMe, apiStayReviews } from "@/app/Api/mainApi";

export default function ShowcasePage() {
  const params = useParams();
  const id = params?.id as string;
  const [stay, setStay] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGetHotelById(id)
      .then((res) => setStay((res.data ?? {}) as any))
      .catch(() => setStay(null))
      .finally(() => setLoading(false));
    apiStayReviews(id).then((r) => {
      const d = (r.data ?? {}) as { data?: any[] };
      setReviews(d.data ?? []);
    }).catch(() => {});

    const token = window.localStorage.getItem("travel_token");
    if (token) {
      apiHostMe()
        .then((res) => {
          const data = (res.data ?? {}) as { data?: { stays?: { id: string }[] } };
          const stays = data.data?.stays ?? [];
          if (stays.some((s) => s.id === id)) setIsOwner(true);
        })
        .catch(() => {});
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-[#64748B]">กำลังโหลด...</div>;
  if (!stay) return <div className="p-8 text-center text-[#64748B]">ไม่พบที่พัก</div>;

  const photos = stay.photos ?? (stay.imageUrl ? [{ url: stay.imageUrl }] : []);

  return (
    <div className="font-[Inter] bg-[#F8FAFC] min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[60vh] min-h-[400px]">
        <img src={photos[0]?.url || stay.imageUrl} alt={stay.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 md:px-8 max-w-[1360px] mx-auto">
          <h1 className="font-[Plus_Jakarta_Sans] text-4xl md:text-5xl font-bold text-white tracking-tight">{stay.name}</h1>
          <p className="text-white/90 mt-2">{stay.location}</p>
          {isOwner && (
            <div className="mt-4 flex gap-3">
              <a href={`/host/edit/${id}`} className="bg-[#00A8E8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0096D1] transition">
                แก้ไขที่พัก
              </a>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="bg-white/20 backdrop-blur text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/30 transition"
              >
                แชร์ลิงก์
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content */}
        <div className="lg:col-span-2 space-y-8">
          <p className="text-[#1E293B] leading-relaxed">{stay.description}</p>

          {/* Gallery */}
          {photos.length > 1 && (
            <div>
              <h2 className="font-[Plus_Jakarta_Sans] text-2xl font-semibold text-[#0A2540] mb-3">แกลเลอรี่</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.slice(1).map((p: any, i: number) => (
                  <button key={i} onClick={() => setActivePhoto(p.url)} className="aspect-square overflow-hidden rounded-lg">
                    <img src={p.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {stay.amenities && (
            <div>
              <h2 className="font-[Plus_Jakarta_Sans] text-2xl font-semibold text-[#0A2540] mb-3">สิ่งอำนวยความสะดวก</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stay.amenities).flat().filter(Boolean).map((a: any, i: number) => (
                  <span key={i} className="bg-white border border-[#E2E8F0] px-4 py-1.5 rounded-full text-sm text-[#1E293B]">{String(a)}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <h2 className="font-[Plus_Jakarta_Sans] text-2xl font-semibold text-[#0A2540] mb-3">รีวิว ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r: any) => (
                  <div key={r.id} className="bg-white rounded-lg p-4 border border-[#E2E8F0] shadow-sm">
                    <div className="font-semibold text-sm text-[#0A2540]">{r.user?.name || "ผู้เข้าพัก"}</div>
                    <div className="text-[#00A8E8] text-sm">{"★".repeat(r.rating || 0)}</div>
                    <p className="text-sm text-[#64748B] mt-1">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg border border-[#E2E8F0] shadow-lg p-6">
            <div className="text-2xl font-bold text-[#00A8E8] mb-1">฿{stay.pricePerNight}/คืน</div>
            <p className="text-sm text-[#64748B] mb-4">{stay.location}</p>
            <a href={`/bookingdetails/${id}`} className="block text-center bg-[#00A8E8] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0096D1] transition">
              ดูรายละเอียด / จอง
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 bg-[#0A2540]/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setActivePhoto(null)}>
          <img src={activePhoto} alt="" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
