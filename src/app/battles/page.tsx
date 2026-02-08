"use client";

import { useEffect, useState } from "react";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import { Swords } from "lucide-react";
import TabBar from "@/components/TabBar";
import ComingSoon from "@/components/ComingSoon";

export default function BattlesPage() {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => { setLocale(detectLocale()); }, []);
  const tt = (key: string) => translate(key, locale);

  return (
    <div className="max-w-lg mx-auto pb-20">
      <ComingSoon
        icon={<Swords className="w-7 h-7" />}
        title={tt("coming_soon.title")}
        description={tt("coming_soon.battles")}
      />
      <TabBar t={tt} />
    </div>
  );
}
