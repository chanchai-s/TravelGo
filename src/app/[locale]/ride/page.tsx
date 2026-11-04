"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  apiCreateRideJob,
  apiMyRideJobs,
  apiPayRideJob,
  apiRideAddons,
  apiRideQuote,
  apiRideTiers,
  apiSavedAddresses,
  type RideJob,
  type RidePoint,
  type RideQuote,
  type RideServiceType,
  type RideTier,
  type SavedAddress,
} from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { ServiceToggle } from "@/components/ride/ServiceToggle";
import { LocationPicker } from "@/components/ride/LocationPicker";
import { TierPicker } from "@/components/ride/TierPicker";
import {
  AddonPicker,
  type AddonCatalogItem,
} from "@/components/ride/AddonPicker";
import { FareBreakdown } from "@/components/ride/FareBreakdown";
import {
  ParcelForm,
  EMPTY_PARCEL,
  type ParcelDraft,
} from "@/components/ride/ParcelForm";
import { RideMap } from "@/components/ride/RideMap";
import { BottomSheet } from "@/components/ride/BottomSheet";
import {
  estimateDuration,
  formatMoney,
  haversineKm,
  SERVICE_LABEL,
  STATUS_LABEL,
} from "@/lib/rideFormat";

type PaymentChoice =
  | "PREPAY_PROMPTPAY"
  | "PREPAY_CARD"
  | "POSTPAY_CASH"
  | "POSTPAY_TRANSFER";

const PAYMENT_OPTIONS: {
  key: PaymentChoice;
  timing: "PREPAY" | "POSTPAY";
  method: string;
  label: string;
  hint: string;
  icon: string;
}[] = [
  {
    key: "PREPAY_PROMPTPAY",
    timing: "PREPAY",
    method: "PROMPTPAY",
    label: "PromptPay QR",
    hint: "จ่ายล่วงหน้า ยืนยันแล้วคนขับออกทันที",
    icon: "qr_code_2",
  },
  {
    key: "PREPAY_CARD",
    timing: "PREPAY",
    method: "CARD",
    label: "บัตรเครดิต / เดบิต",
    hint: "จ่ายล่วงหน้า (mock gateway)",
    icon: "credit_card",
  },
  {
    key: "POSTPAY_CASH",
    timing: "POSTPAY",
    method: "CASH",
    label: "เงินสดกับคนขับ",
    hint: "จ่ายเมื่อถึงปลายทาง",
    icon: "payments",
  },
  {
    key: "POSTPAY_TRANSFER",
    timing: "POSTPAY",
    method: "TRANSFER",
    label: "โอนให้คนขับ",
    hint: "โอนเมื่อถึงปลายทาง",
    icon: "account_balance",
  },
];

const ACTIVE_STATUSES = [
  "REQUESTED",
  "SEARCHING",
  "ACCEPTED",
  "ARRIVING",
  "ARRIVED",
  "IN_PROGRESS",
];

function errorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

