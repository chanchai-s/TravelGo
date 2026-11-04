"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRideJob, apiRideMessages, type RideJob } from "@/app/Api/mainApi";
import { connectRideSocket } from "@/app/Api/rideSocket";
import { useAuthStore } from "@/app/stores/auth.stores";
import { useRideStore, type RideMessage } from "@/app/stores/ride.stores";

/**
 * ติดตามงานแบบสด: Socket.IO เป็นหลัก + poll สำรองทุก 12 วินาที
 * ใช้ร่วมทั้งหน้า rider และ driver
 */
export function useRideTracking(jobId: string) {
  const [job, setJob] = useState<RideJob | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);
  const driverPos = useRideStore((state) => state.driverPos);
  const messages = useRideStore((state) => state.messages);
  const setDriverPos = useRideStore((state) => state.setDriverPos);
  const setMessages = useRideStore((state) => state.setMessages);
  const addMessage = useRideStore((state) => state.addMessage);
  const reset = useRideStore((state) => state.reset);

  const reload = useCallback(async () => {
    if (jobId === "") {
      return null;
    }
    try {
      const res = await apiRideJob(jobId);
      const data = (res.data?.data ?? res.data) as RideJob;
      setJob(data);
      setError("");
      return data;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "โหลดงานไม่สำเร็จ");
      return null;
    }
  }, [jobId]);

  // โหลดครั้งแรก + poll สำรอง
  useEffect(() => {
    void reload();
    if (jobId === "") {
      return;
    }
    const timer = setInterval(() => {
      void reload();
    }, 12000);
    return () => clearInterval(timer);
  }, [jobId, reload]);

  // โหลดแชทเก่า
  const reloadMessages = useCallback(async () => {
    if (jobId === "") {
      return;
    }
    try {
      const res = await apiRideMessages(jobId);
      const data = res.data?.data ?? res.data;
      setMessages((data?.messages ?? []) as RideMessage[]);
    } catch {
      // ปล่อยให้ socket อัปเดตแทน
    }
  }, [jobId, setMessages]);

  useEffect(() => {
    void reloadMessages();
  }, [reloadMessages]);

  // Socket
  useEffect(() => {
    if (jobId === "" || token === null) {
      return;
    }
    const socket = connectRideSocket(token);
    if (socket === null) {
      return;
    }

    const join = () => {
      setConnected(socket.connected);
      socket.emit("job:join", jobId);
    };

    const onLocation = (payload: { jobId: string; lat: number; lng: number }) => {
      if (payload?.jobId === jobId) {
        setDriverPos({ lat: payload.lat, lng: payload.lng });
      }
    };
    const onStatus = () => {
      void reload();
    };
    const onMessage = (message: RideMessage) => {
      if (message?.jobId === jobId) {
        addMessage(message);
      }
    };

    socket.on("connect", join);
    socket.on("disconnect", () => setConnected(false));
    socket.on("job:location", onLocation);
    socket.on("chat:message", onMessage);
    ["job:status", "job:accepted", "job:arrived", "job:started", "job:completed", "job:cancelled", "job:payment"].forEach(
      (event) => socket.on(event, onStatus),
    );

    if (socket.connected) {
      join();
    }

    return () => {
      socket.emit("job:leave", jobId);
      socket.off("connect", join);
      socket.off("job:location", onLocation);
      socket.off("chat:message", onMessage);
      ["job:status", "job:accepted", "job:arrived", "job:started", "job:completed", "job:cancelled", "job:payment"].forEach(
        (event) => socket.off(event, onStatus),
      );
    };
  }, [jobId, token, reload, setDriverPos, addMessage]);

  useEffect(() => {
    reset();
  }, [jobId, reset]);

  return {
    job,
    setJob,
    driverPos,
    messages,
    connected,
    error,
    reload,
    reloadMessages,
  };
}

export default useRideTracking;
