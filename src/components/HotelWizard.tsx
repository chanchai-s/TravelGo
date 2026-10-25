"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetProperty, apiOnboardProperty } from "@/app/Api/mainApi";
import { WizardSteps } from "@/components/WizardSteps";
import { PhotoUploader } from "@/components/PhotoUploader";
import type { HotelSubtypeId } from "@/data/hostTypes";

const STEPS = [
  "ข้อมูลทั่วไป",
  "ที่ตั้ง",
  "ประเภทห้อง",
  "สิ่งอำนวยความสะดวก",
  "รูปภาพ",
  "นโยบาย",
  "สัญญา",
  "ตรวจทาน",
];

const BED_TYPES = ["King", "Queen", "Single", "Twin"];

const GENERAL_OPTIONS = ["WiFi", "สระว่ายน้ำ", "ที่จอดรถ", "สปา", "ฟิตเนส", "ร้านอาหาร", "บาร์"];
const ROOM_OPTIONS = ["แอร์", "ทีวี", "มินิบาร์", "ตู้เซฟ", "อ่างอาบน้ำ", "ระเบียง"];
const DINING_OPTIONS = ["อาหารเช้า", "รูมเซอร์วิส", "คาเฟ่"];

const CANCELLATIONS = ["ยกเลิกฟรีก่อน 7 วัน", "ยกเลิกฟรีก่อน 1 วัน", "ขอคืนไม่ได้"];

const inputClass =
  "h-12 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0066ff]";

type BedRow = { key: number; bedType: string; quantity: string };
type RoomRow = {
  key: number;
  name: string;
  roomSizeSqM: string;
  maxGuests: string;
  basePrice: string;
  totalRooms: string;
  beds: BedRow[];
};

type PhotoRow = { key: number; url: string; caption: string };

type NearbyRow = { key: number; label: string; distance: string; category: string };

const NEARBY_CATEGORIES = ["landmark", "transport", "shopping", "dining"];

let rowKey = 1;
const nextKey = () => {
  rowKey += 1;
  return rowKey;
};

function toNumber(value: string, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) && value.trim() !== "" ? num : fallback;
}

