import { TRUST_CARD } from "@/data/transport";
import { TransportExplorer } from "@/components/TransportExplorer";

export default function TransportPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-margin py-4 md:py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
            <span className="material-symbols-outlined text-[20px] text-on-primary-container">
              explore
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
            Transport
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </div>
        </div>
      </div>

      <TransportExplorer />

      {/* Trust Card */}
      <div className="mt-4 flex w-full items-center gap-space-md rounded-xl bg-surface-container-low p-space-md shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
          <span className="material-symbols-outlined text-[26px]">verified_user</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {TRUST_CARD.title}
          </span>
          <span className="font-body-sm text-body-sm text-tertiary">{TRUST_CARD.subtitle}</span>
        </div>
      </div>
    </main>
  );
}
