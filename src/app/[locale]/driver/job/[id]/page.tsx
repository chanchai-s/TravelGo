"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  apiCancelRideJob,
  apiDriverCollectPayment,
  apiDriverCompleteJob,
  apiDriverConfirmDelivery,
  apiDriverArriveJob,
  apiDriverStartJob,
  apiSendRideMessage,
  apiUploadImage,
} from "@/app/Api/mainApi";
import { getRideSocket } from "@/app/Api/rideSocket";
import { useAuthStore } from "@/app/stores/auth.stores";
import { useRideTracking } from "@/app/hooks/useRideTracking";
import { DriverGate } from "@/components/ride/DriverGate";
import { StatusStepper } from "@/components/ride/StatusStepper";
import { RideMap } from "@/components/ride/RideMap";
import { ChatSheet } from "@/components/ride/ChatSheet";
import { CancelModal } from "@/components/ride/CancelModal";
import { EmptyState } from "@/components/ride/EmptyState";
import { formatMoney, SERVICE_LABEL, STATUS_LABEL } from "@/lib/rideFormat";

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

function DriverJobPageInner() {
  const params = useParams<{ id: string }>();
  const jobId = typeof params?.id === "string" ? params.id : "";
  const user = useAuthStore((state) => state.user);

  const { job, driverPos, messages, connected, error, reload, reloadMessages } =
    useRideTracking(jobId);

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [codCollected, setCodCollected] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // คนขับส่งพิกัดเข้า socket เองเมื่อมีงาน active
  useEffect(() => {
    if (!job || !user) {
      return;
    }
    if (
      !["ACCEPTED", "ARRIVING", "ARRIVED", "IN_PROGRESS"].includes(job.status)
    ) {
      return;
    }
    if (
      typeof navigator === "undefined" ||
      navigator.geolocation === undefined
    ) {
      return;
    }
    const push = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const socket = getRideSocket();
          socket?.emit("driver:location", {
            jobId: job.id,
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
          });
        },
        () => undefined,
        { enableHighAccuracy: true, timeout: 8000 },
      );
    };
    push();
    const timer = setInterval(push, 15000);
    return () => clearInterval(timer);
  }, [job, user]);

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
                href="/driver/dashboard"
                className="rounded-xl bg-primary px-4 py-2 font-label-md text-label-md text-on-primary"
              >
                กลับแดชบอร์ด
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
  const canArrive = actions.includes("ARRIVE");
  const canStart = actions.includes("START");
  const canComplete = actions.includes("COMPLETE");
  const canConfirm = actions.includes("CONFIRM_DELIVERY");
  const canCollect = actions.includes("COLLECT_PAYMENT");
  const canChat = actions.includes("CHAT");
  const canCancel = actions.includes("CANCEL");
  const isParcel = job.serviceType !== "RIDE";
  const fare = job.fareFinal ?? job.fareEstimate;

  const run = async (task: () => Promise<unknown>, fallback: string) => {
    setBusy(true);
    setActionError("");
    try {
      await task();
      await reload();
    } catch (err: unknown) {
      setActionError(messageOf(err, fallback));
    } finally {
      setBusy(false);
    }
  };

  const uploadProof = async (file: File) => {
    setUploading(true);
    setActionError("");
    try {
      const res = await apiUploadImage(file);
      const data = (res.data ?? {}) as {
        data?: { fileUrl?: string };
        fileUrl?: string;
      };
      setProofUrl(data.data?.fileUrl ?? data.fileUrl ?? "");
    } catch (err: unknown) {
      setActionError(messageOf(err, "อัปโหลดรูปไม่สำเร็จ"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-28 pt-3 md:max-w-4xl md:pb-10">
      <div className="flex items-center justify-between">
        <Link
          href="/driver/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">
            arrow_back
          </span>
        </Link>
        <div className="text-center">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            {SERVICE_LABEL[job.serviceType]}
          </p>
          <p className="font-label-lg text-label-lg font-bold text-on-surface">
            {job.ref}
          </p>
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-label-sm text-[10px] font-bold ${
            connected
              ? "bg-success-container text-on-success-container"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-success" : "bg-outline"}`}
          />
          {connected ? "LIVE" : "POLL"}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <StatusStepper status={job.status} />

        <RideMap
          pickup={{ lat: job.pickupLat, lng: job.pickupLng }}
          dropoff={{ lat: job.dropoffLat, lng: job.dropoffLng }}
          driver={driverPos ?? job.tracking ?? null}
          heightClass="h-48 md:h-60"
        />

        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-tertiary">
                รับที่
              </p>
              <p className="font-body-md text-body-md text-on-surface">
                {job.pickupAddress}
              </p>
            </div>
          </div>
          <div className="ml-[4px] my-1.5 h-3 border-l-2 border-dashed border-outline-variant" />
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm bg-secondary-container" />
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-tertiary">
                ส่งที่
              </p>
              <p className="font-body-md text-body-md text-on-surface">
                {job.dropoffAddress}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-outline-variant/50 pt-3">
            <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
              {job.distanceKm} กม.
            </span>
            <span className="rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
              ~{job.durationMin} นาที
            </span>
            <span className="rounded-full bg-primary-fixed px-2.5 py-1 font-label-sm text-label-sm font-bold text-on-primary-fixed-variant">
              {formatMoney(fare)}
            </span>
            <span className="rounded-full bg-success-container px-2.5 py-1 font-label-sm text-label-sm font-bold text-on-success-container">
              รับสุทธิ {formatMoney(job.netToDriver)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 font-label-sm text-label-sm font-bold ${
                job.paymentTiming === "PREPAY"
                  ? "bg-success-container text-on-success-container"
                  : "bg-warning-container text-on-warning-container"
              }`}
            >
              {job.paymentTiming === "PREPAY"
                ? "จ่ายล่วงหน้าแล้ว"
                : "เก็บเงินกับผู้โดยสาร"}
            </span>
          </div>
        </div>

        {job.rider ? (
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-label-lg text-label-lg font-bold text-on-primary">
              {job.rider.name?.charAt(0) ?? "R"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                {job.rider.name}
              </p>
              <p className="font-body-sm text-body-sm text-tertiary">
                {job.rider.phone ?? "เบอร์จะแสดงหลังรับงาน"}
              </p>
            </div>
            {job.rider.phone ? (
              <a
                href={`tel:${job.rider.phone}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary"
                aria-label="โทรหาผู้โดยสาร"
              >
                <span className="material-symbols-outlined text-[20px]">
                  call
                </span>
              </a>
            ) : null}
            {canChat ? (
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
                aria-label="แชท"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chat_bubble
                </span>
              </button>
            ) : null}
          </div>
        ) : null}

        {isParcel && job.parcel ? (
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="font-label-md text-label-md font-bold text-on-surface">
              รายละเอียดพัสดุ
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {job.parcel.weightKg} กก. • {job.parcel.sizeTier}
              {job.parcel.isFragile ? " • แตกหักง่าย" : ""}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              ผู้รับ: {job.parcel.receiverName} ({job.parcel.receiverPhone})
            </p>
            {job.parcel.note ? (
              <p className="font-body-sm text-body-sm text-tertiary">
                หมายเหตุ: {job.parcel.note}
              </p>
            ) : null}
            {job.parcel.codAmount > 0 ? (
              <p className="mt-2 rounded-xl bg-warning-container px-3 py-2 font-body-sm text-body-sm text-on-warning-container">
                เก็บเงินปลายทาง {formatMoney(job.parcel.codAmount)}
              </p>
            ) : null}
          </div>
        ) : null}

        {canConfirm || canCollect ? (
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            {canConfirm ? (
              <>
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  ยืนยันการส่ง
                </p>
                <label className="mt-2 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    OTP จากผู้รับ (6 หลัก)
                  </span>
                  <input
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    inputMode="numeric"
                    placeholder="______"
                    className="h-12 w-full rounded-xl bg-surface-container-low text-center font-headline-sm text-headline-sm font-extrabold tracking-[0.4em] text-on-surface placeholder:text-outline-variant focus:outline-none"
                  />
                </label>

                {job.parcel && job.parcel.codAmount > 0 ? (
                  <button
                    type="button"
                    onClick={() => setCodCollected((value) => !value)}
                    className={`mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left ${
                      codCollected
                        ? "bg-success-container text-on-success-container"
                        : "bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {codCollected ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <span className="font-body-sm text-body-sm">
                      เก็บเงินปลายทาง {formatMoney(job.parcel.codAmount)}{" "}
                      ครบแล้ว
                    </span>
                  </button>
                ) : null}

                <label className="mt-2 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    photo_camera
                  </span>
                  {uploading
                    ? "กำลังอัปโหลด..."
                    : proofUrl === ""
                      ? "แนบรูปหลักฐาน"
                      : "แนบรูปแล้ว"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadProof(file);
                      }
                    }}
                  />
                </label>
              </>
            ) : null}

            {canCollect ? (
              <div
                className={
                  canConfirm
                    ? "mt-3 border-t border-outline-variant/50 pt-3"
                    : ""
                }
              >
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  เก็บเงินจากผู้โดยสาร
                </p>
                <p className="font-body-sm text-body-sm text-tertiary">
                  ยอด {formatMoney(fare)} — กดยืนยันเมื่อได้รับเงินแล้ว
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {actionError !== "" ? (
          <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
            {actionError}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          {canArrive ? (
            <button
              type="button"
              onClick={() =>
                void run(() => apiDriverArriveJob(job.id), "อัปเดตไม่สำเร็จ")
              }
              disabled={busy}
              className="h-12 w-full rounded-xl bg-primary font-label-lg text-label-lg font-bold text-on-primary disabled:opacity-60"
            >
              {busy ? "กำลังบันทึก..." : "ถึงจุดรับแล้ว"}
            </button>
          ) : null}

          {canStart ? (
            <button
              type="button"
              onClick={() =>
                void run(() => apiDriverStartJob(job.id), "เริ่มงานไม่สำเร็จ")
              }
              disabled={busy}
              className="h-12 w-full rounded-xl bg-primary font-label-lg text-label-lg font-bold text-on-primary disabled:opacity-60"
            >
              {busy ? "กำลังเริ่ม..." : "เริ่มเดินทาง"}
            </button>
          ) : null}

          {canComplete ? (
            <button
              type="button"
              onClick={() =>
                void run(
                  () =>
                    apiDriverCompleteJob(job.id, {
                      distanceKm: job.distanceKm,
                    }),
                  "จบงานไม่สำเร็จ",
                )
              }
              disabled={busy}
              className="h-12 w-full rounded-xl bg-success font-label-lg text-label-lg font-bold text-on-success disabled:opacity-60"
            >
              {busy ? "กำลังจบงาน..." : "จบงาน / ส่งถึงแล้ว"}
            </button>
          ) : null}

          {canConfirm ? (
            <button
              type="button"
              onClick={() =>
                void run(
                  () =>
                    apiDriverConfirmDelivery(job.id, {
                      deliveryOtp: otp,
                      codCollected:
                        codCollected || (job.parcel?.codAmount ?? 0) === 0,
                      proofPhotoUrl: proofUrl || undefined,
                    }),
                  "ยืนยันการส่งไม่สำเร็จ",
                )
              }
              disabled={busy || otp.length !== 6}
              className="h-12 w-full rounded-xl bg-success font-label-lg text-label-lg font-bold text-on-success disabled:opacity-60"
            >
              {busy ? "กำลังยืนยัน..." : "ยืนยันการส่ง"}
            </button>
          ) : null}

          {canCollect ? (
            <button
              type="button"
              onClick={() =>
                void run(
                  () =>
                    apiDriverCollectPayment(job.id, {
                      method: job.paymentMethod,
                    }),
                  "บันทึกการรับเงินไม่สำเร็จ",
                )
              }
              disabled={busy}
              className="h-12 w-full rounded-xl bg-secondary-container font-label-lg text-label-lg font-bold text-on-secondary disabled:opacity-60"
            >
              {busy ? "กำลังบันทึก..." : `ยืนยันรับเงิน ${formatMoney(fare)}`}
            </button>
          ) : null}

          {canCancel ? (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="h-11 w-full rounded-xl font-label-md text-label-md font-semibold text-error"
            >
              ยกเลิกงาน (ต้องระบุเหตุผล)
            </button>
          ) : null}

          {job.status === "COMPLETED" ? (
            <Link
              href="/driver/earnings"
              className="flex h-11 w-full items-center justify-center gap-1 rounded-xl bg-surface-container-low font-label-md text-label-md font-semibold text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">
                payments
              </span>
              ดูรายได้
            </Link>
          ) : null}
        </div>

        {job.status === "CANCELLED" || job.status === "EXPIRED" ? (
          <div className="rounded-2xl bg-error-container p-4 text-on-error-container">
            <p className="font-label-lg text-label-lg font-bold">
              {STATUS_LABEL[job.status]}
            </p>
            {job.cancelReason ? (
              <p className="font-body-sm text-body-sm">{job.cancelReason}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <ChatSheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        currentUserId={user?.id ?? ""}
        onSend={async (text) => {
          await apiSendRideMessage(job.id, text);
          await reloadMessages();
        }}
      />

      <CancelModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        role="DRIVER"
        onConfirm={async (reason) => {
          await run(
            () => apiCancelRideJob(job.id, reason),
            "ยกเลิกงานไม่สำเร็จ",
          );
          setCancelOpen(false);
        }}
      />
    </main>
  );
}

export default function DriverJobPage() {
  return (
    <DriverGate>
      <DriverJobPageInner />
    </DriverGate>
  );
}
