"use client";

import { create } from "zustand";
import {
  apiSocialLogin,
  mainApi,
  type SocialLoginPayload,
} from "@/app/Api/mainApi";

/** สถานะล็อกอินของผู้ใช้ (ใช้ร่วมทั้ง rider และ driver — บัญชีเดียว) */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: "USER" | "ADMIN" | "OWNER" | null;
  hasPassword?: boolean;
  /** รูปโปรไฟล์ — มาจากผู้ให้บริการก่อน (Google) */
  avatarUrl?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  busy: boolean;
  error: string;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  socialLogin: (payload: SocialLoginPayload) => Promise<AuthUser | null>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthUser | null>;
  refresh: () => Promise<void>;
  logout: () => void;
  setPassword: (password: string, currentPassword?: string) => Promise<void>;
};

function readToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("travel_token");
}

function saveToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (token === null) {
    window.localStorage.removeItem("travel_token");
  } else {
    window.localStorage.setItem("travel_token", token);
  }
}

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  ready: false,
  busy: false,
  error: "",

  init: async () => {
    const token = readToken();
    if (token === null) {
      set({ ready: true, user: null, token: null });
      return;
    }

    set({ token });
    try {
      const res = await mainApi.get("/auth/me");
      const user = (res.data?.user ?? res.data?.data?.user) as AuthUser | undefined;
      set({ user: user ?? null, ready: true });
    } catch {
      saveToken(null);
      set({ user: null, token: null, ready: true });
    }
  },

  login: async (email, password) => {
    set({ busy: true, error: "" });
    try {
      const res = await mainApi.post("/auth/login", { email, password });
      const token = res.data?.token as string | undefined;
      const user = res.data?.user as AuthUser | undefined;
      if (!token || !user) {
        throw new Error("ไม่ได้รับ token จากเซิร์ฟเวอร์");
      }
      saveToken(token);
      set({ token, user, busy: false, ready: true });
      return user;
    } catch (error) {
      set({ busy: false, error: messageOf(error, "เข้าสู่ระบบไม่สำเร็จ") });
      return null;
    }
  },

  // ล็อกอินผ่านผู้ให้บริการภายนอก — รับได้ทั้ง accessToken / idToken / code
  socialLogin: async (payload) => {
    set({ busy: true, error: "" });
    try {
      const res = await apiSocialLogin(payload);
      const token = (res.data?.token ?? res.data?.accessToken) as string | undefined;
      const user = res.data?.user as AuthUser | undefined;
      if (!token || !user) {
        throw new Error("ไม่ได้รับ token จากเซิร์ฟเวอร์");
      }
      saveToken(token);
      set({ token, user, busy: false, ready: true });
      return user;
    } catch (error) {
      set({ busy: false, error: messageOf(error, "เข้าสู่ระบบไม่สำเร็จ") });
      return null;
    }
  },

  register: async (data) => {
    set({ busy: true, error: "" });
    try {
      const res = await mainApi.post("/auth/register", data);
      const token = res.data?.token as string | undefined;
      const user = res.data?.user as AuthUser | undefined;
      if (!token || !user) {
        throw new Error("สมัครไม่สำเร็จ");
      }
      saveToken(token);
      set({ token, user, busy: false, ready: true });
      return user;
    } catch (error) {
      set({ busy: false, error: messageOf(error, "สมัครสมาชิกไม่สำเร็จ") });
      return null;
    }
  },

  refresh: async () => {
    if (get().token === null) {
      return;
    }
    try {
      const res = await mainApi.get("/auth/me");
      const user = (res.data?.user ?? res.data?.data?.user) as AuthUser | undefined;
      if (user) {
        set({ user });
      }
    } catch {
      // ปล่อยให้หน้าถัดไปจัดการ 401 เอง
    }
  },

  logout: () => {
    saveToken(null);
    set({ user: null, token: null, error: "" });
  },

  setPassword: async (password, currentPassword) => {
    set({ busy: true, error: "" });
    try {
      await mainApi.post("/auth/set-password", { password, currentPassword });
      await get().refresh();
      set({ busy: false });
    } catch (error) {
      set({ busy: false, error: messageOf(error, "ตั้งรหัสผ่านไม่สำเร็จ") });
      throw error;
    }
  },
}));

export default useAuthStore;