function toggleList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function HotelWizard({
  subtype,
  subtypeName,
}: {
  subtype: HotelSubtypeId;
  subtypeName: string;
}) {
  const [step, setStep] = useState(1);
  const [propertyId, setPropertyId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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
    setStep(8);
    apiGetProperty(draftId)
      .then((res) => {
        const data = (res.data ?? {}) as { data?: Record<string, unknown> };
        setReview(data.data ?? null);
      })
      .catch(() => setReview(null));
  }, []);

  const [name, setName] = useState("");
  const [stars, setStars] = useState("4");
  const [frontDesk, setFrontDesk] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [location, setLocation] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [nearby, setNearby] = useState<NearbyRow[]>([]);

  const [rooms, setRooms] = useState<RoomRow[]>([]);

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

  const save = async (stepNo: number, payload: Record<string, unknown>, status?: string) => {
    setSaving(true);
    setError("");
    try {
      const target = propertyId === "" ? "new" : propertyId;
      const res = await apiOnboardProperty(target, {
        propertyType: subtype,
        currentStep: stepNo,
        ...(status ? { status } : {}),
        ...payload,
      });
      const data = (res.data ?? {}) as { data?: { id?: string } };
      if (data.data?.id) {
        setPropertyId(data.data.id);
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
      setError(code === 401 ? "กรุณา login ก่อน" : code === 403 ? "บัญชีนี้ยังไม่ผ่านการยืนยัน host" : "บันทึกไม่สำเร็จ");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const nextFromStep = async () => {
    if (step === 1) {
      if (name.trim() === "") {
        setError("กรุณากรอกชื่อที่พัก");
        return;
      }
      const ok = await save(1, {
        name: name.trim(),
        stars: toNumber(stars, 3),
        frontDesk24h: frontDesk,
        breakfastIncluded: breakfast,
        description: description.trim() === "" ? null : description.trim(),
        phone: phone.trim() === "" ? null : phone.trim(),
        email: email.trim() === "" ? null : email.trim(),
      });
      if (ok) {
        setStep(2);
      }
      return;
    }
    if (step === 2) {
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
        setStep(3);
      }
      return;
    }
    if (step === 3) {
      const ok = await save(3, {
        roomTypes: rooms
          .filter((room) => room.name.trim() !== "")
          .map((room) => ({
            name: room.name.trim(),
            roomSizeSqM: room.roomSizeSqM.trim() === "" ? null : toNumber(room.roomSizeSqM),
            maxGuests: toNumber(room.maxGuests, 2),
            basePrice: toNumber(room.basePrice),
            totalRooms: toNumber(room.totalRooms, 1),
            beds: room.beds
              .filter((bed) => bed.bedType !== "")
              .map((bed) => ({ bedType: bed.bedType, quantity: toNumber(bed.quantity, 1) })),
          })),
      });
      if (ok) {
        setStep(4);
      }
      return;
    }
    if (step === 4) {
      const ok = await save(4, {
        amenities: { generalAmenities: general, roomAmenities: roomAm, diningServices: dining, petFriendly },
      });
      if (ok) {
        setStep(5);
      }
      return;
    }
    if (step === 5) {
      const ok = await save(5, {
        photos: photos
          .filter((photo) => photo.url.trim() !== "")
          .map((photo) => ({ url: photo.url.trim(), caption: photo.caption.trim() })),
      });
      if (ok) {
        setStep(6);
      }
      return;
    }
    if (step === 6) {
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
        setStep(7);
      }
      return;
    }
    if (step === 7) {
      if (!agreed) {
        setError("กรุณายอมรับเงื่อนไขก่อน");
        return;
      }
      setStep(8);
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
      setDone(true);
    }
  };

  const addRoom = () =>
    setRooms((prev) => [
      ...prev,
      { key: nextKey(), name: "", roomSizeSqM: "", maxGuests: "2", basePrice: "", totalRooms: "1", beds: [] },
    ]);

  const updateRoom = (key: number, patch: Partial<RoomRow>) =>
    setRooms((prev) => prev.map((room) => (room.key === key ? { ...room, ...patch } : room)));

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
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <WizardSteps steps={STEPS} current={step} onSelect={(next) => next < step && setStep(next)} />
      </div>

      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <p className="mb-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
          {subtypeName} • ขั้น {step}/8 {STEPS[step - 1]}
        </p>

        {step === 1 ? (
          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ชื่อที่พัก</p>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="เช่น Sukhumvit Suites" />
            </div>
            <div>
              <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ดาว</p>
              <select value={stars} onChange={(e) => setStars(e.target.value)} className={inputClass}>
                {["3", "4", "5"].map((star) => (
                  <option key={star} value={star}>{star} ดาว</option>
                ))}
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 font-body-md text-body-md text-on-surface">
              <input type="checkbox" checked={frontDesk} onChange={(e) => setFrontDesk(e.target.checked)} className="h-5 w-5 accent-primary" />
              ฟรอนต์ 24 ชม.
            </label>
            <label className="flex cursor-pointer items-center gap-2 font-body-md text-body-md text-on-surface">
              <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} className="h-5 w-5 accent-primary" />
              มีอาหารเช้า
            </label>
            <div>
              <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">คำอธิบาย</p>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="จุดเด่นที่พัก" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เบอร์ติดต่อ</p>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="02-xxx-xxxx" />
              </div>
              <div>
                <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">อีเมล</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="hello@hotel.com" />
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ทำเล (เมือง)</p>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="เชียงใหม่" />
            </div>
            <div>
              <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ที่อยู่</p>
              <input value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className={inputClass} placeholder="เลขที่ ถนน" />
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
                    setNearby((prev) => [...prev, { key: nextKey(), label: "", distance: "", category: "landmark" }])
                  }
                  className="rounded-xl bg-surface-container-low py-2.5 font-label-md text-label-md font-bold text-primary"
                >
                  + เพิ่มสถานที่
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-3">
            {rooms.map((room) => (
              <div key={room.key} className="rounded-xl bg-surface-container-low p-3">
                <div className="flex items-center justify-between">
                  <p className="font-label-md text-label-md font-bold text-on-surface">ห้องพัก</p>
                  <button
                    type="button"
                    onClick={() => setRooms((prev) => prev.filter((item) => item.key !== room.key))}
                    className="font-label-sm text-label-sm font-bold text-error"
                  >
                    ลบ
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input value={room.name} onChange={(e) => updateRoom(room.key, { name: e.target.value })} placeholder="Deluxe Room" className={inputClass} />
                  <input value={room.basePrice} onChange={(e) => updateRoom(room.key, { basePrice: e.target.value })} inputMode="numeric" placeholder="ราคา/คืน" className={inputClass} />
                  <input value={room.roomSizeSqM} onChange={(e) => updateRoom(room.key, { roomSizeSqM: e.target.value })} inputMode="decimal" placeholder="ขนาด ตร.ม." className={inputClass} />
                  <input value={room.maxGuests} onChange={(e) => updateRoom(room.key, { maxGuests: e.target.value })} inputMode="numeric" placeholder="พักได้ (คน)" className={inputClass} />
                  <input value={room.totalRooms} onChange={(e) => updateRoom(room.key, { totalRooms: e.target.value })} inputMode="numeric" placeholder="จำนวนห้อง" className={inputClass} />
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {room.beds.map((bed, bedIndex) => (
                    <div key={bed.key} className="flex items-center gap-2">
                      <select
                        value={bed.bedType}
                        onChange={(e) =>
                          updateRoom(room.key, {
                            beds: room.beds.map((item, index) =>
                              index === bedIndex ? { ...item, bedType: e.target.value } : item,
                            ),
                          })
                        }
                        className="h-11 flex-1 rounded-xl bg-surface-container-lowest px-2 text-sm text-on-surface outline-none"
                      >
                        <option value="">เลือกเตียง</option>
                        {BED_TYPES.map((bedType) => (
                          <option key={bedType} value={bedType}>{bedType}</option>
                        ))}
                      </select>
                      <input
                        value={bed.quantity}
                        onChange={(e) =>
                          updateRoom(room.key, {
                            beds: room.beds.map((item, index) =>
                              index === bedIndex ? { ...item, quantity: e.target.value } : item,
                            ),
                          })
                        }
                        inputMode="numeric"
                        placeholder="จำนวน"
                        className="h-11 w-20 rounded-xl bg-surface-container-lowest px-2 text-sm text-on-surface outline-none"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateRoom(room.key, {
                        beds: [...room.beds, { key: nextKey(), bedType: "", quantity: "1" }],
                      })
                    }
                    className="font-label-md text-label-md font-bold text-primary"
                  >
                    + เพิ่มเตียง
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRoom}
              className="rounded-xl bg-surface-container-low py-3 font-label-md text-label-md font-bold text-primary"
            >
              + เพิ่มประเภทห้อง
            </button>
          </div>
        ) : null}

        {step === 4 ? (
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

        {step === 5 ? (
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
onClick={() => setPhotos((prev) => [...prev, { key: nextKey(), url: "", caption: "" }])}
              className="rounded-xl bg-surface-container-low py-3 font-label-md text-label-md font-bold text-primary"
            >
              + เพิ่ม (URL)
            </button>
            <p className="text-center font-body-sm text-body-sm text-tertiary">
              หรือเลือกรูปจากเครื่องด้า��ล่าง
            </p>
            <PhotoUploader
              onUploaded={(fileUrl) =>
                setPhotos((prev) => [...prev, { key: nextKey(), url: fileUrl, caption: "" }])
              }
            />
          </div>
        ) : null}

        {step === 6 ? (
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

        {step === 7 ? (
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

        {step === 8 ? (
          <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface">
            <p><span className="font-bold">ชื่อ:</span> {name}</p>
            <p><span className="font-bold">ทำเล:</span> {location}</p>
            <p><span className="font-bold">ห้อง:</span> {review !== null ? String((review as { roomTypes?: unknown[] })?.roomTypes?.length ?? rooms.length) : rooms.length} ประเภท</p>
            <p><span className="font-bold">รูป:</span> {photos.filter((photo) => photo.url.trim() !== "").length} รูป</p>
            <p><span className="font-bold">นโยบาย:</span> {checkIn} / {checkOut} / {cancellation}</p>
          </div>
        ) : null}

        {error !== "" ? (
          <p className="mt-3 font-body-md text-body-md text-error">{error}</p>
        ) : null}

        <div className="mt-4 flex gap-2">
          {step > 1 && step < 8 ? (
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
          ) : null}
          <button
            type="button"
            onClick={nextFromStep}
            disabled={saving}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : step === 8 ? "ส่งให้ admin ตรวจ" : step === 7 ? "ถัดไป" : "บันทึกและถัดไป"}
          </button>
        </div>
      </div>
    </div>
  );
}
