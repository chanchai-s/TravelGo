import { RegistrationForm } from "@/components/RegistrationForm";
import { BRAND } from "@/data/userprofiles";

export default function UserProfilesPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-margin py-4 md:py-8">
      {/* Brand */}
      <div className="flex flex-col items-center pb-space-lg pt-space-md text-center">
        <div className="relative mb-space-sm flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined text-[28px] text-on-primary-container">
              explore
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-on-secondary">
              bolt
            </span>
          </div>
        </div>
        <div className="mb-space-xs inline-flex items-center gap-space-xs rounded-full bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
          {BRAND.passLabel}
        </div>
        <h2 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
          {BRAND.title}
        </h2>
        <p className="mt-1 max-w-[280px] font-body-md text-body-md text-on-surface-variant">
          {BRAND.subtitle}
        </p>
      </div>

      <RegistrationForm />
    </main>
  );
}
