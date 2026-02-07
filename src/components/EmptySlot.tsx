"use client";

interface EmptySlotProps {
  message: string;
}

export default function EmptySlot({ message }: EmptySlotProps) {
  return (
    <div className="quest-card quest-empty-slot">
      <div className="flex items-center justify-center gap-2 py-4">
        <span className="text-2xl" style={{ opacity: 0.3 }}>🔒</span>
        <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
