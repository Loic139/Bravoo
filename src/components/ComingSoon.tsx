"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-28 pb-32">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "var(--accent-light)", color: "var(--accent)" }}
      >
        {icon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <div
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3"
          style={{ background: "var(--accent-light)", color: "var(--accent)" }}
        >
          <Construction className="w-3 h-3" />
          {title}
        </div>

        <p
          className="text-[13px] leading-relaxed max-w-xs mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </motion.div>
    </div>
  );
}
