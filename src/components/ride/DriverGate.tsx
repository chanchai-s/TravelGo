"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiDriverMe } from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { RequireAuth } from "@/components/RequireAuth";

type DriverProfile = {
  id: string;
  status: string;
  isOnline: boolean;
  totalTrips: number;
  rating: number;
  rejectedReason?: string | null;
};

/** ต้องเป็นคนขับที่สมัครแล้ว (และผ่านการยืนยันถ้า requireVerified) */
export function DriverGate({
  children,
  requireVerified = true,
}: {
  children: React.ReactNode;
  requireVerified?: boolean;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "redirect">("loading");
  const token = useAuthStore((store) => store.token);

  useEffect(() => {
    if (token === null) {
      return;
    }
    apiDriverMe()
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const nextProfile = data?.profile as DriverProfile | undefined;
        if (!nextProfile) {
          setState("redirect");
          router.replace("/driver/register");
          return;
        }
        setProfile(nextProfile);
        if (requireVerified && nextProfile.status !== "VERIFIED") {
          setState("redirect");
          router.replace("/driver/status");
          return;
        }
        setState("ok");
      })
      .catch(() => {
        setState("redirect");
        router.replace("/driver/register");
      });
  }, [token, requireVerified, router]);

  return (
    <RequireAuth>
      {state === "ok" ? (
        children
      ) : (
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
        </div>
      )}
      {/* เก็บ profile ไว้ให้ debug ระหว่างพัฒนา */}
      <span className="hidden">{profile?.id ?? ""}</span>
    </RequireAuth>
  );
}

export default DriverGate;
