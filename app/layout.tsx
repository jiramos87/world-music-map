import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Music Map",
  description:
    "Click a place, hear its music. A discovery-first interactive map of world music.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-white antialiased">{children}</body>
    </html>
  );
}
