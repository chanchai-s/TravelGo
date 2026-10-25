import { BANK_PRIVILEGES } from "@/data/promotions";
import { PromotionsExplorer } from "@/components/PromotionsExplorer";

export default function PromotionsPage() {
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
            Promotions
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

      <div className="mt-4">
        <PromotionsExplorer />
      </div>

      {/* Partner Bank Privileges */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">credit_card</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Partner Bank Privileges
            </h2>
          </div>
          <span className="cursor-pointer font-label-sm text-label-sm font-bold text-primary">
            See All
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {BANK_PRIVILEGES.map((bank) => (
            <div
              key={bank.id}
              className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-[14px] font-bold text-on-surface">
                  <span className={`font-black ${bank.shortColor}`}>{bank.short}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                      {bank.name}
                    </h3>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${bank.badgeClass}`}
                    >
                      {bank.badge}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {bank.detail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={`View ${bank.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
