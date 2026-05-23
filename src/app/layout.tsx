import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velocity Luxe Media — AI Receptionist for Contractors",
  description:
    "Never miss a lead. AI answers your phones, qualifies callers, and books real appointments — 7-day free trial.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
