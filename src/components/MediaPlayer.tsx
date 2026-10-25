"use client";

import { useEffect, useRef, useState } from "react";
import { MEDIA_POST, type FeedTab } from "@/data/media";

export function MediaPlayer() {
  const [tab, setTab] = useState<FeedTab>("foryou");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const toggleSave = () => {
    setSaved((prev) => {
      showToast(prev ? MEDIA_POST.toasts.unsaved : MEDIA_POST.toasts.saved);
      return !prev;
    });
  };

  const toggleFollow = () => {
    setFollowing((prev) => {
      if (!prev) {
        showToast(`Following ${MEDIA_POST.creator.handle}`);
      }
      return !prev;
    });
  };

  return (
    <div className="relative h-[730px] w-full overflow-hidden rounded-3xl bg-on-surface shadow-2xl">
      {/* Background scene */}
      <div
        role="img"
        aria-label={MEDIA_POST.backgroundAlt}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${MEDIA_POST.backgroundImage}')` }}
      />
      {/* Scrims */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      {/* Top discovery bar */}
      <div className="absolute inset-x-0 top-4 z-20 flex items-center justify-between px-space-md">
        <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <div className="flex h-3.5 items-end gap-0.5">
            <span className="h-2 w-0.5 animate-pulse rounded-full bg-on-primary" />
            <span
              className="h-3.5 w-0.5 animate-pulse rounded-full bg-on-primary"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-1.5 w-0.5 animate-pulse rounded-full bg-on-primary"
              style={{ animationDelay: "300ms" }}
            />
            <span
              className="h-3 w-0.5 animate-pulse rounded-full bg-secondary-container"
              style={{ animationDelay: "75ms" }}
            />
          </div>
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary">
            Live Sound
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTab("following")}
            className={`font-label-md text-label-md font-semibold transition-all ${
              tab === "following"
                ? "text-on-primary"
                : "text-on-primary/70 hover:text-on-primary"
            }`}
          >
            Following
          </button>
          <span className="h-1 w-1 rounded-full bg-on-primary/40" />
          <button
            type="button"
            onClick={() => setTab("foryou")}
            className={`relative pb-0.5 font-headline-sm text-headline-sm transition-all ${
              tab === "foryou" ? "font-bold text-on-primary" : "text-on-primary/70"
            }`}
          >
            For You
            {tab === "foryou" ? (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-secondary-container" />
            ) : null}
          </button>
        </div>

        <button
          type="button"
          aria-label="Search places"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-on-primary backdrop-blur-md transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-32 right-3.5 z-20 flex flex-col items-center gap-4">
        <div className="relative mb-1 flex flex-col items-center">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-tr from-secondary-container via-primary-container to-on-primary p-0.5 shadow-lg">
            <img
              alt={MEDIA_POST.creator.avatarAlt}
              src={MEDIA_POST.creator.avatar}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <button
            type="button"
            aria-label="Follow creator"
            onClick={toggleFollow}
            className={`absolute -bottom-2 flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-all active:scale-125 ${
              following
                ? "bg-primary-container text-on-primary-container"
                : "bg-secondary-container text-on-secondary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px] font-bold">
              {following ? "check" : "add"}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label="Like video"
            onClick={() => setLiked((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-on-primary shadow-sm backdrop-blur-md transition-all duration-200 active:scale-75"
          >
            <span
              className={`material-symbols-outlined text-[26px] transition-colors ${liked ? "text-secondary-container" : ""}`}
            >
              favorite
            </span>
          </button>
          <span className="font-label-sm text-label-sm font-bold text-on-primary drop-shadow-sm">
            {liked ? MEDIA_POST.stats.likesActive : MEDIA_POST.stats.likes}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label="Comments"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-on-primary shadow-sm backdrop-blur-md transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-[25px]">chat_bubble</span>
          </button>
          <span className="font-label-sm text-label-sm font-bold text-on-primary drop-shadow-sm">
            {MEDIA_POST.stats.comments}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label="Save to bucket list"
            onClick={toggleSave}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-on-primary shadow-sm backdrop-blur-md transition-all active:scale-90"
          >
            <span
              className={`material-symbols-outlined text-[25px] ${saved ? "text-secondary-container" : ""}`}
            >
              bookmark
            </span>
          </button>
          <span className="font-label-sm text-label-sm font-bold text-on-primary drop-shadow-sm">
            {saved ? MEDIA_POST.stats.savesActive : MEDIA_POST.stats.saves}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label="Share"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-on-primary shadow-sm backdrop-blur-md transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-[25px]">share</span>
          </button>
          <span className="font-label-sm text-label-sm font-bold text-on-primary drop-shadow-sm">
            {MEDIA_POST.stats.shares}
          </span>
        </div>

        <div className="relative mt-2">
          <div
            className="h-10 w-10 animate-spin rounded-full bg-gradient-to-tr from-on-surface to-inverse-surface p-1 shadow-lg"
            style={{ animationDuration: "4s" }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-black/90">
              <span className="material-symbols-outlined text-[16px] text-on-primary">
                graphic_eq
              </span>
            </div>
          </div>
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container shadow-xs">
            <span className="material-symbols-outlined text-[10px] text-on-secondary">
              music_note
            </span>
          </div>
        </div>
      </div>

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-3 z-20 flex flex-col gap-2.5 px-space-md">
        <div className="flex flex-col gap-1.5 pr-14">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-primary drop-shadow-md">
              {MEDIA_POST.creator.handle}
            </span>
            <span className="rounded-full bg-on-primary p-0.5 text-primary-container shadow-xs">
              <span className="material-symbols-outlined block text-[18px]">verified</span>
            </span>
            <span className="ml-1 font-label-sm text-label-sm text-on-primary/75">
              • {MEDIA_POST.creator.timeAgo}
            </span>
          </div>
          <p className="font-body-md text-body-md leading-tight text-on-primary drop-shadow-md">
            {MEDIA_POST.caption}{" "}
            {MEDIA_POST.hashtags.map((tag) => (
              <span key={tag} className="font-semibold text-secondary-fixed">
                {tag}{" "}
              </span>
            ))}
          </p>
          <div className="mt-0.5 inline-flex items-center gap-1.5 text-on-primary/90">
            <span className="material-symbols-outlined animate-bounce text-[15px]">
              music_note
            </span>
            <div className="w-56 overflow-hidden">
              <span className="whitespace-nowrap font-label-sm text-label-sm font-medium drop-shadow-sm">
                {MEDIA_POST.audioTrack}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-2.5 rounded-2xl bg-surface-container-lowest/95 p-2.5 shadow-xl backdrop-blur-xl transition-transform active:scale-[0.99]">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
            <img
              alt={MEDIA_POST.booking.thumbnailAlt}
              src={MEDIA_POST.booking.thumbnail}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-1 top-1 rounded-full bg-primary-container/90 px-1 py-0.5 font-label-sm text-[9px] font-bold text-on-primary-container">
              {MEDIA_POST.booking.tag}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-container">
                star
              </span>
              <span className="font-label-sm text-label-sm font-bold text-on-surface">
                {MEDIA_POST.booking.rating}
              </span>
              <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
                ({MEDIA_POST.booking.reviews})
              </span>
            </div>
            <h4 className="truncate font-headline-sm text-label-lg font-bold tracking-tight text-on-surface">
              {MEDIA_POST.booking.name}
            </h4>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-sm text-headline-sm font-extrabold text-secondary">
                {MEDIA_POST.booking.price}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">/ night</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast(MEDIA_POST.toasts.booking)}
            className="flex h-11 flex-shrink-0 items-center justify-center gap-1 rounded-xl bg-secondary-container px-3.5 font-headline-sm text-label-md font-bold text-on-secondary shadow-md transition-all hover:bg-secondary active:scale-95"
          >
            <span>Book</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      <div
        className={`absolute inset-x-4 top-16 z-30 flex items-center justify-between rounded-xl bg-inverse-surface/95 px-3 py-2 text-inverse-on-surface shadow-lg transition-all duration-300 ${
          toast !== null
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-secondary-container">
            verified
          </span>
          <span className="font-label-md text-label-md font-medium">{toast ?? ""}</span>
        </div>
        <span className="material-symbols-outlined text-[16px] text-inverse-on-surface/60">
          close
        </span>
      </div>
    </div>
  );
}
