"use client";

import { useEffect, useState } from "react";

const CONGRATS_MESSAGES = [
  "Boom! You crushed it!",
  "Bravoo champ!",
  "Unstoppable!",
  "That's how it's done!",
  "Legend in the making!",
  "Tiny effort, big win!",
  "You showed up. That's everything.",
  "Star earned. Keep going!",
  "Momentum is building!",
  "Your future self says thanks!",
];

interface CompletionPopupProps {
  visible: boolean;
  stars: number;
  onContinue: () => void;
  onStop: () => void;
}

export default function CompletionPopup({
  visible,
  stars,
  onContinue,
  onStop,
}: CompletionPopupProps) {
  const [message, setMessage] = useState("");
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; left: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    if (visible) {
      setMessage(
        CONGRATS_MESSAGES[Math.floor(Math.random() * CONGRATS_MESSAGES.length)]
      );
      setConfettiPieces(
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          color: ["#FF6B35", "#FBBF24", "#22C55E", "#3B82F6", "#A855F7"][
            Math.floor(Math.random() * 5)
          ],
        }))
      );
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
      <div className="card w-full max-w-sm text-center animate-slide-up relative overflow-hidden">
        {/* Confetti */}
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-confetti"
            style={{
              left: `${piece.left}%`,
              bottom: 0,
              animationDelay: `${piece.delay}s`,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: piece.color,
            }}
          />
        ))}

        <div className="text-6xl mb-4 animate-star-bounce">⭐</div>
        <h2 className="text-2xl font-black mb-2">{message}</h2>
        <p className="text-lg mb-1" style={{ color: "var(--color-text-muted)" }}>
          Well done!
        </p>
        <p className="text-sm mb-6" style={{ color: "var(--color-star)" }}>
          You now have {stars} {stars === 1 ? "star" : "stars"}
        </p>

        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          Would you like to continue training?
        </p>

        <div className="space-y-3">
          <button onClick={onContinue} className="btn-primary">
            Continue (free workout)
          </button>
          <button onClick={onStop} className="btn-secondary">
            Stop for today
          </button>
        </div>
      </div>
    </div>
  );
}
