"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.stores";

/** ต้องเป็น ADMIN เท่านั้น (ใช้กับ ops console ของ ride) */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (user === null) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/admin/rides")}`);
      return;
    }
    if (user.role !== "ADMIN") {
      router.replace("/ride");
    }
  }, [ready, user, router, pathname]);

  if (!ready || user === null || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminGate;
