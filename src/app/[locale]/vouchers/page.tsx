"use client";

import { useEffect, useState } from "react";
import { apiListMyVouchers } from "@/app/Api/mainApi";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiListMyVouchers()
      .then((res) => {
        const data = (res.data ?? {}) as { data?: any[] };
        setVouchers(data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">คูปองของฉัน</h1>
      <div className="grid gap-3">
        {vouchers.map((v) => (
          <div key={v.id} className="border rounded-lg p-4 bg-white">
            <div className="font-bold text-[#00A8E8]">{v.code}</div>
            <div className="text-sm text-gray-600">{v.title}</div>
            <div className="text-xs text-gray-400 mt-1">
              {v.type === "PERCENT" ? `${v.value}%` : `฿${v.value}`} ส่วนลด
              {v.minSpend ? ` • ยอดขั้นต่ำ ฿${v.minSpend}` : ""}
              {v.expiresAt ? ` • หมดอายุ ${new Date(v.expiresAt).toLocaleDateString()}` : ""}
              {v.restricted ? " • CEO-only" : ""}
              {v.tier ? ` • เฉพาะ ${v.tier}` : ""}
            </div>
          </div>
        ))}
        {vouchers.length === 0 && <p className="text-gray-500">ยังไม่มีคูปอง</p>}
      </div>
    </div>
  );
}
