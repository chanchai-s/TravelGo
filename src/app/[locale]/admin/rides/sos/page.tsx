"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiAdminAckSos, apiAdminCloseSos, apiAdminSosList } from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { connectRideSocket } from "@/app/Api/rideSocket";
import { AdminGate } from "@/components/ride/AdminGate";
import { EmptyState } from "@/components/ride/EmptyState";
import { formatDateTime } from "@/lib/rideFormat";

type SosEvent = {
  id: string;
  jobId: string;
  userId: string;
  lat: number | null;
  lng: number | null;
  note: string | null;
  status: string;
  createdAt: string;
  handledAt: string | null;
  job: {
    id: string;
    ref: string;
    serviceType: string;
    status: string;
    pickupAddress: string;
    dropoffAddress: string;
    rider: { id: string; name: string; phone: string | null } | null;
    driver: { id: string; name: string; phone: string | null } | null;
  } | null;
};

const TABS = [
  { key: "OPEN", label: "ใหม่" },
  { key: "ACK", label: "รับเรื่องแล้ว" },
  { key: "CLOSED", label: "ปิดแล้ว" },
  { key: "ALL", label: "ทั้งหมด" },
];

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

function AdminSosPageInner() {
  const token = useAuthStore((state) => state.token);
  const [items, setItems] = useState<SosEvent[]>([]);
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [liveCount, setLiveCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiAdminSosList(status === "ALL" ? undefined : status);
      setItems((res.data?.data?.items ?? []) as SosEvent[]);
    } catch (err: unknown) {
      setError(messageOf(err, "โหลดเหตุ SOS ไม่สำเร็จ"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  // ฟังเหตุใหม่แบบเรียลไทม์
  useEffect(() => {
    if (token === null) {
      return;
    }
    const socket = connectRideSocket(token);
    if (socket === null) {
      return;
    }
    const onNew = (payload: SosEvent) => {
      setLiveCount((value) => value + 1);
      setItems((current) =>
        current.some((item) => item.id === payload.id) ? current : [payload, ...current],
      );
    };
    socket.on("sos:new", onNew);
    return () => {
      socket.off("sos:new", onNew);
    };
  }, [token]);

  const act = async (event: SosEvent, action: "ack" | "close") => {
    setBusy(event.id);
    setError("");
    try {
      await (action === "ack" ? apiAdminAckSos(event.id) : apiAdminCloseSos(event.id));
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "อัปเดตเหตุไม่สำเร็จ"));
    } finally {
      setBusy("");
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/rides"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <h1 className="flex items-center gap-1 font-headline-sm text-headline-sm font-extrabold text-on-surface">
          <span className="material-symbols-outlined text-[22px] text-error">emergency</span>
          SOS Console
        </h1>
        <span className="w-10" />
      </div>

      {liveCount > 0 ? (
        <p className="mt-2 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm font-semibold text-on-error-container">
          มีเหตุใหม่เข้ามา {liveCount} ครั้งระหว่างเปิดหน้านี้
        </p>
      ) : null}

      <div className="mt-3 flex gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`flex-1 rounded-full px-3 py-1.5 font-label-sm text-label-sm transition-all ${
              status === tab.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error !== "" ? (
        <p className="mt-2 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-2">
        {loading ? (
          <div className="flex min-h-[25vh] items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
              progress_activity
            </span>
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <EmptyState
            icon="shield"
            title="ไม่มีเหตุในสถานะนี้"
            description="เมื่อมีผู้แจ้ง SOS รายการจะขึ้นที่นี่ทันที"
          />
        ) : null}

        {items.map((event) => {
          const isOpen = event.status === "OPEN";
          const isAck = event.status === "ACK";
          return (
            <div
              key={event.id}
              className={`rounded-2xl p-3 shadow-sm ${
                isOpen
                  ? "border-2 border-error bg-error-container/40"
                  : "bg-surface-container-lowest"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-1.5 font-label-md text-label-md font-bold text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-error">emergency</span>
                    {event.job?.ref ?? event.jobId}
                    <span
                      className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                        isOpen
                          ? "bg-error text-on-error"
                          : isAck
                            ? "bg-warning-container text-on-warning-container"
                            : "bg-success-container text-on-success-container"
                      }`}
                    >
                      {isOpen ? "ใหม่" : isAck ? "รับเรื่อง" : "ปิดแล้ว"}
                    </span>
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {event.job ? `${event.job.pickupAddress} → ${event.job.dropoffAddress}` : "-"}
                  </p>
                  <p className="font-label-sm text-label-sm text-tertiary">
                    แจ้งเมื่อ {formatDateTime(event.createdAt)}
                    {event.handledAt ? ` • รับเรื่อง ${formatDateTime(event.handledAt)}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div className="rounded-xl bg-surface-container-low px-2.5 py-1.5">
                  <p className="font-label-sm text-label-sm text-tertiary">ผู้โดยสาร</p>
                  <p className="truncate font-body-sm text-body-sm text-on-surface">
                    {event.job?.rider?.name ?? "-"}
                  </p>
                  {event.job?.rider?.phone ? (
                    <a href={`tel:${event.job.rider.phone}`} className="font-label-sm text-label-sm font-bold text-primary">
                      {event.job.rider.phone}
                    </a>
                  ) : null}
                </div>
                <div className="rounded-xl bg-surface-container-low px-2.5 py-1.5">
                  <p className="font-label-sm text-label-sm text-tertiary">คนขับ</p>
                  <p className="truncate font-body-sm text-body-sm text-on-surface">
                    {event.job?.driver?.name ?? "ยังไม่มีคนขับ"}
                  </p>
                  {event.job?.driver?.phone ? (
                    <a href={`tel:${event.job.driver.phone}`} className="font-label-sm text-label-sm font-bold text-primary">
                      {event.job.driver.phone}
                    </a>
                  ) : null}
                </div>
              </div>

              {event.note ? (
                <p className="mt-2 rounded-xl bg-warning-container px-2.5 py-1.5 font-body-sm text-body-sm text-on-warning-container">
                  “{event.note}”
                </p>
              ) : null}

              <div className="mt-2 flex items-center gap-1.5">
                {event.lat !== null && event.lng !== null ? (
                  <a
                    href={`https://www.google.com/maps?q=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 items-center gap-1 rounded-xl bg-surface-container-low px-2.5 font-label-sm text-label-sm font-bold text-primary"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    เปิดพิกัด
                  </a>
                ) : null}
                {event.job ? (
                  <Link
                    href={`/ride/${event.job.id}`}
                    className="flex h-9 items-center gap-1 rounded-xl bg-surface-container-low px-2.5 font-label-sm text-label-sm font-bold text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    ดูงาน
                  </Link>
                ) : null}
                <span className="flex-1" />
                {isOpen ? (
                  <button
                    type="button"
                    onClick={() => void act(event, "ack")}
                    disabled={busy === event.id}
                    className="h-9 rounded-xl bg-warning-container px-3 font-label-sm text-label-sm font-bold text-on-warning-container disabled:opacity-60"
                  >
                    {busy === event.id ? "..." : "รับเรื่อง"}
                  </button>
                ) : null}
                {event.status !== "CLOSED" ? (
                  <button
                    type="button"
                    onClick={() => void act(event, "close")}
                    disabled={busy === event.id}
                    className="h-9 rounded-xl bg-success px-3 font-label-sm text-label-sm font-bold text-on-success disabled:opacity-60"
                  >
                    ปิดเหตุ
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default function AdminSosPage() {
  return (
    <AdminGate>
      <AdminSosPageInner />
    </AdminGate>
  );
}
