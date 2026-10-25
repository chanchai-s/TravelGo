"use client";

import { useEffect, useState } from "react";
import { apiStayCalendar } from "@/app/Api/mainApi";

type DayRoom = {
  roomTypeId: string;
  name: string;
  totalRooms: number;
  booked: number;
  available: number;
  isClosed: boolean;
};

type Day = { date: string; rooms: DayRoom[] };

/** แถบห้องว่างล่วงหน้า 14 วัน (เขียว=ว่าง / เทา=เต็ม / ตากลาย=ปิดขาย) */
export function AvailabilityStrip({ stayId }: { stayId: string }) {
  const [days, setDays] = useState<Day[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiStayCalendar(stayId, 14)
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: { days?: Day[] } }).data;
        setDays(data?.days ?? []);
        setError("");
      })
      .catch(() => setError("โหลดปฏิทินห้องว่างไม่สำเร็จ"));
  }, [stayId]);

  if (error !== "") {
    return <p className="mt-1 font-body-sm text-body-sm text-tertiary">{error}</p>;
  }
  if (days.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="font-label-sm text-label-sm text-tertiary">ห้องว่าง 14 วันข้างหน้า</p>
      <div className="mt-1 flex gap-1 overflow-x-auto pb-1">
        {days.map((day) => {
          const room = day.rooms[0];
          const closed = room?.isClosed === true;
          const full = !closed && (room?.available ?? 0) <= 0;
          const tone = closed
            ? "bg-surface-container-high text-tertiary"
            : full
              ? "bg-surface-container-low text-tertiary"
              : "bg-primary-container text-on-primary-container";

          const date = new Date(`${day.date}T00:00:00`);
          const label = `${date.getDate()}/${date.getMonth() + 1}`;

          return (
            <div
              key={day.date}
              title={`${day.date} · ${closed ? "ปิดขาย" : full ? "เต็ม" : `เหลือ ${room?.available} ห้อง`}`}
              className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-[10px] font-semibold ${tone}`}
            >
              <span>{label}</span>
              <span className="material-symbols-outlined text-[14px]">
                {closed ? "event_busy" : full ? "block" : "check_circle"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}