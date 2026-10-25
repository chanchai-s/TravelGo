"use client";

export function WizardSteps({
  steps,
  current,
  onSelect,
}: {
  steps: string[];
  current: number;
  onSelect?: (step: number) => void;
}) {
  return (
    <ol className="flex flex-col">
      {steps.map((label, index) => {
        const stepNo = index + 1;
        const active = stepNo === current;
        const past = stepNo < current;
        return (
          <li key={label} className="relative flex gap-3 pb-6 last:pb-0">
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={`absolute left-[13px] top-8 h-[calc(100%-28px)] w-px ${
                  past ? "bg-primary" : "bg-surface-container-high"
                }`}
              />
            ) : null}
            <button
              type="button"
              disabled={onSelect === undefined || (!past && !active)}
              onClick={() => onSelect?.(stepNo)}
              aria-current={active ? "step" : undefined}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : past
                    ? "bg-primary-fixed text-on-primary-fixed-variant"
                    : "bg-surface-container-high text-tertiary"
              } ${onSelect !== undefined && (past || active) ? "cursor-pointer" : "cursor-default"}`}
            >
              {past ? (
                <span className="material-symbols-outlined text-[16px]">check</span>
              ) : (
                stepNo
              )}
            </button>
            <span
              className={`pt-0.5 font-label-md text-label-md ${
                active ? "font-bold text-primary" : "text-on-surface-variant"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
