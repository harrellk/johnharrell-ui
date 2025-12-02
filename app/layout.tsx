import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "John Harrell - Indiana High School Sports",
  description:
    "Indiana high school football & basketball schedules, results, and data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-black min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
