"use client";

import type { RideQuote } from "@/app/Api/mainApi";
import { formatMoney } from "@/lib/rideFormat";

export function FareBreakdown({
  quote,
  showAddons = true,
}: {
  quote: RideQuote;
  showAddons?: boolean;
}) {
  const { breakdown } = quote;

  return (
    <div className="rounded-2xl bg-surface-container-low p-4">
      <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
        <span>ค่าโดยสารพื้นฐาน ({quote.distanceKm} กม. • {quote.durationMin} นาที)</span>
        <span className="font-semibold text-on-surface">{formatMoney(breakdown.baseFare)}</span>
      </div>

      {quote.parcel && breakdown.parcelSizeFee > 0 ? (
        <div className="mt-1.5 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>ค่าขนาดพัสดุ ({quote.parcel.sizeTier})</span>
          <span>{formatMoney(breakdown.parcelSizeFee)}</span>
        </div>
      ) : null}

      {quote.parcel && breakdown.parcelWeightFee > 0 ? (
        <div className="mt-1.5 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>ค่าน้ำหนักส่วนเกิน</span>
          <span>{formatMoney(breakdown.parcelWeightFee)}</span>
        </div>
      ) : null}

      {showAddons
        ? quote.addons.map((addon) => (
            <div
              key={addon.type}
              className="mt-1.5 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant"
            >
              <span>{addon.name}</span>
              <span>{formatMoney(addon.amount)}</span>
            </div>
          ))
        : null}

      <div className="mt-1.5 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
        <span>VAT {breakdown.vatRate}%</span>
        <span>{formatMoney(breakdown.vatAmount)}</span>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-outline-variant/60 pt-3">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wide text-tertiary">ยอดรวม</p>
          <p className="font-headline-lg text-headline-lg font-extrabold text-on-surface">
            {formatMoney(breakdown.totalFare)}
          </p>
        </div>
        <span className="rounded-full bg-success-container px-2.5 py-1 font-label-sm text-[10px] font-bold text-on-success-container">
          ราคาคงที่
        </span>
      </div>
    </div>
  );
}

export default FareBreakdown;
