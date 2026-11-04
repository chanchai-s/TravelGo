"use client";

import type { RidePoint } from "@/app/Api/mainApi";

/** แผนที่จำลอง (SVG) — ไม่พึ่งบริการภายนอก ทำงานได้ทุก environment
 *  จุดรับ/จุดส่ง/คนขับถูกวางตามพิกัดจริงแบบ normalize
 */
export function RideMap({
  pickup,
  dropoff,
  driver,
  heightClass = "h-56",
}: {
  pickup: Pick<RidePoint, "lat" | "lng"> | null;
  dropoff: Pick<RidePoint, "lat" | "lng"> | null;
  driver?: { lat: number; lng: number } | null;
  heightClass?: string;
}) {
  const points = [pickup, dropoff, driver].filter(
    (point): point is { lat: number; lng: number } => point !== null && point !== undefined,
  );

  const width = 400;
  const height = 260;
  const pad = 46;

  let project = (point: { lat: number; lng: number }) => ({ x: width / 2, y: height / 2 });

  if (points.length > 0) {
    const lats = points.map((point) => point.lat);
    const lngs = points.map((point) => point.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latSpan = Math.max(0.004, maxLat - minLat);
    const lngSpan = Math.max(0.004, maxLng - minLng);

    project = (point) => ({
      x: pad + ((point.lng - minLng) / lngSpan) * (width - pad * 2),
      y: height - pad - ((point.lat - minLat) / latSpan) * (height - pad * 2),
    });
  }

  const pickupPos = pickup ? project(pickup) : null;
  const dropoffPos = dropoff ? project(dropoff) : null;
  const driverPos = driver ? project(driver) : null;

  const route =
    pickupPos && dropoffPos
      ? `M ${pickupPos.x} ${pickupPos.y} Q ${(pickupPos.x + dropoffPos.x) / 2 + 34} ${
          (pickupPos.y + dropoffPos.y) / 2 - 30
        } ${dropoffPos.x} ${dropoffPos.y}`
      : null;

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl bg-map ${heightClass}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" aria-label="แผนที่เส้นทาง">
        <defs>
          <linearGradient id="rideRoute" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#22d3a7" />
          </linearGradient>
          <radialGradient id="rideGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={width} height={height} fill="#101418" />
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
          <line key={`x-${x}`} x1={x} y1="0" x2={x + 40} y2={height} stroke="#1e262d" strokeWidth="1" />
        ))}
        {[30, 70, 110, 150, 190, 230].map((y) => (
          <line key={`y-${y}`} x1="0" y1={y} x2={width} y2={y + 24} stroke="#1b232a" strokeWidth="1" />
        ))}
        <circle cx={width * 0.7} cy={height * 0.55} r="70" fill="url(#rideGlow)" />

        {route ? (
          <>
            <path d={route} stroke="#0b1220" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path
              d={route}
              stroke="url(#rideRoute)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 8"
              className="ride-route-dash"
            />
          </>
        ) : null}

        {pickupPos ? (
          <g>
            <circle cx={pickupPos.x} cy={pickupPos.y} r="11" fill="#0050cb" opacity="0.25" />
            <circle cx={pickupPos.x} cy={pickupPos.y} r="6" fill="#0050cb" stroke="#fff" strokeWidth="2" />
          </g>
        ) : null}

        {dropoffPos ? (
          <g>
            <circle cx={dropoffPos.x} cy={dropoffPos.y} r="11" fill="#ff5722" opacity="0.25" />
            <rect
              x={dropoffPos.x - 5}
              y={dropoffPos.y - 5}
              width="10"
              height="10"
              rx="2.5"
              fill="#ff5722"
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        ) : null}

        {driverPos ? (
          <g>
            <circle cx={driverPos.x} cy={driverPos.y} r="16" fill="#22d3a7" opacity="0.2" />
            <circle cx={driverPos.x} cy={driverPos.y} r="11" fill="#0f172a" stroke="#22d3a7" strokeWidth="2" />
            <path
              d={`M ${driverPos.x} ${driverPos.y - 5} l 4.8 9 h -9.6 z`}
              fill="#22d3a7"
            />
          </g>
        ) : null}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 font-label-sm text-label-sm text-white backdrop-blur">
        {driverPos ? "คนขับกำลังเคลื่อนที่" : "เส้นทางโดยประมาณ"}
      </div>
    </div>
  );
}

export default RideMap;
