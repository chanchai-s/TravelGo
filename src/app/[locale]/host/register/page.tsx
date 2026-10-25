"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiHostAddDocument, apiHostApply, apiHostMe, apiUploadDoc } from "@/app/Api/mainApi";

const DOC_TYPES = [
  { key: "NATIONAL_ID", label: "บัตรประชาชน / หนังสือเดินทาง" },
  { key: "PROPERTY_DEED", label: "โฉนด / สัญญาเช่า" },
  { key: "DRIVING_LICENSE", label: "ใบขับขี่" },
  { key: "REGISTERED_COMPANY", label: "หนังสือรับรองบริษัท" },
];

const inputClass =
  "h-12 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

export default function HostRegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [accountType, setAccountType] = useState("INDIVIDUAL");
  const [taxId, setTaxId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [docType, setDocType] = useState("NATIONAL_ID");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // ถ้าสมัครไว้แล้วให้ไปหน้าสถานะ
  useEffect(() => {
    apiHostMe()
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: { status?: string } }).data;
        if (data !== null && data !== undefined) {
          router.replace("/host/status");
        }
      })
      .catch(() => undefined);
  }, [router]);

  const pickFile = async (file: File | undefined) => {
    if (file === undefined) {
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await apiUploadDoc(file);
      const data = (res.data ?? {}) as { data?: { fileUrl?: string } };
      setFileUrl(data.data?.fileUrl ?? "");
    } catch {
      setError("อัปโหลดไฟล์ไม่สำเร็จ (รองรับ pdf หรือรูปภาพ ไม่เกิน 5 MB)");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (displayName.trim() === "") {
      setError("กรุณากรอกชื่อที่แสดงต่อลูกค้า");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiHostApply({
        displayName: displayName.trim(),
        accountType,
        taxId: taxId.trim(),
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
      });
      if (fileUrl !== "") {
        await apiHostAddDocument({ docType, fileUrl });
      }
      router.push("/host/status");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ส่งคำขอไม่สำเร็จ (ต้องล็อกอินก่อน)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-margin py-4 md:py-8">
      <Link href="/host" className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        กลับ
      </Link>

      <h1 className="mt-3 font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        สมัครเป็นเจ้าของที่พัก
      </h1>
      <p className="mt-1 font-body-md text-body-md text-tertiary">
        กรอกข้อมูลและส่งเอกสารยืนยันตัวตน แอดมินจะตรวจแล้วแจ้งผลทางหน้าสถานะ
      </p>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <div>
          <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
            ชื่อที่แสดงต่อลูกค้า
          </p>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className={inputClass}
            placeholder="เช่น บ้านสวนพาร์ทเนอร์"
          />
        </div>

        <div>
          <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
            ประเภทผู้สมัคร
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "INDIVIDUAL", label: "บุคคลธรรมดา" },
              { key: "COMPANY", label: "นิติบุคคล / บริษัท" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setAccountType(item.key)}
                className={`h-12 rounded-xl font-label-md text-label-md font-bold ${
                  accountType === item.key
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {accountType === "COMPANY" ? (
          <div>
            <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เลขภาษี</p>
            <input value={taxId} onChange={(event) => setTaxId(event.target.value)} className={inputClass} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ผู้ติดต่อ</p>
            <input
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เบอร์ติดต่อ</p>
            <input
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              className={inputClass}
              placeholder="08x-xxx-xxxx"
            />
          </div>
        </div>

        <div>
          <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">
            เอกสารยืนยันตัวตน
          </p>
          <select value={docType} onChange={(event) => setDocType(event.target.value)} className={inputClass}>
            {DOC_TYPES.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
          <label className="mt-2 flex cursor-pointer flex-col items-center gap-1 rounded-xl bg-surface-container-low p-4 text-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(event) => pickFile(event.target.files?.[0])}
            />
            <span className="font-label-md text-label-md font-semibold text-primary">
              {uploading ? "กำลังอัปโหลด..." : fileUrl === "" ? "เลือกไฟล์" : "เปลี่ยนไฟล์"}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary">
              {fileUrl === "" ? "รองรับ pdf หรือรูปภาพ ไม่เกิน 5 MB" : fileUrl}
            </span>
          </label>
        </div>

        {error !== "" ? <p className="font-body-md text-body-md text-error">{error}</p> : null}
        {notice !== "" ? <p className="font-body-md text-body-md text-secondary">{notice}</p> : null}

        <button
          type="button"
          onClick={submit}
          disabled={saving || uploading}
          className="h-12 rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md disabled:opacity-60"
        >
          {saving ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
        </button>
      </div>
    </main>
  );
}