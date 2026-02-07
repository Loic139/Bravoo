"use client";

import { Lock } from "lucide-react";

interface EmptySlotProps {
  message: string;
}

export default function EmptySlot({ message }: EmptySlotProps) {
  return (
    <div
      className="flex items-center justify-center gap-2.5 py-6 rounded-2xl border-2 border-dashed"
      style={{ borderColor: "#D1D5DB", opacity: 0.45 }}
    >
      <Lock className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </div>
  );
}