export default function RidePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const ready = useAuthStore((state) => state.ready);

  const [serviceType, setServiceType] = useState<RideServiceType>("RIDE");
  const [pickup, setPickup] = useState<RidePoint | null>(null);
  const [dropoff, setDropoff] = useState<RidePoint | null>(null);
  const [tiers, setTiers] = useState<RideTier[]>([]);
  const [tierCode, setTierCode] = useState("");
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [addonCatalog, setAddonCatalog] = useState<AddonCatalogItem[]>([]);
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [passengers, setPassengers] = useState(1);
  const [parcel, setParcel] = useState<ParcelDraft>(EMPTY_PARCEL);
  const [quote, setQuote] = useState<RideQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [payment, setPayment] = useState<PaymentChoice>("PREPAY_PROMPTPAY");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payStep, setPayStep] = useState<"review" | "qr">("review");
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [createdJob, setCreatedJob] = useState<RideJob | null>(null);
  const [error, setError] = useState("");
  const [activeJob, setActiveJob] = useState<RideJob | null>(null);

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  // ชั้นราคา + addon ตามบริการ
  useEffect(() => {
    setQuote(null);
    setTierCode("");
    setAddons({});
    apiRideTiers(serviceType)
      .then((res) => {
        const list = (res.data?.data ?? []) as RideTier[];
        setTiers(list);
        setTierCode(list[0]?.code ?? "");
      })
      .catch(() => setTiers([]));

    apiRideAddons(serviceType)
      .then((res) =>
        setAddonCatalog((res.data?.data ?? []) as AddonCatalogItem[]),
      )
      .catch(() => setAddonCatalog([]));
  }, [serviceType]);

  // ที่อยู่ที่บันทึกไว้ + งานที่ยังไม่จบ
  useEffect(() => {
    if (token === null) {
      setSaved([]);
      setActiveJob(null);
      return;
    }
    apiSavedAddresses()
      .then((res) => setSaved((res.data?.data ?? []) as SavedAddress[]))
      .catch(() => setSaved([]));
    apiMyRideJobs({ size: 5 })
      .then((res) => {
        const items = (res.data?.data?.items ?? []) as RideJob[];
        const active = items.find((job) =>
          ACTIVE_STATUSES.includes(job.status),
        );
        setActiveJob(active ?? null);
      })
      .catch(() => undefined);
  }, [token]);

  const distanceKm = useMemo(() => {
    if (!pickup || !dropoff) {
      return 0;
    }
    return haversineKm(pickup, dropoff);
  }, [pickup, dropoff]);

  const durationMin = useMemo(
    () => (distanceKm > 0 ? estimateDuration(distanceKm, serviceType) : 0),
    [distanceKm, serviceType],
  );

  const addonKey = useMemo(
    () =>
      Object.entries(addons)
        .sort(([a], [b]) => a.localeCompare(b))
        .join(","),
    [addons],
  );

  // ขอราคาจาก server (debounce)
  useEffect(() => {
    if (!pickup || !dropoff || tierCode === "") {
      setQuote(null);
      return;
    }
    if (
      serviceType !== "RIDE" &&
      (Number(parcel.weightKg) <= 0 || !parcel.sizeTier)
    ) {
      setQuote(null);
      return;
    }

    let cancelled = false;
    setQuoting(true);
    setQuoteError("");

    const timer = setTimeout(() => {
      apiRideQuote({
        serviceType,
        tierCode,
        pickup,
        dropoff,
        passengerCount: passengers,
        addons: Object.entries(addons).map(([type, qty]) => ({ type, qty })),
        ...(serviceType === "RIDE"
          ? {}
          : {
              parcel: {
                weightKg: Number(parcel.weightKg),
                sizeTier: parcel.sizeTier,
                isFragile: parcel.isFragile,
              },
            }),
      })
        .then((res) => {
          if (!cancelled) {
            setQuote((res.data?.data ?? null) as RideQuote | null);
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setQuote(null);
            setQuoteError(errorMessage(err, "ขอราคาไม่สำเร็จ"));
          }
        })
        .finally(() => {
          if (!cancelled) {
            setQuoting(false);
          }
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    serviceType,
    tierCode,
    pickup,
    dropoff,
    passengers,
    addonKey,
    parcel.weightKg,
    parcel.sizeTier,
    parcel.isFragile,
    addons,
  ]);

  const selectedTier = tiers.find((tier) => tier.code === tierCode) ?? null;
  const paymentOption =
    PAYMENT_OPTIONS.find((option) => option.key === payment) ??
    PAYMENT_OPTIONS[0];

  const startCheckout = () => {
    if (!quote) {
      return;
    }
    if (!ready) {
      return;
    }
    if (user === null) {
      router.push("/login?next=/ride");
      return;
    }
    if (
      serviceType !== "RIDE" &&
      (parcel.receiverName.trim() === "" || parcel.receiverPhone.trim() === "")
    ) {
      setQuoteError("กรุณากรอกชื่อและเบอร์ผู้รับก่อน");
      return;
    }
    setError("");
    setPayStep("review");
    setCreatedJob(null);
    setCheckoutOpen(true);
  };

  const createJob = useCallback(async () => {
    if (!quote) {
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await apiCreateRideJob({
        serviceType,
        tierCode: quote.tier.code,
        pickup: quote.pickup,
        dropoff: quote.dropoff,
        passengerCount: serviceType === "RIDE" ? passengers : undefined,
        addons: Object.entries(addons).map(([type, qty]) => ({ type, qty })),
        paymentTiming: paymentOption?.timing,
        paymentMethod: paymentOption?.method,
        ...(serviceType === "RIDE"
          ? {}
          : {
              parcel: {
                weightKg: Number(parcel.weightKg),
                sizeTier: parcel.sizeTier,
                isFragile: parcel.isFragile,
                receiverName: parcel.receiverName.trim(),
                receiverPhone: parcel.receiverPhone.trim(),
                note: parcel.note.trim(),
                codAmount: Number(parcel.codAmount) || 0,
              },
            }),
      });
      const job = (res.data?.data ?? res.data) as RideJob;
      setCreatedJob(job);

      if (paymentOption?.timing === "PREPAY") {
        setPayStep("qr");
      } else {
        setCheckoutOpen(false);
        router.push(`/ride/${job.id}`);
      }
    } catch (err: unknown) {
      setError(errorMessage(err, "สร้างงานไม่สำเร็จ"));
    } finally {
      setCreating(false);
    }
  }, [quote, serviceType, addons, paymentOption, passengers, parcel, router]);

  const confirmPrepay = async () => {
    if (!createdJob) {
      return;
    }
    setPaying(true);
    setError("");
    try {
      await apiPayRideJob(createdJob.id, {
        method: paymentOption?.method ?? "PROMPTPAY",
      });
      setCheckoutOpen(false);
      router.push(`/ride/${createdJob.id}`);
    } catch (err: unknown) {
      setError(errorMessage(err, "ชำระเงินไม่สำเร็จ"));
    } finally {
      setPaying(false);
    }
  };

  const payLater = () => {
    if (!createdJob) {
      return;
    }
    setCheckoutOpen(false);
    router.push(`/ride/${createdJob.id}`);
  };

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-28 pt-3 md:max-w-5xl md:pb-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            WanderGo Mobility
          </p>
          <h1 className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-on-surface">
            เรียกใช้บริการ
          </h1>
        </div>
        <Link
          href="/ride/history"
          className="flex h-10 items-center gap-1 rounded-full bg-surface-container-low px-3 font-label-md text-label-md text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          ประวัติ
        </Link>
      </div>

      {activeJob ? (
        <Link
          href={`/ride/${activeJob.id}`}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-on-primary shadow-sm"
        >
          <span className="material-symbols-outlined text-[22px]">
            directions_car
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-label-md text-label-md font-bold">
              คุณมีงานที่ยังไม่จบ — {activeJob.ref}
            </span>
            <span className="block font-body-sm text-body-sm text-on-primary/80">
              {STATUS_LABEL[activeJob.status] ?? activeJob.status} •
              แตะเพื่อติดตาม
            </span>
          </span>
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </Link>
      ) : null}

      <div className="mt-3 md:grid md:grid-cols-[minmax(0,1fr)_360px] md:items-start md:gap-6">
        <div className="flex flex-col gap-4">
          <ServiceToggle value={serviceType} onChange={setServiceType} />

          <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <LocationPicker
                label="จุดรับ"
                value={pickup}
                onChange={setPickup}
                saved={saved}
                tone="pickup"
              />
              <div className="ml-[21px] h-3 border-l-2 border-dashed border-outline-variant" />
              <LocationPicker
                label="จุดส่ง"
                value={dropoff}
                onChange={setDropoff}
                saved={saved}
                tone="dropoff"
              />
            </div>

            {serviceType === "RIDE" ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2">
                <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    group
                  </span>
                  จำนวนผู้โดยสาร
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPassengers((value) => Math.max(1, value - 1))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      remove
                    </span>
                  </button>
                  <span className="w-5 text-center font-label-md text-label-md font-bold">
                    {passengers}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPassengers((value) =>
                        Math.min(selectedTier?.seats ?? 9, value + 1),
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                  </button>
                </div>
              </div>
            ) : null}

            {distanceKm > 0 ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-primary-fixed/40 px-3 py-2">
                <span className="font-body-sm text-body-sm text-on-primary-fixed-variant">
                  ระยะทางประมาณ {distanceKm} กม. • {durationMin} นาที
                </span>
                <span className="material-symbols-outlined text-[18px] text-primary">
                  route
                </span>
              </div>
            ) : null}
          </section>

          {serviceType !== "RIDE" ? (
            <ParcelForm
              value={parcel}
              onChange={(patch) =>
                setParcel((current) => ({ ...current, ...patch }))
              }
            />
          ) : null}

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                เลือกชั้นราคา
              </h2>
              <span className="font-label-sm text-label-sm text-tertiary">
                {tiers.length} ตัวเลือก
              </span>
            </div>
            <TierPicker
              tiers={tiers}
              value={tierCode}
              onChange={setTierCode}
              serviceType={serviceType}
              distanceKm={distanceKm}
              durationMin={durationMin}
            />
          </section>

          {addonCatalog.length > 0 ? (
            <section>
              <h2 className="mb-2 font-headline-sm text-headline-sm font-bold text-on-surface">
                บริการเสริม
              </h2>
              <AddonPicker
                catalog={addonCatalog}
                value={addons}
                onChange={setAddons}
              />
            </section>
          ) : null}

          {quoteError !== "" ? (
            <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
              {quoteError}
            </p>
          ) : null}

          {quote ? (
            <div className="md:hidden">
              <FareBreakdown quote={quote} />
            </div>
          ) : null}

          <p className="font-body-sm text-body-sm leading-relaxed text-tertiary">
            {quote?.policy.zeroSurge ??
              "ไม่มีค่า surge pricing — ราคาปกติทุกช่วงเวลา"}
          </p>
        </div>

        <aside className="hidden md:sticky md:top-20 md:flex md:flex-col md:gap-3">
          <RideMap pickup={pickup} dropoff={dropoff} heightClass="h-52" />
          {quote ? (
            <FareBreakdown quote={quote} />
          ) : (
            <div className="rounded-2xl bg-surface-container-lowest p-4 font-body-sm text-body-sm text-tertiary shadow-sm">
              เลือกจุดรับ-ส่งและชั้นราคาเพื่อดูราคา
            </div>
          )}
          <button
            type="button"
            onClick={startCheckout}
            disabled={quote === null || quoting}
            className="flex h-12 w-full items-center justify-between rounded-xl bg-secondary-container px-4 font-label-lg text-label-lg font-bold text-on-secondary shadow-md disabled:opacity-50"
          >
            <span>{quoting ? "กำลังคำนวณ..." : "ดำเนินการต่อ"}</span>
            <span className="flex items-center gap-1">
              {quote ? formatMoney(quote.breakdown.totalFare) : "-"}
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </span>
          </button>
        </aside>
      </div>

      {/* CTA ล่างสำหรับ mobile */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-outline-variant/40 bg-surface-container-lowest/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={startCheckout}
          disabled={quote === null || quoting}
          className="flex h-12 w-full items-center justify-between rounded-xl bg-secondary-container px-4 font-label-lg text-label-lg font-bold text-on-secondary shadow-md disabled:opacity-50"
        >
          <span>
            {quoting
              ? "กำลังคำนวณ..."
              : quote
                ? `${SERVICE_LABEL[serviceType]} • ${quote.tier.name}`
                : "เลือกจุดรับ-ส่ง"}
          </span>
          <span className="flex items-center gap-1">
            {quote ? formatMoney(quote.breakdown.totalFare) : "-"}
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </span>
        </button>
      </div>

      <BottomSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={payStep === "qr" ? "ชำระเงินล่วงหน้า" : "ตรวจสอบก่อนยืนยัน"}
        subtitle={
          payStep === "qr"
            ? "สแกน QR จำลองแล้วกดยืนยัน"
            : `${quote?.tier.name ?? ""} • ${SERVICE_LABEL[serviceType]}`
        }
        footer={
          payStep === "qr" ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void confirmPrepay()}
                disabled={paying}
                className="h-12 w-full rounded-xl bg-primary font-label-lg text-label-lg font-bold text-on-primary disabled:opacity-60"
              >
                {paying ? "กำลังตรวจสอบ..." : "ฉันชำระเงินแล้ว"}
              </button>
              <button
                type="button"
                onClick={payLater}
                className="h-10 w-full rounded-xl bg-surface-container-low font-label-md text-label-md text-on-surface-variant"
              >
                ไว้จ่ายภายหลัง
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void createJob()}
              disabled={creating}
              className="flex h-12 w-full items-center justify-between rounded-xl bg-secondary-container px-4 font-label-lg text-label-lg font-bold text-on-secondary disabled:opacity-60"
            >
              <span>
                {creating ? "กำลังสร้างงาน..." : "ยืนยันเรียกใช้บริการ"}
              </span>
              <span>
                {quote ? formatMoney(quote.breakdown.totalFare) : "-"}
              </span>
            </button>
          )
        }
      >
        {payStep === "qr" ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="grid h-44 w-44 grid-cols-7 gap-1 rounded-2xl bg-white p-3 shadow-inner">
              {Array.from({ length: 49 }).map((_, index) => (
                <span
                  key={index}
                  className={`rounded-[2px] ${
                    (index * 7 +
                      (index % 5) +
                      (createdJob?.ref.charCodeAt(index % 5) ?? 0)) %
                      3 ===
                    0
                      ? "bg-on-surface"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            <p className="font-label-md text-label-md font-bold text-on-surface">
              {formatMoney(quote?.breakdown.totalFare)}
            </p>
            <p className="text-center font-body-sm text-body-sm text-tertiary">
              PromptPay (จำลอง) • {createdJob?.ref ?? ""}
              <br />
              ระบบจะยืนยันอัตโนมัติหลังกดปุ่มด้านล่าง
            </p>
            {error !== "" ? (
              <p className="font-body-sm text-body-sm text-error">{error}</p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-2">
            <div className="rounded-2xl bg-surface-container-low p-3">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <p className="font-body-sm text-body-sm text-on-surface">
                  {pickup?.address}
                </p>
              </div>
              <div className="ml-[4px] my-1 h-3 border-l-2 border-dashed border-outline-variant" />
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-sm bg-secondary-container" />
                <p className="font-body-sm text-body-sm text-on-surface">
                  {dropoff?.address}
                </p>
              </div>
            </div>

            {quote ? <FareBreakdown quote={quote} /> : null}

            <div>
              <p className="mb-1.5 font-label-md text-label-md font-bold text-on-surface">
                วิธีชำระเงิน
              </p>
              <div className="flex flex-col gap-1.5">
                {PAYMENT_OPTIONS.map((option) => {
                  const active = payment === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setPayment(option.key)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                        active
                          ? "border-primary bg-primary-fixed/40"
                          : "border-outline-variant/50 bg-surface-container-lowest"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {option.icon}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-label-md text-label-md font-semibold text-on-surface">
                          {option.label}
                        </span>
                        <span className="block font-body-sm text-body-sm text-tertiary">
                          {option.hint}
                        </span>
                      </span>
                      {active ? (
                        <span className="material-symbols-outlined text-[20px] text-primary">
                          check_circle
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-tertiary">
              {quote?.policy.fixedFare}
            </p>
            {error !== "" ? (
              <p className="font-body-sm text-body-sm text-error">{error}</p>
            ) : null}
          </div>
        )}
      </BottomSheet>
    </main>
  );
}
