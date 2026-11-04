"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  apiCreateSavedAddress,
  apiDeleteSavedAddress,
  apiSavedAddresses,
  apiUpdateSavedAddress,
  type RidePoint,
  type SavedAddress,
} from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { BottomSheet } from "@/components/ride/BottomSheet";
import { LocationPicker } from "@/components/ride/LocationPicker";
import { EmptyState } from "@/components/ride/EmptyState";

const inputClass =
  "h-11 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const ready = useAuthStore((state) => state.ready);
  const logout = useAuthStore((state) => state.logout);

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [label, setLabel] = useState("บ้าน");
  const [point, setPoint] = useState<RidePoint | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // รูปจาก Google โหลดไม่ขึ้น (เช่น URL หมดอายุ) → กลับไปใช้ตัวอักษรแรก
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  useEffect(() => {
    if (ready && token === null) {
      router.replace("/login?next=/profile");
    }
  }, [ready, token, router]);

  const load = async () => {
    if (token === null) {
      return;
    }
    setLoading(true);
    try {
      const res = await apiSavedAddresses();
      setAddresses((res.data?.data ?? []) as SavedAddress[]);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openCreate = () => {
    setEditing(null);
    setLabel("บ้าน");
    setPoint(null);
    setIsDefault(false);
    setError("");
    setSheetOpen(true);
  };

  const openEdit = (address: SavedAddress) => {
    setEditing(address);
    setLabel(address.label);
    setPoint({ lat: address.lat, lng: address.lng, address: address.address });
    setIsDefault(address.isDefault);
    setError("");
    setSheetOpen(true);
  };

  const save = async () => {
    if (point === null || label.trim() === "") {
      setError("กรุณาตั้งชื่อและเลือกที่อยู่");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (editing) {
        await apiUpdateSavedAddress(editing.id, {
          label: label.trim(),
          address: point.address,
          lat: point.lat,
          lng: point.lng,
          isDefault,
        });
      } else {
        await apiCreateSavedAddress({
          label: label.trim(),
          address: point.address,
          lat: point.lat,
          lng: point.lng,
          isDefault,
        });
      }
      setSheetOpen(false);
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "บันทึกที่อยู่ไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (address: SavedAddress) => {
    setBusy(true);
    try {
      await apiDeleteSavedAddress(address.id);
      await load();
    } catch {
      // เงียบไว้ แสดงรายการเดิม
    } finally {
      setBusy(false);
    }
  };

  if (!ready || token === null) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-3xl">
      <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface">โปรไฟล์</h1>
      <p className="font-body-sm text-body-sm text-tertiary">
        บัญชีเดียวใช้ได้ทั้งเรียกโดยสาร ส่งพัสดุ และเป็นคนขับ
      </p>

      <section className="mt-3 flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        {user?.avatarUrl !== undefined &&
        user.avatarUrl !== null &&
        user.avatarUrl !== "" &&
        !avatarFailed ? (
          <img
            src={user.avatarUrl}
            alt={user?.name ?? "รูปโปรไฟล์"}
            className="h-14 w-14 shrink-0 rounded-full bg-surface-container object-cover"
            referrerPolicy="no-referrer"
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-headline-sm text-headline-sm font-bold text-on-primary">
            {user?.name?.charAt(0) ?? "U"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-label-lg text-label-lg font-bold text-on-surface">
            {user?.name ?? "-"}
          </p>
          <p className="truncate font-body-sm text-body-sm text-tertiary">{user?.email ?? "-"}</p>
          <p className="font-body-sm text-body-sm text-tertiary">{user?.phone ?? "ยังไม่มีเบอร์โทร"}</p>
        </div>
        {user?.role === "ADMIN" ? (
          <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-[10px] font-bold text-on-secondary">
            ADMIN
          </span>
        ) : null}
      </section>

      <section className="mt-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            ที่อยู่ที่บันทึกไว้
          </h2>
          <button
            type="button"
            onClick={openCreate}
            className="flex h-9 items-center gap-1 rounded-full bg-primary px-3 font-label-md text-label-md text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            เพิ่ม
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {loading ? (
            <p className="py-6 text-center font-body-sm text-body-sm text-tertiary">กำลังโหลด...</p>
          ) : addresses.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="ยังไม่มีที่อยู่ที่บันทึกไว้"
              description="บันทึกบ้านหรือที่ทำงานเพื่อเรียกใช้บริการได้เร็วขึ้น"
              action={
                <button
                  type="button"
                  onClick={openCreate}
                  className="rounded-xl bg-primary px-4 py-2 font-label-md text-label-md text-on-primary"
                >
                  เพิ่มที่อยู่
                </button>
              }
            />
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    {address.label === "บ้าน" ? "home" : address.label === "ที่ทำงาน" ? "work" : "place"}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate font-label-md text-label-md font-bold text-on-surface">
                    {address.label}
                    {address.isDefault ? (
                      <span className="rounded-full bg-success-container px-1.5 py-0.5 font-label-sm text-[9px] font-bold text-on-success-container">
                        ค่าเริ่มต้น
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate font-body-sm text-body-sm text-tertiary">{address.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
                  aria-label="แก้ไข"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => void remove(address)}
                  disabled={busy}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-error-container text-on-error-container disabled:opacity-50"
                  aria-label="ลบ"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href="/ride/history"
          className="flex items-center gap-2 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">history</span>
          <span className="font-label-md text-label-md text-on-surface">ประวัติเดินทาง</span>
        </Link>
        <Link
          href="/ride/fleet"
          className="flex items-center gap-2 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">directions_car</span>
          <span className="font-label-md text-label-md text-on-surface">ประเภทรถ</span>
        </Link>
        <Link
          href="/driver/status"
          className="flex items-center gap-2 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">directions_car</span>
          <span className="font-label-md text-label-md text-on-surface">สถานะคนขับ</span>
        </Link>
        <Link
          href="/driver/earnings"
          className="flex items-center gap-2 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">payments</span>
          <span className="font-label-md text-label-md text-on-surface">รายได้</span>
        </Link>
        {user?.role === "ADMIN" ? (
          <Link
            href="/admin/rides"
            className="col-span-2 flex items-center gap-2 rounded-2xl bg-secondary-container p-3"
          >
            <span className="material-symbols-outlined text-[20px] text-on-secondary">shield_person</span>
            <span className="font-label-md text-label-md font-bold text-on-secondary">
              Ride Ops Console
            </span>
          </Link>
        ) : null}
      </section>

      <button
        type="button"
        onClick={() => {
          logout();
          router.replace("/login");
        }}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-surface-container-low font-label-md text-label-md font-semibold text-error"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        ออกจากระบบ
      </button>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"}
        subtitle="ใช้เป็นจุดรับ-ส่งได้ทันที"
        footer={
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="h-12 w-full rounded-xl bg-primary font-label-lg text-label-lg font-bold text-on-primary disabled:opacity-60"
          >
            {busy ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        }
      >
        <div className="flex flex-col gap-3 pb-2">
          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">ชื่อที่อยู่</span>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="บ้าน / ที่ทำงาน"
              className={inputClass}
            />
          </label>

          <div>
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">ตำแหน่ง</p>
            <LocationPicker
              label="เลือกที่อยู่"
              value={point}
              onChange={setPoint}
              saved={addresses}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2.5">
            <span className="font-body-sm text-body-sm text-on-surface">ตั้งเป็นค่าเริ่มต้น</span>
            <button
              type="button"
              onClick={() => setIsDefault((value) => !value)}
              aria-pressed={isDefault}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isDefault ? "bg-primary" : "bg-outline-variant"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  isDefault ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {error !== "" ? (
            <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          ) : null}
        </div>
      </BottomSheet>
    </main>
  );
}
