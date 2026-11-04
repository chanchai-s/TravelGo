"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.stores";

/** กันหน้าprivate: ถ้ายังไม่ล็อกอินให้ไป /login?next=... */
export function RequireAuth({ children }: { children: React.ReactNode }) {
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
    if (ready && user === null) {
      const next = encodeURIComponent(pathname || "/ride");
      router.replace(`/login?next=${next}`);
    }
  }, [ready, user, router, pathname]);

  if (!ready || user === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireAuth;
