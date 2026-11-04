"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook, FaLine } from "react-icons/fa";
import { useAuthStore } from "@/app/stores/auth.stores";
import { nextTarget } from "@/components/auth/nextTarget";
import type { SocialLoginPayload, SocialProvider } from "@/app/Api/mainApi";

/**
 * ปุ่มล็อกอินผ่านผู้ให้บริการภายนอก 4 เจ้า
 * - แต่ละเจ้าจะเปิดใช้งานก็ต่อเมื่อตั้งค่า NEXT_PUBLIC_* ของเจ้านั้นแล้ว
 * - Google / Facebook ส่ง access token, Apple ส่ง id_token, LINE ใช้ redirect + code
 */

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "";
const APPLE_SERVICE_ID = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID ?? "";
const LINE_CHANNEL_ID = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID ?? "";

type SocialExtra = Omit<SocialLoginPayload, "provider">;

type FacebookSdk = {
  init: (options: Record<string, unknown>) => void;
  login: (
    callback: (response: { authResponse?: { accessToken?: string } }) => void,
    options: { scope: string },
  ) => void;
};

type AppleSdk = {
  auth: {
    init: (options: Record<string, unknown>) => void;
    signIn: () => Promise<{ authorization?: { id_token?: string } }>;
  };
};

declare global {
  interface Window {
    FB?: FacebookSdk;
    AppleID?: AppleSdk;
  }
}

/** โหลด SDK ภายนอกครั้งเดียว แล้วรอจนพร้อมใช้ */
function loadScript(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing !== null) {
      if (existing.dataset.loaded === "1") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("โหลด SDK ไม่สำเร็จ")));
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error("โหลด SDK ไม่สำเร็จ"));
    document.head.appendChild(script);
  });
}

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message !== "" ? error.message : fallback;
}

/**
 * URL ปลายทางที่ผู้ให้บริการจะ redirect กลับมา
 * ต้องมี locale นำหน้า เพราะ proxy ของแอปเติม /th ให้เองถ้าไม่มี — แต่การเติมนั้นทำให้ query string (?code=...) หายไป
 */
function callbackUrl(provider: SocialProvider): string {
  const segment = window.location.pathname.split("/")[1];
  const locale = segment === "en" || segment === "th" ? segment : "th";
  return `${window.location.origin}/${locale}/auth/callback/${provider.toLowerCase()}`;
}

