"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  emoji: string;
  title: string;
  description: string;
}

export default function ComingSoon({ emoji, title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-24 pb-32">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-7xl mb-6"
      >
        {emoji}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <div
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.08)", color: "var(--accent)" }}
        >
          <Construction className="w-3.5 h-3.5" />
          {title}
        </div>

        <p
          className="text-sm leading-relaxed max-w-xs mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </motion.div>
    </div>
  );
}
