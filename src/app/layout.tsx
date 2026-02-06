import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bravoo - Daily Micro-Fitness",
  description:
    "Two tiny challenges per day. Move for 2 minutes. Earn a star. Build momentum.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mx-auto max-w-md min-h-dvh">{children}</div>
      </body>
    </html>
  );
}