export function SocialButtons({ onSuccess }: { onSuccess: () => void }) {
  const socialLogin = useAuthStore((state) => state.socialLogin);
  const busy = useAuthStore((state) => state.busy);
  const [active, setActive] = useState<SocialProvider | null>(null);
  const [message, setMessage] = useState("");

  const finish = async (provider: SocialProvider, extra: SocialExtra) => {
    const user = await socialLogin({ provider, ...extra });
    if (user) {
      onSuccess();
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (token) => {
      try {
        await finish("GOOGLE", { accessToken: token.access_token });
      } catch (error) {
        setMessage(errorText(error, "เข้าสู่ระบบด้วย Google ไม่สำเร็จ"));
      } finally {
        setActive(null);
      }
    },
    onError: () => {
      setActive(null);
      setMessage("Google ปฏิเสธการเข้าสู่ระบบ");
    },
  });

  const handleGoogle = () => {
    setMessage("");
    setActive("GOOGLE");
    googleLogin();
  };

  const handleFacebook = async () => {
    setMessage("");
    setActive("FACEBOOK");
    try {
      await loadScript("facebook-jssdk", "https://connect.facebook.net/th_TH/sdk.js");
      const fb = window.FB;
      if (fb === undefined) {
        throw new Error("โหลด Facebook SDK ไม่สำเร็จ");
      }
      fb.init({ appId: FACEBOOK_APP_ID, version: "v19.0", xfbml: false, cookie: false });
      const response = await new Promise<{ authResponse?: { accessToken?: string } }>(
        (resolve) => {
          fb.login((result) => resolve(result), { scope: "email,public_profile" });
        },
      );
      const accessToken = response.authResponse?.accessToken;
      if (accessToken === undefined || accessToken === "") {
        throw new Error("ไม่ได้รับสิทธิ์จาก Facebook");
      }
      await finish("FACEBOOK", { accessToken });
    } catch (error) {
      setMessage(errorText(error, "เข้าสู่ระบบด้วย Facebook ไม่สำเร็จ"));
    } finally {
      setActive(null);
    }
  };

  const handleApple = async () => {
    setMessage("");
    setActive("APPLE");
    try {
      await loadScript(
        "appleid-auth",
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
      );
      const apple = window.AppleID;
      if (apple === undefined) {
        throw new Error("โหลด Apple SDK ไม่สำเร็จ");
      }
      apple.auth.init({
        clientId: APPLE_SERVICE_ID,
        scope: "name email",
        redirectURI: callbackUrl("APPLE"),
        usePopup: true,
      });
      const result = await apple.auth.signIn();
      const idToken = result.authorization?.id_token;
      if (idToken === undefined || idToken === "") {
        throw new Error("ไม่ได้รับข้อมูลยืนยันจาก Apple");
      }
      await finish("APPLE", { idToken });
    } catch (error) {
      setMessage(errorText(error, "เข้าสู่ระบบด้วย Apple ไม่สำเร็จ"));
    } finally {
      setActive(null);
    }
  };

  const handleLine = () => {
    setMessage("");
    const state =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : String(Date.now());
    try {
      sessionStorage.setItem("social_state", state);
      sessionStorage.setItem("social_next", nextTarget());
    } catch {
      // ถ้าเก็บ state ไม่ได้ก็ยังทำต่อได้ แต่จะข้ามการตรวจ state
    }
    const params = new URLSearchParams({
      response_type: "code",
      client_id: LINE_CHANNEL_ID,
      redirect_uri: callbackUrl("LINE"),
      state,
      scope: "profile openid email",
    });
    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
  };

  const providers: {
    id: SocialProvider;
    label: string;
    icon: React.ReactNode;
    color: string;
    enabled: boolean;
    onClick: () => void;
  }[] = [
    {
      id: "GOOGLE",
      label: "ดำเนินการต่อด้วย Google",
      icon: <FcGoogle />,
      color: "",
      enabled: GOOGLE_CLIENT_ID !== "",
      onClick: handleGoogle,
    },
    {
      id: "FACEBOOK",
      label: "ดำเนินการต่อด้วย Facebook",
      icon: <FaFacebook />,
      color: "#1877F2",
      enabled: FACEBOOK_APP_ID !== "",
      onClick: () => void handleFacebook(),
    },
    {
      id: "APPLE",
      label: "ดำเนินการต่อด้วย Apple",
      icon: <FaApple />,
      color: "#111111",
      enabled: APPLE_SERVICE_ID !== "",
      onClick: () => void handleApple(),
    },
    {
      id: "LINE",
      label: "ดำเนินการต่อด้วย LINE",
      icon: <FaLine />,
      color: "#06C755",
      enabled: LINE_CHANNEL_ID !== "",
      onClick: handleLine,
    },
  ];

  const disabled = busy || active !== null;

  return (
    <div className="flex flex-col gap-2.5">
      {providers.map((provider) => {
        const isActive = active === provider.id;
        return (
          <button
            key={provider.id}
            type="button"
            onClick={provider.onClick}
            disabled={disabled || !provider.enabled}
            className="relative flex h-12 w-full items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest px-11 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className="absolute left-3.5 flex h-6 w-6 items-center justify-center text-[20px]"
              style={provider.color === "" ? undefined : { color: provider.color }}
            >
              {provider.icon}
            </span>
            <span className="truncate">{provider.label}</span>
            {isActive ? (
              <span className="material-symbols-outlined absolute right-3.5 animate-spin text-[18px]">
                progress_activity
              </span>
            ) : null}
            {!provider.enabled ? (
              <span className="absolute right-3 rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] font-bold text-on-surface-variant">
                เร็ว ๆ นี้
              </span>
            ) : null}
          </button>
        );
      })}

      {message !== "" ? (
        <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
          {message}
        </p>
      ) : null}
    </div>
  );
}
