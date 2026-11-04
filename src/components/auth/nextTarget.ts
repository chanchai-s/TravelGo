/** เส้นทางปลายทางหลังล็อกอิน — รับจาก ?next= แต่ต้องเป็น path ภายในเท่านั้น */
export function isSafePath(value: string | null): value is string {
  return value !== null && value.startsWith("/") && !value.startsWith("//");
}

export function nextTarget(fallback = "/homepage"): string {
  if (typeof window === "undefined") {
    return fallback;
  }
  const next = new URLSearchParams(window.location.search).get("next");
  return isSafePath(next) ? next : fallback;
}
