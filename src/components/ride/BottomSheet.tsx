"use client";

import type { ReactNode } from "react";

/** bottom sheet มาตรฐานของ ride — mobile ขึ้นจากล่าง, desktop กลายเป็น modal กลางจอ */
export function BottomSheet({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="ปิด"
        onClick={onClose}
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px]"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-surface-container-lowest shadow-2xl md:rounded-3xl">
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 font-body-sm text-body-sm text-tertiary">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer ? <div className="border-t border-outline-variant/40 px-5 py-3 pb-safe">{footer}</div> : null}
      </div>
    </div>
  );
}

export default BottomSheet;
