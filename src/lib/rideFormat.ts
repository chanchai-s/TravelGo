import type { RideServiceType, RideTier } from "@/app/Api/mainApi";

/** ตัวช่วยจัดรูปแบบ/ข้อความของ ride — ใช้ร่วมทุกหน้า */

export function formatMoney(value: number | null | undefined): string {
  const amount = Number(value ?? 0);
  return `฿${amount.toLocaleString("th-TH")}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABEL: Record<string, string> = {
  REQUESTED: "ส่งคำขอ",
  SEARCHING: "กำลังหาคนขับ",
  ACCEPTED: "คนขับรับงานแล้ว",
  ARRIVING: "กำลังไปรับ",
  ARRIVED: "ถึงจุดรับแล้ว",
  IN_PROGRESS: "กำลังเดินทาง",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
  EXPIRED: "หมดเวลา",
};

export const STATUS_TONE: Record<string, string> = {
  REQUESTED: "bg-surface-container-high text-on-surface-variant",
  SEARCHING: "bg-primary-fixed text-on-primary-fixed-variant",
  ACCEPTED: "bg-primary-fixed text-on-primary-fixed-variant",
  ARRIVING: "bg-primary-fixed text-on-primary-fixed-variant",
  ARRIVED: "bg-warning-container text-on-warning-container",
  IN_PROGRESS: "bg-success-container text-on-success-container",
  COMPLETED: "bg-success-container text-on-success-container",
  CANCELLED: "bg-error-container text-on-error-container",
  EXPIRED: "bg-error-container text-on-error-container",
};

export const SERVICE_LABEL: Record<RideServiceType, string> = {
  RIDE: "เรียกโดยสาร",
  PARCEL: "ส่งพัสดุ",
  LOGISTICS: "ขนย้าย / เหมารถ",
};

export const SERVICE_ICON: Record<RideServiceType, string> = {
  RIDE: "directions_car",
  PARCEL: "package_2",
  LOGISTICS: "local_shipping",
};

export const STATUS_STEPS = ["SEARCHING", "ACCEPTED", "ARRIVED", "IN_PROGRESS", "COMPLETED"] as const;

/**
 * ราคาโดยประมาณไว้ "แสดงผล" เท่านั้น (server คิดจริงอีกครั้งตอน quote/create)
 * สูตรเดียวกับ backend: RIDE = max(minFare, base + km×perKm + min×perMin)
 */
export function estimateTierFare(
  tier: RideTier,
  distanceKm: number,
  durationMin: number,
  serviceType: RideServiceType,
): number {
  if (serviceType === "LOGISTICS") {
    const flat = tier.flatFare ?? tier.minFare;
    const extraKm = Math.max(0, distanceKm - (tier.includedKm ?? 0));
    return Math.max(tier.minFare, Math.round(flat + extraKm * tier.perKm));
  }
  return Math.max(
    tier.minFare,
    Math.round(tier.baseFare + distanceKm * tier.perKm + durationMin * tier.perMin),
  );
}

/** เวลาโดยประมาณ (นาที) — ใช้แสดงผลก่อนเรียก quote จริง */
export function estimateDuration(distanceKm: number, serviceType: RideServiceType): number {
  const speed = serviceType === "LOGISTICS" ? 45 : serviceType === "PARCEL" ? 30 : 25;
  return Math.max(5, Math.round((distanceKm / speed) * 60));
}

export function haversineKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
}
