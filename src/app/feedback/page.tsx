"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle, ChevronUp } from "lucide-react";
import TabBar from "@/components/TabBar";

interface FeedbackItem {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [idToken, setIdToken] = useState<string | null>(null);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const tt = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(key, locale, params),
    [locale]
  );

  useEffect(() => { setLocale(detectLocale()); }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setIdToken(await u.getIdToken());
    });
    return () => unsub();
  }, [router]);

  const fetchFeedback = useCallback(async () => {
    if (!idToken) return;
    try {
      const res = await fetch("/api/feedback", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.feedback || []);
      }
    } catch { /* */ } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => { if (idToken) fetchFeedback(); }, [idToken, fetchFeedback]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idToken || !message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (res.ok) {
        setMessage("");
        setSent(true);
        setTimeout(() => setSent(false), 2000);
        await fetchFeedback();
      }
    } catch { /* */ } finally {
      setSending(false);
    }
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return tt("feedback.just_now");
    if (mins < 60) return tt("feedback.mins_ago", { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return tt("feedback.hours_ago", { count: hours });
    const days = Math.floor(hours / 24);
    return tt("feedback.days_ago", { count: days });
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-center px-4 py-3">
          <h1 className="text-[15px] font-bold">{tt("feedback.title")}</h1>
        </div>
        <p className="text-center text-[11px] pb-2.5 px-6" style={{ color: "var(--text-muted)" }}>
          {tt("feedback.subtitle")}
        </p>
      </div>

      {/* Form */}
      <div className="px-4 mt-3">
        <form onSubmit={handleSubmit}>
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={tt("feedback.placeholder")}
              maxLength={500}
              rows={3}
              className="w-full px-3.5 pt-3 pb-1 text-[13px] resize-none outline-none placeholder:text-gray-300"
              style={{ background: "transparent" }}
            />
            <div className="flex items-center justify-between px-3.5 pb-2.5">
              <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                {message.length}/500
              </span>
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all duration-150 active:scale-[0.95] disabled:opacity-40"
                style={{ background: "var(--accent)" }}
              >
                {sending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {tt("feedback.send")}
              </button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1.5 mt-2 py-2 rounded-lg text-[12px] font-semibold"
              style={{ background: "var(--success-light)", color: "var(--success)" }}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              {tt("feedback.sent")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* List */}
      <div className="px-4 mt-5">
        <h2 className="text-[13px] font-bold uppercase tracking-wide mb-2.5" style={{ color: "var(--text-secondary)" }}>
          {tt("feedback.all_suggestions")}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl" style={{ border: "1px solid var(--border)" }}>
            <MessageCircle className="w-7 h-7 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
            <p className="text-[13px] font-semibold">{tt("feedback.empty")}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{tt("feedback.empty_sub")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl p-3.5"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: "var(--accent)" }}
                    >
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[12px] font-semibold">{item.username}</span>
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <TabBar t={tt} />
    </div>
  );
}
