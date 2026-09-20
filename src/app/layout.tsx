import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlacePrep - Placement Tracker & Prep Planner",
  description: "Track job applications, manage company prep checklists, log interview experiences and analyze readiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

