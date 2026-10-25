"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiAcceptContract, apiGetPayout, apiSavePayout } from "@/app/Api/mainApi";

const CONTRACT_VERSION = "1.0";

const CONTRACT_TEXT = [
  "1. ผู้ลงประกาศรับรองว่าตนมีสิทธิ์ในที่พักที่นำเสนอขาย",
  "2. ข้อมูลที่กรอกต้องเป็นความจริง ห้ามปลอมแปลงรูปภาพหรือข้อมูลใด ๆ",
  "3. ราคาและค่าธรรมเนียมที่แสดงต้องเป็นราคาจริง ณ ขณะที่มีผู้จอง",
  "4. ทางแพลตฟอร์มมีสิทธิ์ระงับหรือถอนประกาศได้หากพบข้อมูลไม่ถูกต้อง",
  "5. การเผยแพร่ประกาศต้องผ่านการตรวจสอบจากผู้ดูแลระบบก่อน",
];

const inputClass =
  "h-12 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

export default function HostPayoutPage() {
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [payout, setPayout] = useState<{
    bankName: string;
    accountHolder: string;
    accountNumberMasked: string;
    status: string;
    rejectedReason: string | null;
  } | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiGetPayout()
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: { payout?: any; contractAcceptedAt?: string | null } | null }).data;
        setPayout(data?.payout ?? null);
        setContractAccepted(data?.contractAcceptedAt != null);
        if (data?.payout) {
          setBankName(data.payout.bankName);
          setAccountHolder(data.payout.accountHolder);
        }
      })
      .catch(() => setError("โหลดข้อมูลไม่สำเร็จ (ต้องล็อกอินก่อน)"));
  }, []);

  const saveBank = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiSavePayout({ bankName, accountHolder, accountNumber });
      setAccountNumber("");
      setNotice("บันทึกบัญชีรับเงินแล้ว รอผู้ดูแลตรวจสอบ");
      const res = await apiGetPayout();
      const data = ((res.data ?? {}) as { data?: { payout?: any } | null }).data;
      setPayout(data?.payout ?? null);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const accept = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiAcceptContract(CONTRACT_VERSION);
      setContractAccepted(true);
      setNotice("บันทึกการยอมรับข้อกำหนดแล้ว");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const ready = contractAccepted && payout?.status === "VERIFIED";

  return (
    <main className="mx-auto w-full max-w-2xl px-margin py-4 md:py-8">
      <Link href="/host/listings" className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        ประกาศของฉัน
      </Link>

      <h1 className="mt-3 font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        บัญชีรับเงินและข้อกำหนด
      </h1>
      <p className="mt-1 font-body-md text-body-md text-tertiary">
        ต้องมีทั้งสองอย่างครบและผ่านการตรวจ ประกาศถึงจะขึ้นเว็บได้
      </p>

      {ready ? (
        <p className="mt-3 rounded-xl bg-primary-container px-4 py-3 font-label-md text-label-md font-bold text-on-primary-container">
          พร้อมเผยแพร่แล้ว — ประกาศของคุณส่งเข้าคิวตรวจได้
        </p>
      ) : null}

      {/* 1. บัญชีรับเงิน */}
      <section className="mt-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">1. บัญชีรับเงิน</h2>

        {payout ? (
          <div className="mt-2 rounded-xl bg-surface-container-low p-3">
            <p className="font-body-md text-body-md text-on-surface">
              {payout.bankName} · {payout.accountHolder} · {payout.accountNumberMasked}
            </p>
            <p className="font-body-sm text-body-sm text-tertiary">
              สถานะ:{" "}
              {payout.status === "VERIFIED"
                ? "ตรวจผ่านแล้ว"
                : payout.status === "REJECTED"
                  ? "ตีกลับ"
                  : "รอตรวจ"}
              {payout.rejectedReason ? ` (${payout.rejectedReason})` : ""}
            </p>
          </div>
        ) : null}

        <div className="mt-3 flex flex-col gap-3">
          <div>
            <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ธนาคาร</p>
            <input value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputClass} placeholder="เช่น กสิกรไทย" />
          </div>
          <div>
            <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">ชื่อเจ้าของบัญชี</p>
            <input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} className={inputClass} />
          </div>
          <div>
            <p className="mb-1 font-label-md text-label-md font-semibold text-on-surface">เลขบัญชี</p>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={inputClass}
              placeholder="ตัวเลขเท่านั้น"
            />
          </div>
          <button
            type="button"
            onClick={saveBank}
            disabled={saving}
            className="h-12 rounded-xl bg-surface-container-high font-headline-sm text-headline-sm font-bold text-on-surface disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : payout ? "แก้ไขบัญชีรับเงิน" : "บันทึกบัญชีรับเงิน"}
          </button>
        </div>
      </section>

      {/* 2. ข้อกำหนด */}
      <section className="mt-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          2. ข้อกำหนดของแพลตฟอร์ม (เวอร์ชัน {CONTRACT_VERSION})
        </h2>
        <ul className="mt-2 flex flex-col gap-1">
          {CONTRACT_TEXT.map((line) => (
            <li key={line} className="font-body-sm text-body-sm text-on-surface-variant">{line}</li>
          ))}
        </ul>

        {contractAccepted ? (
          <p className="mt-3 font-label-md text-label-md font-bold text-secondary">ยอมรับข้อกำหนดแล้ว</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-primary"
              />
              <span className="font-body-md text-body-md text-on-surface">
                ข้าพเจ้ายอมรับข้อกำหนดข้างต้น
              </span>
            </label>
            <button
              type="button"
              onClick={accept}
              disabled={!accepted || saving}
              className="h-12 rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-sm disabled:opacity-60"
            >
              ยอมรับข้อกำหนด
            </button>
          </div>
        )}
      </section>

      {notice !== "" ? <p className="mt-3 font-body-md text-body-md text-secondary">{notice}</p> : null}
      {error !== "" ? <p className="mt-3 font-body-md text-body-md text-error">{error}</p> : null}
    </main>
  );
}