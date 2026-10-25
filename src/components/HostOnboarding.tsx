"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGetProperty, apiOnboardProperty, mainApi } from "@/app/Api/mainApi";
import { WizardSteps } from "@/components/WizardSteps";
import { PhotoUploader } from "@/components/PhotoUploader";

type HostTypeId =
  | "VILLA"
  | "APARTMENT"
  | "CONDO"
  | "HOMESTAY"
  | "WHOLE_HOUSE"
  | "BUNGALOW"
  | "HOTEL"
  | "GUEST_HOUSE"
  | "RESORT"
  | "HOSTEL"
  | "UNIQUE";

type TypeGroup = "whole" | "hotel" | "unique";

type TypeOption = {
  id: HostTypeId;
  group: TypeGroup;
  icon: string;
  name: string;
  desc: string;
};

const TYPE_OPTIONS: TypeOption[] = [
  { id: "VILLA", group: "whole", icon: "villa", name: "วิลล่า", desc: "บ้านพักตากอากาศทั้งหลัง" },
  { id: "APARTMENT", group: "whole", icon: "domain", name: "อพาร์ตเมนต์", desc: "ห้องชุดพร้อมอยู่" },
  { id: "CONDO", group: "whole", icon: "apartment", name: "คอนโด", desc: "ห้องชุดในอาคารชุด" },
  { id: "HOMESTAY", group: "whole", icon: "house", name: "โฮมสเตย์", desc: "พักกับเจ้าของบ้าน" },
  { id: "WHOLE_HOUSE", group: "whole", icon: "home", name: "บ้านทั้งหลัง", desc: "บ้านเดี่ยวทั้งหลังพร้อมบริเวณ" },
  { id: "BUNGALOW", group: "whole", icon: "cabin", name: "บังกะโล", desc: "บ้านชั้นเดียวสไตล์รีสอร์ต" },
  { id: "HOTEL", group: "hotel", icon: "hotel", name: "โรงแรม", desc: "ที่พักมาตรฐานพร้อมฟรอนต์" },
  { id: "GUEST_HOUSE", group: "hotel", icon: "bed", name: "เกสต์เฮาส์", desc: "ที่พักขนาดเล็กอบอุ่น" },
  { id: "RESORT", group: "hotel", icon: "holiday_village", name: "รีสอร์ต", desc: "พักผ่อนพร้อมสิ่งอำนวยความสะดวก" },
  { id: "HOSTEL", group: "hotel", icon: "bunk", name: "โฮสเทล", desc: "ขายเป็นเตียง ห้องรวม" },
  { id: "UNIQUE", group: "unique", icon: "auto_awesome", name: "ที่พักเอกลักษณ์", desc: "บูทีค แคปซูล เรือ เต็นท์" },
];

const GROUPS: { id: TypeGroup; title: string; desc: string }[] = [
  { id: "whole", title: "บ้านและทั้งหลัง", desc: "วิลล่า อพาร์ตเมนต์ คอนโด โฮมสเตย์" },
  { id: "hotel", title: "โรงแรม", desc: "โรงแรม เกสต์เฮาส์ รีสอร์ต โฮสเทล" },
  { id: "unique", title: "เอกลักษณ์เฉพาะ", desc: "บูทีค แคปซูล เรือ เต็นท์" },
];

const STEPS = [
  "ข้อมูลทั่วไป",
  "ที่ตั้ง",
  "รายละเอียด",
  "สิ่งอำนวยความสะดวก",
  "รูปภาพ",
  "นโยบาย",
  "สัญญา",
  "ตรวจทาน",
];

const GENERAL_OPTIONS = ["WiFi", "สระว่ายน้ำ", "ที่จอดรถ", "สปา", "ฟิตเนส", "ร้านอาหาร", "บาร์"];
const ROOM_OPTIONS = ["แอร์", "ทีวี", "มินิบาร์", "ตู้เซฟ", "อ่างอาบน้ำ", "ระเบียง"];
const DINING_OPTIONS = ["อาหารเช้า", "รูมเซอร์วิส", "คาเฟ่"];

