"use client";

import { useEffect, useState } from "react";
import { apiHostCreateVoucher, apiHostListVouchers } from "@/app/Api/mainApi";

export default function HostVouchersPage() {
  const [form, setForm] = useState({ code: "", title: "", type: "PERCENT", value: 10, minSpend: 0, stayId: "", expiresAt: "" });
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<any[]>([]);

  const load = () => {
    apiHostListVouchers().then((res) => {
      const data = (res.data ?? {}) as { data?: any[] };
      setList(data.data ?? []);
    }).catch(() => {});
  };
  useEffect(load, []);

  const create = async () => {
    try {
      await apiHostCreateVoucher(form);
      setMsg("สร้างคูปองสำเร็จ (รอ Admin อนุมัติ)");
      setForm({ code: "", title: "", type: "PERCENT", value: 10, minSpend: 0, stayId: "", expiresAt: "" });
      load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "สร้างไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">สร้างคูปองสำหรับที่พัก</h1>
      <div className="space-y-2">
        <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-2 py-1" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border rounded px-2 py-1">
          <option value="PERCENT">%</option>
          <option value="FLAT">฿</option>
        </select>
        <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full border rounded px-2 py-1" />
        <input type="number" placeholder="Min spend" value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })} className="w-full border rounded px-2 py-1" />
        <input placeholder="Stay ID" value={form.stayId} onChange={(e) => setForm({ ...form, stayId: e.target.value })} className="w-full border rounded px-2 py-1" />
        <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full border rounded px-2 py-1" />
        <button onClick={create} className="bg-blue-600 text-white px-4 py-2 rounded">สร้าง</button>
        {msg && <p className="text-sm text-gray-600">{msg}</p>}
      </div>
      <h2 className="font-bold mb-2">คูปองของฉัน</h2>
      <div className="space-y-2">
        {list.map((v) => (
          <div key={v.id} className="border rounded p-3 bg-white">
            <div className="font-semibold">{v.code} <span className="text-xs text-gray-400">({v.status})</span></div>
            <div className="text-xs text-gray-500">{v.title} — {v.type === "PERCENT" ? `${v.value}%` : `฿${v.value}`}</div>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-500 text-sm">ยังไม่มีคูปอง</p>}
      </div>
    </div>
  );
}
