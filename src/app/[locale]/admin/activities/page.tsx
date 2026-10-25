"use client";

import { useEffect, useState } from "react";
import { apiListActivities, apiAdminCreateActivity, apiAdminDeleteActivity, apiAdminApproveActivity, apiAdminRejectActivity } from "@/app/Api/mainApi";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", duration: "", pricePerPerson: 0, perks: "", imageUrl: "" });

  const load = () => {
    apiListActivities().then((res) => {
      const data = (res.data ?? {}) as { data?: any[] };
      setActivities(data.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const create = async () => {
    await apiAdminCreateActivity({ ...form, perks: form.perks.split(",").map((s) => s.trim()).filter(Boolean) });
    setForm({ title: "", duration: "", pricePerPerson: 0, perks: "", imageUrl: "" });
    load();
  };

  const remove = async (id: string) => { await apiAdminDeleteActivity(id); load(); };
  const approve = async (id: string) => { await apiAdminApproveActivity(id); load(); };
  const reject = async (id: string) => { const reason = prompt("เหตุผล/คำแนะนำ:") || ""; await apiAdminRejectActivity(id, reason); load(); };

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">จัดการ Activities</h1>
      <div className="border rounded-lg p-4 mb-6 bg-white space-y-2">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input type="number" placeholder="Price/person" value={form.pricePerPerson} onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Perks (comma)" value={form.perks} onChange={(e) => setForm({ ...form, perks: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full border rounded px-2 py-1" />
        <button onClick={create} className="bg-blue-600 text-white px-4 py-2 rounded">สร้าง</button>
      </div>
      <div className="space-y-2">
        {activities.map((a) => (
          <div key={a.id} className="border rounded-lg p-3 flex justify-between items-center bg-white">
            <div>
              <div className="font-bold">{a.title} <span className="text-xs text-gray-400">({a.status})</span></div>
              <div className="text-xs text-gray-500">฿{a.pricePerPerson}/คน · {a.duration}</div>
            </div>
            <div className="flex gap-2">
              {a.status === "PENDING" && (
                <>
                  <button onClick={() => approve(a.id)} className="text-green-600 text-sm">อนุมัติ</button>
                  <button onClick={() => reject(a.id)} className="text-orange-600 text-sm">ปฏิเสธ</button>
                </>
              )}
              <button onClick={() => remove(a.id)} className="text-red-600 text-sm">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
