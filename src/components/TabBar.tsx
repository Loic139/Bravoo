"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swords, User, ShoppingBag, Dumbbell } from "lucide-react";

interface Tab {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface TabBarProps {
  t: (key: string) => string;
}

export default function TabBar({ t }: TabBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs: Tab[] = [
    { key: "quests", path: "/", icon: <Dumbbell className="w-5 h-5" />, label: t("tab.quests") },
    { key: "character", path: "/character", icon: <User className="w-5 h-5" />, label: t("tab.character") },
    { key: "shop", path: "/shop", icon: <ShoppingBag className="w-5 h-5" />, label: t("tab.shop") },
    { key: "battles", path: "/battles", icon: <Swords className="w-5 h-5" />, label: t("tab.battles") },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 pt-3 relative transition-colors"
              style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
                  style={{ background: "var(--accent)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.icon}
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding for notched phones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
