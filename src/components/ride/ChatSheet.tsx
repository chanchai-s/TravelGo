"use client";

import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "@/components/ride/BottomSheet";
import type { RideMessage } from "@/app/stores/ride.stores";

export function ChatSheet({
  open,
  onClose,
  messages,
  currentUserId,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  messages: RideMessage[];
  currentUserId: string;
  onSend: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [open, messages.length]);

  const submit = async () => {
    const body = text.trim();
    if (body === "" || sending) {
      return;
    }
    setSending(true);
    try {
      await onSend(body);
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="แชทกับคู่เดินทาง" subtitle="ข้อความจะถูกส่งแบบเรียลไทม์">
      <div className="flex min-h-[280px] flex-col gap-2">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
            <span className="material-symbols-outlined text-[36px] text-outline-variant">forum</span>
            <p className="font-body-sm text-body-sm text-tertiary">ยังไม่มีข้อความ — ทักทายกันก่อนได้เลย</p>
          </div>
        ) : null}

        {messages.map((message) => {
          const mine = message.senderId === currentUserId;
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 font-body-md text-body-md ${
                  mine
                    ? "rounded-br-sm bg-primary text-on-primary"
                    : "rounded-bl-sm bg-surface-container-low text-on-surface"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 mt-2 flex items-center gap-2 bg-surface-container-lowest pt-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void submit();
            }
          }}
          placeholder="พิมพ์ข้อความ..."
          className="h-11 flex-1 rounded-full bg-surface-container-low px-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={sending || text.trim() === ""}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary disabled:opacity-50"
          aria-label="ส่งข้อความ"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </BottomSheet>
  );
}

export default ChatSheet;
