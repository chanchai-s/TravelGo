"use client";

import { io, type Socket } from "socket.io-client";

/**
 * Socket.IO client ของ ride (tracking + chat + SOS)
 * - ใช้ token เดียวกับ REST (localStorage: travel_token)
 * - เป็น singleton เพื่อไม่ให้เปิดหลาย connection ตอนเปลี่ยนหน้า
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

let socket: Socket | null = null;
let currentToken = "";

export function connectRideSocket(token: string): Socket | null {
  if (typeof window === "undefined" || token === "") {
    return null;
  }

  if (socket !== null && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (socket !== null) {
    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
    return socket;
  }

  currentToken = token;
  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnectionAttempts: 10,
  });

  return socket;
}

export function getRideSocket(): Socket | null {
  return socket;
}

export function disconnectRideSocket() {
  socket?.disconnect();
  socket = null;
  currentToken = "";
}
