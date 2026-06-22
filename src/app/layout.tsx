import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "FridgeAI – Smart Meal Tracker",
  description:
    "Scanne deinen Kühlschrank per KI, verwalte Lebensmittel und erhalte passende Rezeptvorschläge.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        <div className="max-w-md mx-auto min-h-screen pb-24 relative">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
