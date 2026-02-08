"use client";

import { Lock } from "lucide-react";

interface EmptySlotProps {
  message: string;
}

export default function EmptySlot({ message }: EmptySlotProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-5 rounded-xl border border-dashed"
      style={{ borderColor: "var(--border-strong)", opacity: 0.5 }}
    >
      <Lock className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
      <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </div>
  );
}
