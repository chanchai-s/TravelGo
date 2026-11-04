"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/stores/auth.stores";

/** เรียก init() ครั้งเดียวต่อการ mount และคืนสถานะล็อกอิน */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const ready = useAuthStore((state) => state.ready);

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  return {
    user,
    token,
    ready,
    isLoggedIn: user !== null,
    logout: useAuthStore.getState().logout,
  };
}

export default useAuth;
