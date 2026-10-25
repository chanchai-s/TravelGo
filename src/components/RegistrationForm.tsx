"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import googleLoginStore from "@/app/stores/google.stores";
import { FORM_TEXT, ROLES, ROLE_PERKS, type RoleId } from "@/data/userprofiles";

type SubmitState = "idle" | "verifying" | "welcome";

const inputClass =
  "w-full h-12 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0066ff] transition-all";

export function RegistrationForm() {
  const router = useRouter();
  const googlelogin = googleLoginStore((state) => state.googlelogin);
  const [role, setRole] = useState<RoleId>("traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submit, setSubmit] = useState<SubmitState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const perks = ROLE_PERKS[role];
  const needsVerification = role !== "traveler";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submit !== "idle") {
      return;
    }
    setSubmit("verifying");
    timers.current.push(
      setTimeout(() => {
        setSubmit("welcome");
        timers.current.push(setTimeout(() => setSubmit("idle"), 2000));
      }, 1200),
    );
  };

  return (
    <>
      {/* Role Selector */}
      <div className="mb-space-lg">
        <label className="mb-space-xs block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          Select Account Type
        </label>
        <div className="grid grid-cols-3 gap-space-xs rounded-xl bg-surface-container p-1.5">
          {ROLES.map((item) => {
            const active = item.id === role;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={`flex flex-col items-center justify-center rounded-lg px-1 py-2.5 font-label-md text-label-md transition-all duration-200 ${
                  active
                    ? "bg-surface-container-lowest text-primary-container shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined mb-1 text-[22px]">
                  {item.icon}
                </span>
                <span className="w-full truncate text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-space-sm flex items-center justify-between rounded-lg bg-surface-container-low p-3">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-fixed">
              <span className="material-symbols-outlined text-[16px] text-primary">
                verified
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                {perks.badgeTitle}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {perks.badgeDesc}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-outline-variant">
            info
          </span>
        </div>
      </div>

      {/* Form (mock only — no auth wired) */}
      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fullname"
            className="flex items-center justify-between font-label-md text-label-md font-semibold text-on-surface"
          >
            {FORM_TEXT.nameLabel}
            <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
              {FORM_TEXT.nameHint}
            </span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-on-surface-variant">
              person
            </span>
            <input
              id="fullname"
              type="text"
              required
              placeholder={FORM_TEXT.namePlaceholder}
              className={`${inputClass} pl-10 pr-3`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-label-md text-label-md font-semibold text-on-surface"
          >
            {FORM_TEXT.emailLabel}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-on-surface-variant">
              mail
            </span>
            <input
              id="email"
              type="email"
              required
              placeholder={FORM_TEXT.emailPlaceholder}
              className={`${inputClass} pl-10 pr-3`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phone"
            className="font-label-md text-label-md font-semibold text-on-surface"
          >
            {FORM_TEXT.phoneLabel}
          </label>
          <div className="flex items-center gap-space-xs">
            <div className="flex h-12 flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-surface-container-low px-3">
              <span className="select-none text-base">🇹🇭</span>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                +66
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                expand_more
              </span>
            </div>
            <div className="relative flex flex-1 items-center">
              <input
                id="phone"
                type="tel"
                required
                placeholder={FORM_TEXT.phonePlaceholder}
                className={`${inputClass} px-3`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-label-md text-label-md font-semibold text-on-surface"
            >
              {FORM_TEXT.passwordLabel}
            </label>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {FORM_TEXT.passwordHint}
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-on-surface-variant">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              className={`${inputClass} pl-10 pr-11`}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 flex h-7 w-7 items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {needsVerification ? (
          <div className="flex-col gap-space-xs rounded-xl bg-surface-container-low p-3.5 flex">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-secondary-container">
                  badge
                </span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {perks.docTitle}
                </span>
              </div>
              <span className="rounded-full bg-secondary-fixed px-2 py-0.5 font-label-sm text-label-sm text-secondary">
                {FORM_TEXT.docRequired}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {perks.docDesc}
            </p>
            <label
              htmlFor="doc-upload-input"
              className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg bg-surface-container-lowest p-4 text-center transition-all hover:bg-surface-container"
            >
              <input
                id="doc-upload-input"
                type="file"
                className="hidden"
                onChange={(event) =>
                  setFileName(event.target.files?.[0]?.name ?? null)
                }
              />
              <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  cloud_upload
                </span>
              </div>
              <span
                className={`font-label-md text-label-md font-semibold ${
                  fileName !== null ? "text-secondary" : "text-primary"
                }`}
              >
                {fileName !== null ? `✓ ${fileName}` : FORM_TEXT.docEmpty}
              </span>
              <span className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                {FORM_TEXT.docFormats}
              </span>
            </label>
          </div>
        ) : null}

        <div className="flex items-start gap-space-sm pt-1">
          <div className="relative mt-0.5 flex items-center justify-center">
            <input
              id="terms-checkbox"
              type="checkbox"
              required
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md bg-surface-container-high transition-all checked:bg-primary-container"
            />
            <span className="material-symbols-outlined pointer-events-none absolute text-[16px] text-on-primary-container opacity-0 peer-checked:opacity-100">
              check
            </span>
          </div>
          <label
            htmlFor="terms-checkbox"
            className="cursor-pointer select-none font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
          >
            I agree to the{" "}
            <span className="font-label-sm text-label-sm font-semibold text-primary">
              WanderGo Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-label-sm text-label-sm font-semibold text-primary">
              Privacy Policy
            </span>
            .
          </label>
        </div>

        <button
          type="submit"
          className="mt-1 flex h-[52px] w-full items-center justify-center gap-space-xs rounded-xl bg-secondary-container font-headline-sm text-headline-sm text-on-secondary shadow-md shadow-secondary-container/25 transition-transform active:scale-[0.99]"
        >
          {submit === "idle" ? (
            <>
              <span>{FORM_TEXT.submitLabel}</span>
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </>
          ) : submit === "verifying" ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              <span>{FORM_TEXT.verifyingLabel}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">
                check_circle
              </span>
              <span>{FORM_TEXT.welcomeLabel}</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-space-lg flex items-center justify-center">
        <div className="h-px w-full bg-surface-container-high" />
        <span className="absolute bg-surface px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          {FORM_TEXT.divider}
        </span>
      </div>

      {/* Social */}
      <div className="mb-space-lg grid grid-cols-2 gap-space-sm">
        <div className="flex h-12 items-center justify-center rounded-xl bg-surface-container-lowest px-3 text-on-surface shadow-sm transition-colors hover:bg-surface-container-low">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const credential = credentialResponse.credential;
              if (!credential) {
                return;
              }
              googlelogin({ token: credential })
                .then((user) => {
                  if (user) {
                    const next = new URLSearchParams(window.location.search).get("next");
                    const target =
                      next && next.startsWith("/") && !next.startsWith("//")
                        ? next
                        : "/homepage";
                    router.push(target);
                  }
                })
                .catch(() => undefined);
            }}
            onError={() => {
              console.log("Google login failed");
            }}
            type="standard"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest px-3 text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
        >
          <svg
            className="h-4 w-4 flex-shrink-0 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.62-.75 1.04-1.8 0.92-2.87-.9.04-2 0.6-2.64 1.36-.57.65-1.06 1.73-.93 2.76 1 .08 2.03-.5 2.65-1.25z" />
          </svg>
          <span className="font-label-md text-label-md font-bold">Apple</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 font-body-md text-body-md text-on-surface-variant">
        <span>{FORM_TEXT.signinPrompt}</span>
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest px-3 text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
        >
          {FORM_TEXT.signinCta}
        </button>
      </div>
    </>
  );
}