const CANCELLATIONS = ["ยกเลิกฟรีก่อน 7 วัน", "ยกเลิกฟรีก่อน 1 วัน", "ขอคืนไม่ได้"];

const inputClass =
  "h-12 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0066ff]";

function toNumber(value: string, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) && value.trim() !== "" ? num : fallback;
}

function toggleList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

type PhotoRow = { key: number; url: string };

type NearbyRow = { key: number; label: string; distance: string; category: string };

const NEARBY_CATEGORIES = ["landmark", "transport", "shopping", "dining"];

let photoKey = 1;

// ใช้ตอนโหลดข้อมูลเดิมมาใส่ฟอร์ม (แต่ละแถวต้องมี key ไม่ซ้ำ)
function nextRowKey(): number {
  photoKey += 1;
  return photoKey;
}

export function HostOnboarding({
  initialTypeId,
  editId,
}: {
  initialTypeId?: string;
  editId?: string;
}) {
  const initialType =
    TYPE_OPTIONS.find((option) => option.id === initialTypeId) ?? null;
  const [step, setStep] = useState(initialType || editId ? 2 : 1);
  const [type, setType] = useState<TypeOption | null>(initialType);
  const [propertyId, setPropertyId] = useState(editId ?? "");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [location, setLocation] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [nearby, setNearby] = useState<NearbyRow[]>([]);

  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("1");
  const [capacity, setCapacity] = useState("4");
  const [unitNo, setUnitNo] = useState("");
  const [hostLivesIn, setHostLivesIn] = useState(false);
  const [theme, setTheme] = useState("");
  const [highlights, setHighlights] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [general, setGeneral] = useState<string[]>([]);
  const [roomAm, setRoomAm] = useState<string[]>([]);
  const [dining, setDining] = useState<string[]>([]);
  const [petFriendly, setPetFriendly] = useState(false);

  const [photos, setPhotos] = useState<PhotoRow[]>([]);

  const [checkIn, setCheckIn] = useState("14:00");
  const [checkOut, setCheckOut] = useState("12:00");
  const [cancellation, setCancellation] = useState(CANCELLATIONS[0] ?? "");
  const [childrenAllowed, setChildrenAllowed] = useState(true);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [deposit, setDeposit] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [review, setReview] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  // กลับมาจากหน้า login แล้วทำร่างเดิมต่อที่ขั้นตรวจทาน
  useEffect(() => {
    const draftId = window.localStorage.getItem("host_draft_id");
    if (!draftId || window.localStorage.getItem("host_draft_resume") !== "1") {
      return;
    }
    window.localStorage.removeItem("host_draft_resume");
    setPropertyId(draftId);
    setStep(9);
    apiGetProperty(draftId)
      .then((res) => {
        const data = (res.data ?? {}) as { data?: Record<string, unknown> };
        setReview(data.data ?? null);
      })
      .catch(() => setReview(null));
  }, []);

  // โหมดแก้ไข: ดึงข้อมูลเดิมมาใส่ฟอร์ม
  useEffect(() => {
    if (editId === undefined || editId === "") {
      return;
    }
    apiGetProperty(editId)
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: Record<string, any> }).data ?? {};
        setPropertyId(editId);
        if (data.propertyType) {
          setType(TYPE_OPTIONS.find((option) => option.id === data.propertyType) ?? initialType);
        }
        setName(data.name ?? "");
        setPrice(String(data.pricePerNight ?? ""));
        setDescription(data.description ?? "");
        setPhone(data.phone ?? "");
        setEmail(data.email ?? "");
        setLocation(data.location ?? "");
        setAddressLine(data.addressLine ?? "");
        setLatitude(data.latitude != null ? String(data.latitude) : "");
        setLongitude(data.longitude != null ? String(data.longitude) : "");
        setNearby(
          (data.nearby ?? []).map((place: any) => ({
            key: nextRowKey(),
            label: place.label ?? "",
            distance: place.distance ?? "",
            category: place.category ?? "landmark",
          })),
        );
        setGeneral(data.amenities?.generalAmenities ?? []);
        setRoomAm(data.amenities?.roomAmenities ?? []);
        setDining(data.amenities?.diningServices ?? []);
        setPetFriendly(data.amenities?.petFriendly === true);
        setPhotos(
          (data.photos ?? []).map((photo: any) => ({
            key: nextRowKey(),
            url: photo.url ?? "",
          })),
        );
        const p = data.policy ?? {};
        setCheckIn(p.checkIn ?? "14:00");
        setCheckOut(p.checkOut ?? "12:00");
        setCancellation(p.cancellation ?? CANCELLATIONS[0] ?? "");
        setChildrenAllowed(p.childrenAllowed !== false);
        setPetsAllowed(p.petsAllowed === true);
        setDeposit(p.deposit != null ? String(p.deposit) : "");

        const w = data.wholeProperty ?? {};
        setBedrooms(w.bedroomsCount != null ? String(w.bedroomsCount) : "2");
        setBathrooms(w.bathroomsCount != null ? String(w.bathroomsCount) : "1");
        setCapacity(w.maxCapacity != null ? String(w.maxCapacity) : "4");
        setUnitNo(w.unitNo ?? "");
        setHostLivesIn(w.hostLivesIn === true);
      })
      .catch(() => setError("โหลดข้อมูลเดิมไม่สำเร็จ"));
  }, [editId]);

  const pickType = (option: TypeOption) => {
    setType(option);
    setStep(2);
  };

  const save = async (stepNo: number, payload: Record<string, unknown>, status?: string) => {
    if (!type) {
      return false;
    }
    setSaving(true);
    setError("");
    try {
      const isEdit = editId !== undefined && editId !== "";
      const target = propertyId === "" ? "new" : propertyId;
      // กุญแจของร่าง (ถ้ายังไม่มีเจ้าของ) — ต้องส่งไปทุกครั้ง
      const key = window.localStorage.getItem("host_draft_key") ?? "";
      const body = {
        propertyType: type.id,
        currentStep: stepNo,
        ...(status ? { status } : {}),
        ...(key !== "" ? { draftKey: key } : {}),
        ...payload,
      };
      // แก้ไขของเดิม = PATCH / สร้างใหม่ = POST ที่ onboard
      const res = isEdit
        ? await mainApi.patch(`/host/${target}`, body)
        : await apiOnboardProperty(target, body);
      const result = (res.data ?? {}) as {
        data?: { id?: string; draftKey?: string | null };
        message?: string;
        mustReReview?: boolean;
      };
      // ถ้าแก้ฟิลด์สำคัญของประกาศที่ขึ้นเว็บแล้ว → กลับเข้าคิวตรวจ
      if (result.mustReReview === true) {
        setNotice("บันทึกแล้ว และส่งกลับเข้าคิวตรวจเพราะแก้ไขข้อมูลสำคัญ");
      }
      const data = result as { data?: { id?: string; draftKey?: string | null } };
      if (data.data?.id) {
        setPropertyId(data.data.id);
      }
      // เก็บกุญแจไว้ใช้ต่อ (เซิร์ฟเวอร์ส่งมาเฉพาะตอนสร้างร่างใหม่)
      if (data.data?.draftKey) {
        window.localStorage.setItem("host_draft_key", data.data.draftKey);
      }
      return true;
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      if (code === 401 && propertyId !== "") {
        window.localStorage.setItem("host_draft_id", propertyId);
        window.localStorage.setItem("host_draft_resume", "1");
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return false;
      }
      setError(
        code === 401
          ? "กรุณา login ก่อน"
          : code === 403
            ? "บัญชีนี้ยังไม่ผ่านการยืนยัน host"
            : "บันทึกไม่สำเร็จ",
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const typePayload = (): Record<string, unknown> => {
    if (!type) {
      return {};
    }
    if (type.group === "whole") {
      return {
        wholeProperty: {
          bedroomsCount: toNumber(bedrooms, 1),
          bathroomsCount: toNumber(bathrooms, 1),
          maxCapacity: toNumber(capacity, 2),
          unitNo: unitNo.trim() === "" ? null : unitNo.trim(),
          hostLivesIn,
        },
      };
    }
    if (type.group === "unique") {
      return {
        uniqueDetail: {
          theme: theme.trim() === "" ? null : theme.trim(),
          highlights: highlights
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== ""),
          specialNotes: specialNotes.trim() === "" ? null : specialNotes.trim(),
        },
      };
    }
    return {};
  };

  const nextFromStep = async () => {
    if (!type) {
      return;
    }
    if (step === 2) {
      if (name.trim() === "") {
        setError("กรุณากรอกชื่อที่พัก");
        return;
      }
      const ok = await save(1, {
        name: name.trim(),
        pricePerNight: toNumber(price),
        description: description.trim() === "" ? null : description.trim(),
        phone: phone.trim() === "" ? null : phone.trim(),
        email: email.trim() === "" ? null : email.trim(),
      });
      if (ok) {
        setStep(3);
      }
      return;
    }
    if (step === 3) {
      if (location.trim() === "") {
        setError("กรุณากรอกทำเล");
        return;
      }
      const ok = await save(2, {
        location: location.trim(),
        addressLine: addressLine.trim(),
        latitude: latitude.trim() === "" ? null : toNumber(latitude),
        longitude: longitude.trim() === "" ? null : toNumber(longitude),
        nearby: nearby
          .filter((place) => place.label.trim() !== "")
          .map((place) => ({
            label: place.label.trim(),
            distance: place.distance.trim(),
            category: place.category,
          })),
      });
      if (ok) {
        setStep(4);
      }
      return;
    }
    if (step === 4) {
      const ok = await save(3, typePayload());
      if (ok) {
        setStep(5);
      }
      return;
    }
    if (step === 5) {
      const ok = await save(4, {
        amenities: { generalAmenities: general, roomAmenities: roomAm, diningServices: dining, petFriendly },
      });
      if (ok) {
        setStep(6);
      }
      return;
    }
    if (step === 6) {
      const ok = await save(5, {
        photos: photos
          .filter((photo) => photo.url.trim() !== "")
          .map((photo) => ({ url: photo.url.trim(), caption: "" })),
      });
      if (ok) {
        setStep(7);
      }
      return;
    }
    if (step === 7) {
      const ok = await save(6, {
        policy: {
          checkIn,
          checkOut,
          cancellation,
          childrenAllowed,
          petsAllowed,
          deposit: deposit.trim() === "" ? null : toNumber(deposit),
        },
      });
      if (ok) {
        setStep(8);
      }
      return;
    }
    if (step === 8) {
      if (!agreed) {
        setError("กรุณายอมรับเงื่อนไขก่อน");
        return;
      }
      setStep(9);
      try {
        const res = await apiGetProperty(propertyId);
        const data = (res.data ?? {}) as { data?: Record<string, unknown> };
        setReview(data.data ?? null);
      } catch {
        setReview(null);
      }
      return;
    }
    const ok = await save(8, {}, "PENDING_REVIEW");
    if (ok) {
      window.localStorage.removeItem("host_draft_id");
      window.localStorage.removeItem("host_draft_resume");
      window.localStorage.removeItem("host_draft_key");
      setDone(true);
    }
  };

  const amenityGroup = (
    title: string,
    options: string[],
    selected: string[],
    onToggle: (next: string[]) => void,
  ) => (
    <div>
      <p className="mb-2 font-label-md text-label-md font-semibold text-on-surface">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(toggleList(selected, option))}
              className={`rounded-full px-3.5 py-1.5 font-label-md text-label-md shadow-sm transition-colors ${
                active ? "bg-primary-container font-bold text-on-primary" : "bg-surface-container-lowest text-on-surface"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (done) {
    return (
      <div className="rounded-2xl bg-surface-container-lowest p-8 text-center shadow-sm">
        <span className="material-symbols-outlined text-[48px] text-primary">check_circle</span>
        <h2 className="mt-2 font-headline-md text-headline-md font-bold text-on-surface">
          ส่งให้ admin ตรวจแล้ว
        </h2>
        <p className="mt-1 font-body-md text-body-md text-tertiary">สถานะ PENDING — รอผลตรวจ</p>
        <button
          type="button"
          onClick={() => {
            setStep(2);
            setDone(false);
          }}
          className="mt-4 rounded-xl bg-surface-container-low px-6 py-2.5 font-label-md text-label-md font-bold text-on-surface"
        >
          ลงทรัพย์อื่นต่อ
        </button>
      </div>
    );
  }

  if (step >= 2 && type) {
    const wizardStep = step - 1;
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
        <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
          <WizardSteps
            steps={STEPS}
            current={wizardStep}
            onSelect={(next) => next < wizardStep && setStep(next + 1)}
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-3 flex items-center gap-1 font-label-md text-label-md font-bold text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            เปลี่ยนประเภท ({type.name})
          </button>
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
            <p className="mb-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              {type.name} • ขั้น {wizardStep}/8 {STEPS[wizardStep - 1]}
            </p>

            {wizardStep === 1 ? (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
                    ชื่อที่พัก
                  </p>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น Villa Sukhumvit" className={inputClass} />
                </div>
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
                    ราคาต่อคืน (฿)
                  </p>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="2500" className={inputClass} />
                </div>
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">คำอธิบาย</p>
                  <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="จุดเด่นที่พัก" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เบอร์ติดต่อ</p>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="02-xxx-xxxx" className={inputClass} />
                  </div>
                  <div>
                    <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">อีเมล</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@place.com" className={inputClass} />
                  </div>
                </div>
              </div>
            ) : null}

            {wizardStep === 2 ? (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ทำเล</p>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="เช่น เชียงใหม่" className={inputClass} />
                </div>
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ที่อยู่</p>
                  <input value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="บ้านเลขที่ ถนน" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">Latitude</p>
                    <input value={latitude} onChange={(e) => setLatitude(e.target.value)} inputMode="decimal" className={inputClass} placeholder="18.79" />
                  </div>
                  <div>
                    <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">Longitude</p>
                    <input value={longitude} onChange={(e) => setLongitude(e.target.value)} inputMode="decimal" className={inputClass} placeholder="98.98" />
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
                    สถานที่ใกล้เคียง
                  </p>
                  <div className="flex flex-col gap-2">
                    {nearby.map((place) => (
                      <div key={place.key} className="flex items-center gap-2">
                        <input
                          value={place.label}
                          onChange={(e) =>
                            setNearby((prev) =>
                              prev.map((item) =>
                                item.key === place.key ? { ...item, label: e.target.value } : item,
                              ),
                            )
                          }
                          placeholder="ชื่อสถานที่"
                          className={`${inputClass} flex-1`}
                        />
                        <input
                          value={place.distance}
                          onChange={(e) =>
                            setNearby((prev) =>
                              prev.map((item) =>
                                item.key === place.key ? { ...item, distance: e.target.value } : item,
                              ),
                            )
                          }
                          placeholder="1.4 km"
                          className="h-12 w-24 rounded-xl bg-surface-container-low px-2 text-sm text-on-surface outline-none"
                        />
                        <select
                          value={place.category}
                          onChange={(e) =>
                            setNearby((prev) =>
                              prev.map((item) =>
                                item.key === place.key ? { ...item, category: e.target.value } : item,
                              ),
                            )
                          }
                          className="h-12 rounded-xl bg-surface-container-low px-2 text-sm text-on-surface outline-none"
                        >
                          {NEARBY_CATEGORIES.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setNearby((prev) => prev.filter((item) => item.key !== place.key))}
                          className="font-label-md text-label-md font-bold text-error"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setNearby((prev) => [...prev, { key: Date.now(), label: "", distance: "", category: "landmark" }])
                      }
                      className="rounded-xl bg-surface-container-low py-2.5 font-label-md text-label-md font-bold text-primary"
                    >
                      + เพิ่มสถานที่
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {wizardStep === 3 ? (
              <div className="flex flex-col gap-3">
                {type.group === "whole" ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ห้องนอน</p>
                      <input value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} inputMode="numeric" className={inputClass} />
                    </div>
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ห้องน้ำ</p>
                      <input value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} inputMode="numeric" className={inputClass} />
                    </div>
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">พักได้ (คน)</p>
                      <input value={capacity} onChange={(e) => setCapacity(e.target.value)} inputMode="numeric" className={inputClass} />
                    </div>
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เลขห้อง/ยูนิต</p>
                      <input value={unitNo} onChange={(e) => setUnitNo(e.target.value)} placeholder="A-1201" className={inputClass} />
                    </div>
                    <label className="col-span-2 flex cursor-pointer items-center gap-2 font-body-md text-body-md text-on-surface md:col-span-4">
                      <input type="checkbox" checked={hostLivesIn} onChange={(e) => setHostLivesIn(e.target.checked)} className="h-5 w-5 accent-primary" />
                      เจ้าของพักอยู่ด้วย (โฮมสเตย์)
                    </label>
                  </div>
                ) : null}
                {type.group === "unique" ? (
                  <>
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ธีม</p>
                      <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="เช่น บูทีคไม้สัก" className={inputClass} />
                    </div>
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
                        จุดขาย (คั่นด้วย comma)
                      </p>
                      <input value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder="วิวทะเล, ดีไซน์ไม้สัก" className={inputClass} />
                    </div>
                    <div>
                      <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">หมายเหตุพิเศษ</p>
                      <input value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="เช่น เข้าถึงโดยเรือเท่านั้น" className={inputClass} />
                    </div>
                  </>
                ) : null}
                {type.group === "hotel" ? (
                  <p className="font-body-md text-body-md text-tertiary">
                    ประเภทโรงแรมใช้ wizard 8 ขั้นเฉพาะ — กลับไปเลือกที่ /host/hotel
                  </p>
                ) : null}
              </div>
            ) : null}

            {wizardStep === 4 ? (
              <div className="flex flex-col gap-4">
                {amenityGroup("ทั่วไป", GENERAL_OPTIONS, general, setGeneral)}
                {amenityGroup("ในห้อง", ROOM_OPTIONS, roomAm, setRoomAm)}
                {amenityGroup("อาหาร", DINING_OPTIONS, dining, setDining)}
                <label className="flex cursor-pointer items-center gap-2 font-body-md text-body-md text-on-surface">
                  <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} className="h-5 w-5 accent-primary" />
                  รับสัตว์เลี้ยง
                </label>
              </div>
            ) : null}

            {wizardStep === 5 ? (
              <div className="flex flex-col gap-3">
                {photos.map((photo) => (
                  <div key={photo.key} className="flex items-center gap-2">
                    <input
                      value={photo.url}
                      onChange={(e) =>
                        setPhotos((prev) =>
                          prev.map((item) => (item.key === photo.key ? { ...item, url: e.target.value } : item)),
                        )
                      }
                      placeholder="https://... (รูปแรก = ปก)"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((item) => item.key !== photo.key))}
                      className="font-label-md text-label-md font-bold text-error"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
                <button
                  type="button"
onClick={() => setPhotos((prev) => [...prev, { key: Date.now(), url: "" }])}
                  className="rounded-xl bg-surface-container-low py-3 font-label-md text-label-md font-bold text-primary"
                >
                  + เพิ่ม (URL)
                </button>
                <p className="text-center font-body-sm text-body-sm text-tertiary">
                  หรือเลือกรูปจากเครื่องด้��ล่าง
                </p>
                <PhotoUploader
                  onUploaded={(fileUrl) =>
                    setPhotos((prev) => [...prev, { key: Date.now(), url: fileUrl }])
                  }
                />
              </div>
            ) : null}

            {wizardStep === 6 ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เช็คอิน</p>
                    <input value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={inputClass} placeholder="14:00" />
                  </div>
                  <div>
                    <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เช็คเอาท์</p>
                    <input value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={inputClass} placeholder="12:00" />
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">การยกเลิก</p>
                  <select value={cancellation} onChange={(e) => setCancellation(e.target.value)} className={inputClass}>
                    {CANCELLATIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">มัดจำ (฿)</p>
                  <input value={deposit} onChange={(e) => setDeposit(e.target.value)} inputMode="numeric" className={inputClass} placeholder="0 = ไม่มี" />
                </div>
                <label className="flex cursor-pointer items-center gap-2 font-body-md text-body-md text-on-surface">
                  <input type="checkbox" checked={childrenAllowed} onChange={(e) => setChildrenAllowed(e.target.checked)} className="h-5 w-5 accent-primary" />
                  รับเด็ก
                </label>
                <label className="flex cursor-pointer items-center gap-2 font-body-md text-body-md text-on-surface">
                  <input type="checkbox" checked={petsAllowed} onChange={(e) => setPetsAllowed(e.target.checked)} className="h-5 w-5 accent-primary" />
                  รับสัตว์เลี้ยง
                </label>
              </div>
            ) : null}

            {wizardStep === 7 ? (
              <div className="flex flex-col gap-3">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  ข้าพเจ้ายอมรับเงื่อนไขการลงประกาศและอัตราคอมมิชชันของ WanderGo
                  โดยที่พักจะขึ้นขายหลังผ่านการตรวจจาก admin
                </p>
                <label className="flex cursor-pointer items-start gap-2 font-body-md text-body-md text-on-surface">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 accent-primary" />
                  ยอมรับเงื่อนไขทั้งหมด
                </label>
              </div>
            ) : null}

            {wizardStep === 8 ? (
              <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface">
                <p><span className="font-bold">ชื่อ:</span> {name}</p>
                <p><span className="font-bold">ทำเล:</span> {location}</p>
                <p><span className="font-bold">รูป:</span> {photos.filter((photo) => photo.url.trim() !== "").length} รูป</p>
                <p><span className="font-bold">นโยบาย:</span> {checkIn} / {checkOut} / {cancellation}</p>
              </div>
            ) : null}

            {error !== "" ? (
              <p className="mt-3 font-body-md text-body-md text-error">
                {error}{" "}
                {error.includes("login") ? (
                  <Link href="/login" className="font-bold underline">ไปหน้า login</Link>
                ) : error.includes("ยืนยัน host") ? (
                  <Link href="/host/status" className="font-bold underline">ดูสถานะการยืนยัน</Link>
                ) : null}
              </p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                className="h-[52px] rounded-xl bg-surface-container-low px-6 font-label-md text-label-md font-bold text-on-surface"
              >
                ย้อน
              </button>
              <button
                type="button"
                onClick={nextFromStep}
                disabled={saving}
                className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? "กำลังบันทึก..." : wizardStep === 8 ? "ส่งให้ admin ตรวจ" : "บันทึกและถัดไป"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {GROUPS.map((group) => (
        <section key={group.id}>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {group.title}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{group.desc}</p>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            {TYPE_OPTIONS.filter((option) => option.group === group.id).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => pickType(option)}
                className="flex flex-col items-start gap-2 rounded-2xl bg-surface-container-lowest p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <span className="material-symbols-outlined text-[24px]">{option.icon}</span>
                </span>
                <span className="font-label-lg text-label-lg font-bold text-on-surface">
                  {option.name}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {option.desc}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
