import type { ReactNode } from "react";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface-container-lowest px-6 py-10 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low">
        <span className="material-symbols-outlined text-[28px] text-outline">{icon}</span>
      </span>
      <p className="mt-1 font-label-lg text-label-lg font-bold text-on-surface">{title}</p>
      {description ? <p className="max-w-[260px] font-body-sm text-body-sm text-tertiary">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
