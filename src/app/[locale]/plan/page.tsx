import { AI_TIP, PLAN_TITLE } from "@/data/plan";
import { PlanExplorer } from "@/components/PlanExplorer";

export default function PlanPage() {
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
            Plan
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

      {/* Title Row */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <h1 className="font-headline-md text-headline-md text-on-surface">
            {PLAN_TITLE.name}
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary-fixed-variant shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-primary">
              auto_awesome
            </span>
            {PLAN_TITLE.badge}
          </span>
        </div>
        <button
          type="button"
          aria-label="Planner settings"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-tertiary transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-6 pb-28">
        <PlanExplorer />

        {/* AI Tip */}
        <div className="flex items-start gap-3 rounded-2xl bg-primary-fixed/30 p-space-md">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-label-md text-label-md font-bold text-on-primary-fixed">
              {AI_TIP.title}
            </h4>
            <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
              {AI_TIP.body}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
