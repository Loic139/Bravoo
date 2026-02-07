"use client";

import { useEffect, useState } from "react";

const CONGRATS_MESSAGES_EN = [
  "Boom! You crushed it!",
  "Bravoo champ!",
  "Unstoppable!",
  "That's how it's done!",
  "Legend in the making!",
  "Tiny effort, big win!",
  "You showed up. That's everything.",
  "Keep going!",
  "Momentum is building!",
  "Your future self says thanks!",
];

const CONGRATS_MESSAGES_FR = [
  "Boom ! Tu geres !",
  "Champion Bravoo !",
  "Inarretable !",
  "C'est comme ca qu'on fait !",
  "Future legende !",
  "Petit effort, grand resultat !",
  "Tu es la. C'est l'essentiel.",
  "Continue comme ca !",
  "L'elan se construit !",
  "Ton futur toi te remercie !",
];

interface CompletionPopupProps {
  visible: boolean;
  goldEarned: number;
  stars: number;
  locale: "en" | "fr";
  t: (key: string, params?: Record<string, string | number>) => string;
  onClose: () => void;
}

export default function CompletionPopup({
  visible,
  goldEarned,
  stars,
  locale,
  t,
  onClose,
}: CompletionPopupProps) {
  const [message, setMessage] = useState("");
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; left: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    if (visible) {
      const messages = locale === "fr" ? CONGRATS_MESSAGES_FR : CONGRATS_MESSAGES_EN;
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
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
  }, [visible, locale]);

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

        <div className="text-6xl mb-4 animate-star-bounce">🪙</div>
        <h2 className="text-2xl font-black mb-2">{message}</h2>
        <p className="text-lg mb-1" style={{ color: "var(--color-text-muted)" }}>
          {t("popup.well_done")}
        </p>
        <p className="text-xl font-black mb-1" style={{ color: "var(--color-star)" }}>
          {t("popup.gold_earned", { amount: goldEarned })}
        </p>
        <p className="text-sm mb-6" style={{ color: "var(--color-star)" }}>
          {stars} ⭐
        </p>

        <button onClick={onClose} className="btn-primary">
          {t("popup.continue")}
        </button>
      </div>
    </div>
  );
}
