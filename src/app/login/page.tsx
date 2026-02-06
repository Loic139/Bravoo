"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      localStorage.setItem("bravoo_token", data.user.token);
      localStorage.setItem("bravoo_username", data.user.username);
      router.push("/");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6">
      <div className="animate-slide-up w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-2">
            <span style={{ color: "var(--color-primary)" }}>Bravoo</span>
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
            2 minutes. 1 star. Daily momentum.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              maxLength={20}
              className="w-full px-4 py-4 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              style={{
                background: "var(--color-card)",
                color: "var(--color-text)",
              }}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button type="submit" className="btn-primary text-lg" disabled={loading || !username.trim()}>
            {loading ? "Loading..." : "Let's go!"}
          </button>
        </form>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          No email or password needed.
          <br />
          Just pick a name and start moving!
        </p>
      </div>
    </div>
  );
}
