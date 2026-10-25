"use client";

import { useState } from "react";

export function MapViewButton() {
  const [mapView, setMapView] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8">
      <button
        type="button"
        onClick={() => setMapView((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-inverse-surface px-4 py-3 font-label-md text-label-md text-inverse-on-surface shadow-xl transition-all hover:bg-on-surface active:scale-95"
      >
        <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
          {mapView ? "view_list" : "map"}
        </span>
        <span className="font-bold tracking-tight">{mapView ? "List View" : "Map View"}</span>
        <span className="h-2 w-2 rounded-full bg-secondary-container" />
      </button>
    </div>
  );
}
