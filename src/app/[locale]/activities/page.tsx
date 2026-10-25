"use client";

import { useEffect, useState } from "react";
import { apiListActivities, apiBookActivity } from "@/app/Api/mainApi";

interface Activity {
  id: string;
  title: string;
  rating?: number;
  reviewCount?: number;
  duration: string;
  pricePerPerson: number;
  oldPrice?: number;
  perks: string[];
  imageUrl?: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{ id: string; title: string } | null>(null);
  const [persons, setPersons] = useState(1);
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiListActivities()
      .then((res) => {
        const data = (res.data ?? {}) as { data?: Activity[] };
        setActivities(data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const book = async () => {
    if (!booking) return;
    try {
      const res = await apiBookActivity(booking.id, { persons, date: date || undefined });
      const data = (res.data ?? {}) as { data?: { ref?: string } };
      setMsg(`จองสำเร็จ เลขที่ ${data.data?.ref ?? ""}`);
      setBooking(null);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "จองไม่สำเร็จ");
    }
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">กิจกรรม</h1>
      {msg && <p className="text-green-600 mb-4">{msg}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((a) => (
          <div key={a.id} className="border rounded-lg overflow-hidden bg-white">
            {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h2 className="font-bold text-lg">{a.title}</h2>
              <div className="text-sm text-gray-600">{a.duration} · ⭐ {a.rating ?? "-"}</div>
              <div className="mt-1">
                <span className="font-semibold text-[#00A8E8]">฿{a.pricePerPerson}/คน</span>
                {a.oldPrice && <span className="text-gray-400 line-through ml-2 text-sm">฿{a.oldPrice}</span>}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(a.perks || []).map((p, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p}</span>
                ))}
              </div>
              <button onClick={() => setBooking({ id: a.id, title: a.title })} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm">
                จอง
              </button>
            </div>
          </div>
        ))}
      </div>
      {activities.length === 0 && <p className="text-gray-500 mt-8 text-center">ยังไม่มีกิจกรรม</p>}

      {booking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setBooking(null)}>
          <div className="bg-white rounded p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold mb-2">จอง: {booking.title}</h2>
            <label className="block text-sm mb-1">จำนวนคน</label>
            <input type="number" min={1} value={persons} onChange={(e) => setPersons(Number(e.target.value))} className="w-full border rounded px-2 py-1 mb-2" />
            <label className="block text-sm mb-1">วันที่</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2 py-1 mb-3" />
            <button onClick={book} className="w-full bg-blue-600 text-white py-2 rounded">ยืนยัน</button>
          </div>
        </div>
      )}
    </div>
  );
}
