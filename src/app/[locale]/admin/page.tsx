"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  apiAdminApproveAll,
  apiAdminApproveStay,
  apiAdminHosts,
  apiAdminLogs,
  apiAdminPayouts,
  apiAdminRejectPayoutRequest,
  apiAdminSendPayout,
  apiAdminRejectHost,
  apiAdminRejectStay,
  apiAdminStays,
  apiAdminVerifyHost,
  apiAdminVerifyPayout,
  apiGetProfile,
} from "@/app/Api/mainApi";

type Paged = { total: number; page: number; size: number; totalPages: number };

const STAY_TABS = [
  { key: "PENDING_REVIEW", label: "รอตรวจประกาศ" },
  { key: "REJECTED", label: "ตีกลับแล้ว" },
  { key: "DRAFT", label: "ร่าง" },
  { key: "PUBLISHED", label: "ขึ้นแล้ว" },
];

const HOST_TABS = [
  { key: "PENDING", label: "รอตรวจเจ้าของ" },
  { key: "VERIFIED", label: "ยืนยันแล้ว" },
  { key: "REJECTED", label: "ตีกลับแล้ว" },
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("stays");
  const [status, setStatus] = useState("PENDING_REVIEW");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [meta, setMeta] = useState<Paged>({ total: 0, page: 1, size: 20, totalPages: 1 });
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // เช็คสิทธิ์ก่อน — ไม่ใช่แอดมินให้เด้งกลับ
  useEffect(() => {
    apiGetProfile()
      .then((res) => {
        const user = ((res.data ?? {}) as { user?: { role?: string } }).user;
        if (user?.role !== "ADMIN") {
          router.replace("/homepage");
        }
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "stays") {
        const res = await apiAdminStays({ status, page });
        const data = ((res.data ?? {}) as { data?: { items?: Record<string, unknown>[] } & Paged }).data;
        setItems(data?.items ?? []);
        setMeta(data ?? { total: 0, page: 1, size: 20, totalPages: 1 });
      } else if (tab === "hosts") {
        const res = await apiAdminHosts({ status, page });
        const data = ((res.data ?? {}) as { data?: { items?: Record<string, unknown>[] } & Paged }).data;
        setItems(data?.items ?? []);
        setMeta(data ?? { total: 0, page: 1, size: 20, totalPages: 1 });
      } else if (tab === "payouts") {
        const res = await apiAdminPayouts(status);
        const data = ((res.data ?? {}) as { data?: Record<string, unknown>[] }).data;
        setItems(data ?? []);
        setMeta({ total: data?.length ?? 0, page: 1, size: 20, totalPages: 1 });
      } else {
        const res = await apiAdminLogs({ page });
        const data = ((res.data ?? {}) as { data?: { items?: Record<string, unknown>[] } }).data;
        setLogs(data?.items ?? []);
        setMeta({ total: data?.items?.length ?? 0, page, size: 20, totalPages: 1 });
      }
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      setError(code === 403 ? "ไม่มีสิทธิ์แอดมิน" : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [tab, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<unknown>, okText: string) => {
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(okText);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ทำรายการไม่สำเร็จ");
    }
  };

  // ตีกลับต้องมีเหตุผล
  const askReason = (): string => {
    const reason = window.prompt("เหตุผลที่ตีกลับ (เจ้าของจะเห็นข้อความนี้)");
    return (reason ?? "").trim();
  };

  const tabs = tab === "stays" ? STAY_TABS : HOST_TABS;
  const payoutTabs = [
    { key: "PENDING", label: "รอจ่าย" },
    { key: "PROCESSING", label: "กำลังโอน" },
    { key: "PAID", label: "จ่ายแล้ว" },
    { key: "FAILED", label: "ไม่สำเร็จ" },
    { key: "ALL", label: "ทั้งหมด" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        หลังบ้านสำหรับแอดมิน
      </h1>

      <div className="mt-4 flex gap-2">
        {[
          { key: "stays", label: "ประกาศที่พัก" },
          { key: "hosts", label: "เจ้าของที่พัก" },
          { key: "payouts", label: "คิวจ่ายเงิน" },
          { key: "logs", label: "ประวัติการตรวจ" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setTab(item.key);
              setPage(1);
              setStatus(
                item.key === "stays"
                  ? "PENDING_REVIEW"
                  : item.key === "payouts"
                    ? "PENDING"
                    : "PENDING",
              );
            }}
            className={`h-11 rounded-xl px-4 font-label-md text-label-md font-bold ${
              tab === item.key
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "payouts" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {payoutTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatus(item.key)}
              className={`h-9 rounded-full px-3 font-label-sm text-label-sm font-semibold ${
                status === item.key
                  ? "bg-secondary-container text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : tab !== "logs" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setStatus(item.key);
                setPage(1);
              }}
              className={`h-9 rounded-full px-3 font-label-sm text-label-sm font-semibold ${
                status === item.key
                  ? "bg-secondary-container text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {tab === "stays" && status === "PENDING_REVIEW" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-surface-container-low p-3">
          <button
            type="button"
            onClick={() =>
              run(async () => {
                const res = await apiAdminApproveAll();
                const data = ((res.data ?? {}) as { data?: { approved: string[]; skipped: { name: string; reason: string }[] } }).data;
                setNotice(
                  `อนุมัติแล้ว ${data?.approved.length ?? 0} รายการ · ข้าม ${data?.skipped.length ?? 0} รายการ` +
                    (data?.skipped.length ? ` (${data.skipped[0].reason})` : ""),
                );
              }, "")
            }
            className="h-11 rounded-xl bg-primary px-5 font-label-md text-label-md font-bold text-on-primary shadow-sm"
          >
            อนุมัติทั้งหมดในคิว
          </button>
          <p className="font-body-sm text-body-sm text-tertiary">
            รายการที่ยังขาดเงื่อนไข (เช่น ยังไม่มีบัญชีรับเงิน) จะถูกข้าม
          </p>
        </div>
      ) : null}

      {notice !== "" ? (
        <p className="mt-3 font-body-md text-body-md text-secondary">{notice}</p>
      ) : null}
      {error !== "" ? (
        <p className="mt-3 font-body-md text-body-md text-error">{error}</p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        {loading ? <p className="font-body-md text-body-md text-tertiary">กำลังโหลด...</p> : null}

        {!loading && tab === "stays"
          ? items.map((item) => {
              const host = item.host as { displayName?: string; user?: { email?: string } } | null;
              return (
                <div
                  key={String(item.id)}
                  className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/stays/${String(item.id)}`}
                      className="font-headline-sm text-headline-sm font-bold text-on-surface hover:text-primary"
                    >
                      {String(item.name)}
                    </Link>
                    <p className="font-body-sm text-body-sm text-tertiary">
                      {String(item.location ?? "-")} · {String(item.propertyType)} ·{" "}
                      {Number(item.pricePerNight ?? 0).toLocaleString()} บาท
                    </p>
                    <p className="font-body-sm text-body-sm text-tertiary">
                      เจ้าของ: {host?.displayName ?? host?.user?.email ?? "ไม่มี"} · ขั้นที่{" "}
                      {String(item.currentStep)}
                    </p>
                    {item.rejectedReason ? (
                      <p className="font-body-sm text-body-sm text-error">
                        เหตุผลที่ตีกลับ: {String(item.rejectedReason)}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/stays/${String(item.id)}`}
                      className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface"
                    >
                      ดูก่อน
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        run(
                          () => apiAdminApproveStay(String(item.id)),
                          "อนุมัติแล้ว ประกาศขึ้นเว็บเรียบร้อย",
                        )
                      }
                      className="h-11 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary shadow-sm"
                    >
                      อนุมัติ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reason = askReason();
                        if (reason !== "") {
                          run(
                            () => apiAdminRejectStay(String(item.id), reason),
                            "ตีกลับแล้ว เจ้าของแก้แล้วส่งใหม่ได้",
                          );
                        }
                      }}
                      className="h-11 rounded-xl bg-error-container px-4 font-label-md text-label-md font-bold text-on-error-container"
                    >
                      ตีกลับ
                    </button>
                  </div>
                </div>
              );
            })
          : null}

        {!loading && tab === "hosts"
          ? items.map((item) => {
              const user = item.user as { name?: string; email?: string } | null;
              const stays = (item.stays as { id: string; name: string }[]) ?? [];
              const payout = item.payoutAccount as { id: string; status: string; bankName: string } | null;
              return (
                <div
                  key={String(item.id)}
                  className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {String(item.displayName ?? user?.name ?? "-")}
                    </p>
                    <p className="font-body-sm text-body-sm text-tertiary">
                      {user?.email ?? "-"} · {String(item.accountType)}
                      {item.contactPhone ? ` · ${String(item.contactPhone)}` : ""}
                    </p>
                    <p className="font-body-sm text-body-sm text-tertiary">
                      ประกาศ {stays.length} รายการ
                    </p>
                    {item.rejectedReason ? (
                      <p className="font-body-sm text-body-sm text-error">
                        เหตุผลที่ตีกลับ: {String(item.rejectedReason)}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {payout && payout.status !== "VERIFIED" && item.status === "VERIFIED" ? (
                      <button
                        type="button"
                        onClick={() =>
                          run(
                            () => apiAdminVerifyPayout(String(item.id)),
                            "ตรวจบัญชีรับเงินแล้ว",
                          )
                        }
                        className="h-11 rounded-xl bg-primary-fixed px-4 font-label-md text-label-md font-bold text-on-primary-fixed"
                      >
                        ตรวจบัญชีรับเงิน
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() =>
                        run(
                          () => apiAdminVerifyHost(String(item.id)),
                          "ยืนยันเจ้าของแล้ว",
                        )
                      }
                      className="h-11 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary shadow-sm"
                    >
                      ยืนยันเจ้าของ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reason = askReason();
                        if (reason !== "") {
                          run(
                            () => apiAdminRejectHost(String(item.id), reason),
                            "ตีกลับเจ้าของแล้ว",
                          );
                        }
                      }}
                      className="h-11 rounded-xl bg-error-container px-4 font-label-md text-label-md font-bold text-on-error-container"
                    >
                      ตีกลับ
                    </button>
                  </div>
                </div>
              );
            })
          : null}

        {!loading && tab === "payouts"
          ? items.map((item) => (
              <div
                key={String(item.id)}
                className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    ฿{Number(item.amount ?? 0).toLocaleString()}
                  </p>
                  <p className="font-body-sm text-body-sm text-tertiary">
                    ขอเมื่อ {String(item.requestedAt).slice(0, 16).replace("T", " ")}
                    {item.providerRef ? ` · ${String(item.providerRef)}` : ""}
                    {item.note ? ` · ${String(item.note)}` : ""}
                  </p>
                </div>
                {item.status === "PENDING" ? (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        run(() => apiAdminSendPayout(String(item.id)), "สั่งจ่ายแล้ว")
                      }
                      className="h-11 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary shadow-sm"
                    >
                      สั่งจ่าย
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reason = askReason();
                        if (reason !== "") {
                          run(() => apiAdminRejectPayoutRequest(String(item.id), reason), "ปฏิเสธคิวจ่ายแล้ว");
                        }
                      }}
                      className="h-11 rounded-xl bg-error-container px-4 font-label-md text-label-md font-bold text-on-error-container"
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                ) : (
                  <span className="shrink-0 rounded-full bg-surface-container-high px-3 py-1 font-label-sm text-label-sm font-bold text-on-surface-variant">
                    {String(item.status)}
                  </span>
                )}
              </div>
            ))
          : null}

        {!loading && tab === "logs"
          ? logs.map((item) => (
              <div
                key={String(item.id)}
                className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"
              >
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  {String(item.action)}
                </p>
                <p className="font-body-sm text-body-sm text-tertiary">
                  โดย {String(item.actorId)} · {String(item.createdAt).slice(0, 16).replace("T", " ")}
                </p>
                {item.reason ? (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    เหตุผล: {String(item.reason)}
                  </p>
                ) : null}
              </div>
            ))
          : null}

        {!loading && tab !== "logs" && items.length === 0 ? (
          <p className="rounded-2xl bg-surface-container-lowest p-8 text-center font-body-md text-body-md text-tertiary shadow-sm">
            ไม่มีรายการในคิวนี้
          </p>
        ) : null}
      </div>

      {tab !== "logs" && meta.totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="h-10 rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span className="font-body-sm text-body-sm text-tertiary">
            หน้า {meta.page} / {meta.totalPages} (ทั้งหมด {meta.total})
          </span>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="h-10 rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      ) : null}
    </main>
  );
}