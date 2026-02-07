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
          color: ["#FF6B35", "#FBBF24", "#10B981", "#2563EB", "#7C3AED"][
            Math.floor(Math.random() * 5)
          ],
        }))
      );
    }
  }, [visible, locale]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-sm text-center animate-slide-up relative overflow-hidden"
        style={{
          background: "white",
          borderRadius: "28px",
          padding: "2rem 1.5rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
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
        <h2 className="text-xl font-extrabold mb-1" style={{ color: "var(--color-text)" }}>{message}</h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          {t("popup.well_done")}
        </p>

        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mb-2"
          style={{ background: "#FEF3C7" }}
        >
          <span className="text-lg">🪙</span>
          <span className="text-lg font-extrabold" style={{ color: "var(--color-gold)" }}>
            {t("popup.gold_earned", { amount: goldEarned })}
          </span>
        </div>

        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          {stars} ⭐
        </p>

        <button onClick={onClose} className="btn-accent">
          {t("popup.continue")}
        </button>
      </div>
    </div>
  );
}
