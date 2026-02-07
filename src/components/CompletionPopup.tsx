"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ArrowRight } from "lucide-react";

const MESSAGES_EN = [
  "Boom! You crushed it!", "Bravoo champ!", "Unstoppable!",
  "That's how it's done!", "Legend in the making!", "Tiny effort, big win!",
  "You showed up!", "Keep going!", "Momentum!",
];
const MESSAGES_FR = [
  "Boom ! Tu geres !", "Champion Bravoo !", "Inarretable !",
  "C'est comme ca !", "Future legende !", "Petit effort, grand resultat !",
  "Tu es la !", "Continue !", "L'elan se construit !",
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
  visible, goldEarned, stars, locale, t, onClose,
}: CompletionPopupProps) {
  const [message, setMessage] = useState("");
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    if (visible) {
      const msgs = locale === "fr" ? MESSAGES_FR : MESSAGES_EN;
      setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
      setConfetti(
        Array.from({ length: 14 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.4,
          color: ["#FF6B35", "#FBBF24", "#10B981", "#2563EB", "#7C3AED"][Math.floor(Math.random() * 5)],
        }))
      );
    }
  }, [visible, locale]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm text-center relative overflow-hidden rounded-3xl p-8"
            style={{ background: "white", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
          >
            {/* Confetti */}
            {confetti.map((p) => (
              <div
                key={p.id}
                className="absolute animate-confetti"
                style={{
                  left: `${p.left}%`, bottom: 0, animationDelay: `${p.delay}s`,
                  width: 8, height: 8, borderRadius: "50%", background: p.color,
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="text-6xl mb-5"
            >
              🪙
            </motion.div>

            <h2 className="text-xl font-extrabold mb-1">{message}</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>{t("popup.well_done")}</p>

            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mb-2"
              style={{ background: "#FEF3C7" }}
            >
              <Coins className="w-5 h-5" style={{ color: "var(--gold)" }} />
              <span className="text-lg font-extrabold" style={{ color: "var(--gold)" }}>
                {t("popup.gold_earned", { amount: goldEarned })}
              </span>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{stars} ⭐</p>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-[0.97]"
              style={{ background: "var(--accent)" }}
            >
              {t("popup.continue")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
