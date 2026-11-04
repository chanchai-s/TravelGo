"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  apiCancelRideJob,
  apiPayRideJob,
  apiRateRideJob,
  apiSendRideMessage,
  apiSendRideSos,
} from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { useRideTracking } from "@/app/hooks/useRideTracking";
import { StatusStepper } from "@/components/ride/StatusStepper";
import { RideMap } from "@/components/ride/RideMap";
import { DriverCard } from "@/components/ride/DriverCard";
import { ChatSheet } from "@/components/ride/ChatSheet";
import { SosButton } from "@/components/ride/SosButton";
import { CancelModal } from "@/components/ride/CancelModal";
import { RatingSheet } from "@/components/ride/RatingSheet";
import { EmptyState } from "@/components/ride/EmptyState";
import { formatDateTime, formatMoney, SERVICE_LABEL, STATUS_LABEL } from "@/lib/rideFormat";

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

export default function RideTrackingPage() {
  const params = useParams<{ id: string }>();
  const jobId = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const ready = useAuthStore((state) => state.ready);

  const { job, driverPos, messages, connected, error, reload, reloadMessages } =
    useRideTracking(jobId);

  const [chatOpen, setChatOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  useEffect(() => {
    if (ready && token === null) {
      router.replace(`/login?next=/ride/${jobId}`);
    }
  }, [ready, token, router, jobId]);

  if (!ready || token === null) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
      </main>
    );
  }

  if (job === null) {
    return (
      <main className="mx-auto w-full max-w-md px-margin py-6">
        {error !== "" ? (
          <EmptyState
            icon="error"
            title="โหลดงานไม่สำเร็จ"
            description={error}
            action={
              <Link
                href="/ride"
                className="rounded-xl bg-primary px-4 py-2 font-label-md text-label-md text-on-primary"
              >
                กลับหน้าหลัก
              </Link>
            }
          />
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
              progress_activity
            </span>
          </div>
        )}
      </main>
    );
  }

  const actions = job.actions ?? [];
  const canCancel = actions.includes("CANCEL");
  const canPay = actions.includes("PAY");
  const canRate = actions.includes("RATE");
  const canChat = actions.includes("CHAT");
  const canSos = actions.includes("SOS");
  const isParcel = job.serviceType !== "RIDE";

  const cancel = async (reason: string) => {
    setBusy(true);
    setActionError("");
    try {
      await apiCancelRideJob(job.id, reason);
      setCancelOpen(false);
      await reload();
    } catch (err: unknown) {
      setActionError(messageOf(err, "ยกเลิกงานไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const pay = async () => {
    setBusy(true);
    setActionError("");
    try {
      await apiPayRideJob(job.id, { method: job.paymentMethod });
      await reload();
    } catch (err: unknown) {
      setActionError(messageOf(err, "ชำระเงินไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const rate = async (stars: number, text: string) => {
    setActionError("");
    try {
      await apiRateRideJob(job.id, stars, text);
      await reload();
    } catch (err: unknown) {
      setActionError(messageOf(err, "ส่งคะแนนไม่สำเร็จ"));
    }
  };

  const send = async (text: string) => {
    await apiSendRideMessage(job.id, text);
    await reloadMessages();
  };

  const sos = async (note: string) => {
    const point = driverPos ?? { lat: job.pickupLat, lng: job.pickupLng };
    await apiSendRideSos(job.id, { lat: point.lat, lng: point.lng, note });
  };

  const fare = job.fareFinal ?? job.fareEstimate;

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-28 pt-3 md:max-w-4xl md:pb-10">
      <div className="flex items-center justify-between">
        <Link
          href="/ride"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <div className="min-w-0 text-center">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            {SERVICE_LABEL[job.serviceType]}
          </p>
          <p className="font-label-lg text-label-lg font-bold text-on-surface">{job.ref}</p>
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-label-sm text-[10px] font-bold ${
            connected ? "bg-success-container text-on-success-container" : "bg-surface-container-high text-on-surface-variant"
          }`}
          title={connected ? "เชื่อมต่อเรียลไทม์" : "ใช้การอัปเดตเป็นรอบ"}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-success" : "bg-outline"}`} />
          {connected ? "LIVE" : "POLL"}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <StatusStepper status={job.status} />

        <RideMap
          pickup={{ lat: job.pickupLat, lng: job.pickupLng }}
          dropoff={{ lat: job.dropoffLat, lng: job.dropoffLng }}
          driver={driverPos ?? job.tracking ?? null}
          heightClass="h-52 md:h-64"
        />

        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-tertiary">จุดรับ</p>
              <p className="font-body-md text-body-md text-on-surface">{job.pickupAddress}</p>
            </div>
          </div>
          <div className="ml-[4px] my-1.5 h-3 border-l-2 border-dashed border-outline-variant" />
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm bg-secondary-container" />
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-tertiary">จุดส่ง</p>
              <p className="font-body-md text-body-md text-on-surface">{job.dropoffAddress}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-outline-variant/50 pt-3">
            <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
              {job.distanceKm} กม.
            </span>
            <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
              ~{job.durationMin} นาที
            </span>
            <span className="rounded-full bg-primary-fixed px-2.5 py-1 font-label-sm text-label-sm font-bold text-on-primary-fixed-variant">
              {formatMoney(fare)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 font-label-sm text-label-sm font-bold ${
                job.paymentStatus === "PAID" || job.paymentStatus === "REFUNDED"
                  ? "bg-success-container text-on-success-container"
                  : "bg-warning-container text-on-warning-container"
              }`}
            >
              {job.paymentStatus === "PAID"
                ? "ชำระแล้ว"
                : job.paymentStatus === "REFUNDED"
                  ? "คืนเงินแล้ว"
                  : job.paymentTiming === "PREPAY"
                    ? "รอชำระเงิน"
                    : "จ่ายกับคนขับ"}
            </span>
          </div>
        </div>

        <DriverCard job={job} onChat={canChat ? () => setChatOpen(true) : undefined} />

        {isParcel && job.parcel ? (
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">package_2</span>
              <p className="font-label-lg text-label-lg font-bold text-on-surface">
                ข้อมูลพัสดุ
              </p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-surface-container-low px-3 py-2">
                <p className="font-label-sm text-label-sm text-tertiary">ผู้รับ</p>
                <p className="font-body-sm text-body-sm text-on-surface">
                  {job.parcel.receiverName || "-"}
                </p>
                <p className="font-body-sm text-body-sm text-tertiary">
                  {job.parcel.receiverPhone || "-"}
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-low px-3 py-2">
                <p className="font-label-sm text-label-sm text-tertiary">น้ำหนัก / ขนาด</p>
                <p className="font-body-sm text-body-sm text-on-surface">
                  {job.parcel.weightKg} กก. • {job.parcel.sizeTier}
                </p>
                <p className="font-body-sm text-body-sm text-tertiary">
                  {job.parcel.isFragile ? "ของแตกหักง่าย" : "ของทั่วไป"}
                </p>
              </div>
            </div>

            {job.parcel.codAmount > 0 ? (
              <p className="mt-2 rounded-xl bg-warning-container px-3 py-2 font-body-sm text-body-sm text-on-warning-container">
                เก็บเงินปลายทาง {formatMoney(job.parcel.codAmount)}
              </p>
            ) : null}

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-dashed border-primary/40 px-3 py-2 text-center">
                <p className="font-label-sm text-label-sm text-tertiary">OTP รับของ</p>
                <p className="font-headline-sm text-headline-sm font-extrabold tracking-[0.2em] text-primary">
                  {job.parcel.pickupOtp ?? "-"}
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-secondary/40 px-3 py-2 text-center">
                <p className="font-label-sm text-label-sm text-tertiary">OTP ส่งของ</p>
                <p className="font-headline-sm text-headline-sm font-extrabold tracking-[0.2em] text-secondary">
                  {job.parcel.deliveryOtp ?? "-"}
                </p>
              </div>
            </div>
            <p className="mt-2 font-body-sm text-body-sm text-tertiary">
              ให้ OTP กับคนขับเมื่อรับ/ส่งของเท่านั้น — ใช้ยืนยันว่าของถึงมือจริง
            </p>
          </div>
        ) : null}

        {job.status === "COMPLETED" ? (
          <div className="rounded-2xl bg-success-container p-4 text-on-success-container">
            <p className="font-label-lg text-label-lg font-bold">งานเสร็จสิ้น</p>
            <p className="font-body-sm text-body-sm">
              {formatDateTime(job.completedAt)} • {formatMoney(fare)}
            </p>
            {job.rating ? (
              <p className="mt-1 flex items-center gap-1 font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">star</span>
                {job.rating.stars} ดาว
                {job.rating.text ? ` — ${job.rating.text}` : ""}
              </p>
            ) : null}
          </div>
        ) : null}

        {job.status === "CANCELLED" || job.status === "EXPIRED" ? (
          <div className="rounded-2xl bg-error-container p-4 text-on-error-container">
            <p className="font-label-lg text-label-lg font-bold">{STATUS_LABEL[job.status]}</p>
            {job.cancelReason ? (
              <p className="font-body-sm text-body-sm">{job.cancelReason}</p>
            ) : null}
          </div>
        ) : null}

        {job.status === "SEARCHING" ? (
          <div className="flex items-center gap-3 rounded-2xl bg-primary-fixed/40 p-4">
            <span className="material-symbols-outlined animate-pulse text-[24px] text-primary">
              person_search
            </span>
            <div>
              <p className="font-label-md text-label-md font-bold text-on-primary-fixed-variant">
                กำลังหาคนขับให้
              </p>
              <p className="font-body-sm text-body-sm text-on-primary-fixed-variant/80">
                โดยปกติใช้เวลา 1–3 นาที • ระบบจะแจ้งเตือนเมื่อมีคนรับงาน
              </p>
            </div>
          </div>
        ) : null}

        {actionError !== "" ? (
          <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
            {actionError}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          {canPay ? (
            <button
              type="button"
              onClick={() => void pay()}
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-label-lg text-label-lg font-bold text-on-primary disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
              {busy ? "กำลังตรวจสอบ..." : `ชำระเงิน ${formatMoney(fare)}`}
            </button>
          ) : null}

          {canRate ? (
            <button
              type="button"
              onClick={() => setRatingOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary-container font-label-lg text-label-lg font-bold text-on-secondary"
            >
              <span className="material-symbols-outlined text-[20px]">star</span>
              ให้คะแนนคนขับ
            </button>
          ) : null}

          {canChat ? (
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-surface-container-low font-label-lg text-label-lg font-bold text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              แชทกับคนขับ
            </button>
          ) : null}

          {canSos ? <SosButton onSend={sos} /> : null}

          {canCancel ? (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="h-11 w-full rounded-xl font-label-md text-label-md font-semibold text-error"
            >
              ยกเลิกงาน
            </button>
          ) : null}
        </div>

        <div className="rounded-2xl bg-surface-container-low p-3">
          <p className="font-label-sm text-label-sm font-bold uppercase tracking-wide text-tertiary">
            ประวัติสถานะ
          </p>
          <div className="mt-1 flex flex-col gap-1">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              ส่งคำขอ {formatDateTime(job.requestedAt)}
            </p>
            {job.acceptedAt ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                คนขับรับงาน {formatDateTime(job.acceptedAt)}
              </p>
            ) : null}
            {job.arrivedAt ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                ถึงจุดรับ {formatDateTime(job.arrivedAt)}
              </p>
            ) : null}
            {job.startedAt ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                เริ่มเดินทาง {formatDateTime(job.startedAt)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <ChatSheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        currentUserId={user?.id ?? ""}
        onSend={send}
      />

      <CancelModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={cancel}
        role="RIDER"
      />

      <RatingSheet
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
        onSubmit={rate}
      />
    </main>
  );
}
