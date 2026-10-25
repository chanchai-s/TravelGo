"use client";

import { useCallback, useEffect, useState } from "react";

export function GalleryLightbox({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowRight") {
        show(index + 1);
      }
      if (event.key === "ArrowLeft") {
        show(index - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, close]);

  if (images.length === 0) {
    return null;
  }

  const openAt = (next: number) => {
    setIndex(next);
    setOpen(true);
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {images.slice(0, 4).map((src, thumbIndex) => (
          <button
            key={`${src}-${thumbIndex}`}
            type="button"
            onClick={() => openAt(thumbIndex)}
            className={`relative overflow-hidden rounded-xl ${
              thumbIndex === 0 ? "col-span-2 row-span-2 h-full min-h-80" : "h-40"
            }`}
          >
            <img
              alt={`${name} photo ${thumbIndex + 1}`}
              src={src}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {thumbIndex === 3 && images.length > 4 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 font-label-md text-label-md font-bold text-white">
                See All {images.length} Photos
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              show(index - 1);
            }}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white md:left-8"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="max-h-full" onClick={(event) => event.stopPropagation()}>
            <img
              alt={`${name} photo ${index + 1}`}
              src={images[index]}
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
            <p className="mt-2 text-center font-label-md text-label-md text-white">
              {index + 1} / {images.length}
            </p>
          </div>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              show(index + 1);
            }}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white md:right-8"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
