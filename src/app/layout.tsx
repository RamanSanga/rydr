import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppNavbar from "@/components/AppNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rydr — Let's Go Somewhere",
  description: "Safe, comfortable, and friendly rides in seconds. Whether it's late-night chai runs, cozy rainy days, airport trips, or weekend plans — we're ready when you are.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          <AppNavbar />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
