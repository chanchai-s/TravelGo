"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  apiDriverAddDocument,
  apiDriverAddVehicle,
  apiDriverApply,
  apiDriverMe,
  apiRideTiers,
  apiUploadDoc,
  type RideServiceType,
  type RideTier,
} from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { RequireAuth } from "@/components/RequireAuth";
import { formatMoney, SERVICE_LABEL } from "@/lib/rideFormat";

const SERVICE_TYPES: RideServiceType[] = ["RIDE", "PARCEL", "LOGISTICS"];

const DOC_TYPES = [
  { key: "ID_CARD", label: "บัตรประชาชน" },
  { key: "LICENSE", label: "ใบขับขี่" },
  { key: "BLUE_BOOK", label: "เล่มทะเบียนรถ" },
  { key: "INSURANCE", label: "ประกันภัยรถ" },
  { key: "CRIMINAL_CHECK", label: "ใบรับรองประวัติอาชญากรรม" },
  { key: "PASSBOOK", label: "สมุดบัญชีธนาคาร" },
];

const VEHICLE_LABEL: Record<string, string> = {
  MOTORCYCLE: "มอเตอร์ไซค์",
  CAR: "รถยนต์",
  SUV: "SUV",
  VAN: "รถตู้",
  PICKUP: "รถกระบะ",
  TRUCK_6W: "รถ 6 ล้อ",
  TRUCK_10W: "รถ 10 ล้อ",
  TRAILER: "รถพ่วง",
  REFRIGERATED: "รถห้องเย็น",
};

const inputClass =
  "h-11 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

