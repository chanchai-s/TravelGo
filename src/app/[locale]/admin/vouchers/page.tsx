"use client";

import { useEffect, useState } from "react";
import { apiAdminListVouchers, apiAdminCreateVoucher, apiAdminDeleteVoucher, apiAdminApproveVoucher, apiAdminRejectVoucher } from "@/app/Api/mainApi";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", title: "", type: "PERCENT", value: 10, minSpend: 0, restricted: false });

  const load = () => {
    apiAdminListVouchers().then((res) => {
      const data = (res.data ?? {}) as { data?: any[] };
      setVouchers(data.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const create = async () => {
    await apiAdminCreateVoucher(form);
    setForm({ code: "", title: "", type: "PERCENT", value: 10, minSpend: 0, restricted: false });
    load();
  };

  const remove = async (id: string) => {
    await apiAdminDeleteVoucher(id);
    load();
  };
  const approve = async (id: string) => { await apiAdminApproveVoucher(id); load(); };
  const reject = async (id: string) => { await apiAdminRejectVoucher(id, "rejected"); load(); };

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">จัดการ Voucher</h1>
      <div className="border rounded-lg p-4 mb-6 bg-white">
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border rounded px-2 py-1" />
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded px-2 py-1" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border rounded px-2 py-1">
            <option value="PERCENT">%</option>
            <option value="FLAT">฿</option>
          </select>
          <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="border rounded px-2 py-1" />
          <input type="number" placeholder="Min spend" value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })} className="border rounded px-2 py-1" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.restricted} onChange={(e) => setForm({ ...form, restricted: e.target.checked })} />
            CEO-only (special customers)
          </label>
        </div>
        <button onClick={create} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">สร้าง</button>
      </div>
      <div className="space-y-2">
        {vouchers.map((v) => (
          <div key={v.id} className="border rounded-lg p-3 flex justify-between items-center bg-white">
            <div>
              <div className="font-bold">{v.code} <span className="text-xs text-gray-400">({v.status})</span></div>
              <div className="text-xs text-gray-500">{v.title} — {v.type === "PERCENT" ? `${v.value}%` : `฿${v.value}`} {v.restricted ? "(CEO-only)" : ""} {v.tier ? `[${v.tier}]` : ""}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard?.writeText(v.code)} className="text-blue-600 text-sm">คัดลอกโค้ด</button>
              {v.status === "PENDING" && (
                <>
                  <button onClick={() => approve(v.id)} className="text-green-600 text-sm">อนุมัติ</button>
                  <button onClick={() => reject(v.id)} className="text-orange-600 text-sm">ปฏิเสธ</button>
                </>
              )}
              <button onClick={() => remove(v.id)} className="text-red-600 text-sm">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
