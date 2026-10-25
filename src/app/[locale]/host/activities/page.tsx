"use client";

import { useEffect, useState } from "react";
import { apiHostSubmitActivity, apiHostListActivities } from "@/app/Api/mainApi";

export default function HostActivitiesPage() {
  const [form, setForm] = useState({ title: "", duration: "", pricePerPerson: 0, perks: "", imageUrl: "" });
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<any[]>([]);

  const load = () => {
    apiHostListActivities().then((res) => {
      const data = (res.data ?? {}) as { data?: any[] };
      setList(data.data ?? []);
    }).catch(() => {});
  };

  useEffect(load, []);

  const submit = async () => {
    try {
      await apiHostSubmitActivity({ ...form, perks: form.perks.split(",").map((s) => s.trim()).filter(Boolean) });
      setMsg("ส่งคำขอสำเร็จ (รอ Admin อนุมัติ)");
      setForm({ title: "", duration: "", pricePerPerson: 0, perks: "", imageUrl: "" });
      load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "ส่งไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ส่งกิจกรรม (Host)</h1>
      <div className="space-y-2 mb-6">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input type="number" placeholder="Price/person" value={form.pricePerPerson} onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Perks (comma)" value={form.perks} onChange={(e) => setForm({ ...form, perks: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full border rounded px-2 py-1" />
        <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">ส่งคำขอ</button>
        {msg && <p className="text-sm text-gray-600">{msg}</p>}
      </div>
      <h2 className="font-bold mb-2">กิจกรรมของฉัน</h2>
      <div className="space-y-2">
        {list.map((a) => (
          <div key={a.id} className="border rounded p-3 bg-white">
            <div className="font-semibold">{a.title} <span className="text-xs text-gray-400">({a.status})</span></div>
            {a.status === "REJECTED" && a.rejectedReason && (
              <div className="text-xs text-red-600 mt-1">เหตุผล/คำแนะนำ: {a.rejectedReason}</div>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-500 text-sm">ยังไม่มีกิจกรรม</p>}
      </div>
    </div>
  );
}
