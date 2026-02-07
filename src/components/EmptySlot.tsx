"use client";

interface EmptySlotProps {
  message: string;
}

export default function EmptySlot({ message }: EmptySlotProps) {
  return (
    <div className="quest-card quest-empty-slot">
      <div className="flex items-center justify-center gap-2.5 py-5">
        <span className="text-xl" style={{ opacity: 0.25 }}>🔒</span>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