function DriverRegisterPageInner() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [tiers, setTiers] = useState<RideTier[]>([]);
  const [serviceTypes, setServiceTypes] = useState<RideServiceType[]>(["RIDE"]);
  const [tierCodes, setTierCodes] = useState<string[]>([]);
  const [license, setLicense] = useState("");
  const [applied, setApplied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // รถ + เอกสารหลังสมัคร
  const [vehicleTier, setVehicleTier] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [seats, setSeats] = useState("");
  const [docType, setDocType] = useState("ID_CARD");
  const [docUrl, setDocUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState<{ type: string; url: string }[]>([]);

  useEffect(() => {
    apiRideTiers()
      .then((res) => setTiers((res.data?.data ?? []) as RideTier[]))
      .catch(() => setTiers([]));
  }, []);

  // ถ้าสมัครไปแล้วให้พาไปหน้าสถานะเลย
  useEffect(() => {
    apiDriverMe()
      .then(() => router.replace("/driver/status"))
      .catch(() => setChecking(false));
  }, [router]);

  const availableTiers = useMemo(
    () => tiers.filter((tier) => serviceTypes.includes(tier.serviceType)),
    [tiers, serviceTypes],
  );

  const toggleService = (service: RideServiceType) => {
    setServiceTypes((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service],
    );
    setTierCodes((current) =>
      current.filter((code) =>
        tiers.some((tier) => tier.code === code && serviceTypes.includes(tier.serviceType)),
      ),
    );
  };

  const toggleTier = (code: string) => {
    setTierCodes((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
  };

  const apply = async () => {
    if (license.trim() === "") {
      setError("กรุณากรอกเลขใบขับขี่");
      return;
    }
    if (serviceTypes.length === 0) {
      setError("เลือกประเภทบริการอย่างน้อย 1 อย่าง");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiDriverApply({ license: license.trim(), serviceTypes, tierCodes });
      setApplied(true);
      setVehicleTier(availableTiers[0]?.code ?? "");
    } catch (err: unknown) {
      setError(messageOf(err, "ส่งใบสมัครไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const res = await apiUploadDoc(file);
      const data = (res.data ?? {}) as { data?: { fileUrl?: string } };
      setDocUrl(data.data?.fileUrl ?? "");
    } catch (err: unknown) {
      setError(messageOf(err, "อัปโหลดไฟล์ไม่สำเร็จ"));
    } finally {
      setUploading(false);
    }
  };

  const addDocument = async () => {
    if (docUrl === "") {
      setError("เลือกไฟล์เอกสารก่อน");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiDriverAddDocument({ type: docType, url: docUrl });
      setDocs((current) => [...current, { type: docType, url: docUrl }]);
      setDocUrl("");
    } catch (err: unknown) {
      setError(messageOf(err, "บันทึกเอกสารไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const addVehicle = async () => {
    const tier = tiers.find((item) => item.code === vehicleTier);
    if (!tier) {
      setError("เลือกชั้นราคาที่จะขับก่อน");
      return;
    }
    if (plateNo.trim() === "") {
      setError("กรุณากรอกทะเบียนรถ");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiDriverAddVehicle({
        type: tier.vehicleType,
        tierCode: tier.code,
        plateNo: plateNo.trim(),
        brand: brand.trim(),
        model: model.trim(),
        color: color.trim(),
        seats: seats === "" ? undefined : Number(seats),
      });
      setPlateNo("");
      setBrand("");
      setModel("");
      setColor("");
      setSeats("");
      setError("");
    } catch (err: unknown) {
      setError(messageOf(err, "เพิ่มรถไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-2xl">
      <div className="flex items-center gap-2">
        <Link
          href="/ride"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            WanderGo Driver
          </p>
          <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
            สมัครเป็นคนขับ
          </h1>
        </div>
      </div>

      {!applied ? (
        <div className="mt-3 flex flex-col gap-4">
          <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="font-label-md text-label-md font-bold text-on-surface">1. เลือกบริการที่จะขับ</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {SERVICE_TYPES.map((service) => {
                const active = serviceTypes.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-3 transition-all ${
                      active
                        ? "border-primary bg-primary-fixed/40 text-primary"
                        : "border-outline-variant/50 bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {service === "RIDE"
                        ? "directions_car"
                        : service === "PARCEL"
                          ? "package_2"
                          : "local_shipping"}
                    </span>
                    <span className="font-label-sm text-label-sm">{SERVICE_LABEL[service]}</span>
                  </button>
                );
              })}
            </div>

            {availableTiers.length > 0 ? (
              <>
                <p className="mt-3 font-label-md text-label-md font-bold text-on-surface">
                  2. เลือกชั้นราคาที่ถนัด
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {availableTiers.map((tier) => {
                    const active = tierCodes.includes(tier.code);
                    return (
                      <button
                        key={tier.code}
                        type="button"
                        onClick={() => toggleTier(tier.code)}
                        className={`rounded-full border px-3 py-1.5 font-label-sm text-label-sm transition-all ${
                          active
                            ? "border-primary bg-primary text-on-primary"
                            : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant"
                        }`}
                      >
                        {tier.name}
                        <span className="ml-1 opacity-70">{formatMoney(tier.minFare)}+</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </section>

          <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="font-label-md text-label-md font-bold text-on-surface">3. ข้อมูลใบขับขี่</p>
            <label className="mt-2 flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant">เลขใบขับขี่</span>
              <input
                value={license}
                onChange={(event) => setLicense(event.target.value)}
                placeholder="เช่น 1234567890"
                className={inputClass}
              />
            </label>
            <p className="mt-2 font-body-sm text-body-sm text-tertiary">
              สมัครด้วยบัญชี {user?.email ?? ""} — บัญชีเดียวใช้เป็นผู้โดยสารได้ด้วย
            </p>
          </section>

          {error !== "" ? (
            <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void apply()}
            disabled={busy}
            className="h-12 w-full rounded-xl bg-secondary-container font-label-lg text-label-lg font-bold text-on-secondary disabled:opacity-60"
          >
            {busy ? "กำลังส่งใบสมัคร..." : "ส่งใบสมัคร"}
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          <div className="rounded-2xl bg-success-container p-4 text-on-success-container">
            <p className="font-label-lg text-label-lg font-bold">ส่งใบสมัครแล้ว</p>
            <p className="font-body-sm text-body-sm">
              แอดมินจะตรวจสอบภายใน 1–2 วันทำการ — อัปโหลดเอกสารและเพิ่มรถเพื่อให้อนุมัติเร็วขึ้น
            </p>
          </div>

          <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="font-label-md text-label-md font-bold text-on-surface">เพิ่มรถ</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="col-span-2 flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ชั้นราคา / ประเภทรถ</span>
                <select
                  value={vehicleTier}
                  onChange={(event) => setVehicleTier(event.target.value)}
                  className={inputClass}
                >
                  <option value="">เลือกชั้นราคา</option>
                  {availableTiers.map((tier) => (
                    <option key={tier.code} value={tier.code}>
                      {tier.name} — {VEHICLE_LABEL[tier.vehicleType] ?? tier.vehicleType}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ทะเบียนรถ</span>
                <input value={plateNo} onChange={(event) => setPlateNo(event.target.value)} className={inputClass} placeholder="1กข 1234" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">สี</span>
                <input value={color} onChange={(event) => setColor(event.target.value)} className={inputClass} placeholder="ขาว" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ยี่ห้อ</span>
                <input value={brand} onChange={(event) => setBrand(event.target.value)} className={inputClass} placeholder="Toyota" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">รุ่น</span>
                <input value={model} onChange={(event) => setModel(event.target.value)} className={inputClass} placeholder="Yaris" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">จำนวนที่นั่ง</span>
                <input
                  type="number"
                  min={1}
                  value={seats}
                  onChange={(event) => setSeats(event.target.value)}
                  className={inputClass}
                  placeholder="4"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => void addVehicle()}
              disabled={busy}
              className="mt-3 h-10 w-full rounded-xl bg-primary font-label-md text-label-md font-bold text-on-primary disabled:opacity-60"
            >
              เพิ่มรถคันนี้
            </button>
          </section>

          <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="font-label-md text-label-md font-bold text-on-surface">อัปโหลดเอกสาร</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ประเภทเอกสาร</span>
                <select
                  value={docType}
                  onChange={(event) => setDocType(event.target.value)}
                  className={inputClass}
                >
                  {DOC_TYPES.map((doc) => (
                    <option key={doc.key} value={doc.key}>
                      {doc.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ไฟล์</span>
                <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl bg-surface-container-low px-3 font-label-sm text-label-sm text-on-surface-variant">
                  {uploading ? "กำลังอัปโหลด..." : docUrl === "" ? "เลือกไฟล์" : "อัปโหลดแล้ว"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void upload(file);
                      }
                    }}
                  />
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => void addDocument()}
              disabled={busy || docUrl === ""}
              className="mt-3 h-10 w-full rounded-xl bg-primary font-label-md text-label-md font-bold text-on-primary disabled:opacity-60"
            >
              บันทึกเอกสาร
            </button>

            {docs.length > 0 ? (
              <div className="mt-2 flex flex-col gap-1">
                {docs.map((doc, index) => (
                  <p key={`${doc.type}-${index}`} className="font-body-sm text-body-sm text-success">
                    {DOC_TYPES.find((item) => item.key === doc.type)?.label ?? doc.type} — อัปโหลดแล้ว
                  </p>
                ))}
              </div>
            ) : null}
          </section>

          {error !== "" ? (
            <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          ) : null}

          <Link
            href="/driver/status"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary-container font-label-lg text-label-lg font-bold text-on-secondary"
          >
            ดูสถานะใบสมัคร
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
      )}
    </main>
  );
}

export default function DriverRegisterPage() {
  return (
    <RequireAuth>
      <DriverRegisterPageInner />
    </RequireAuth>
  );
}
