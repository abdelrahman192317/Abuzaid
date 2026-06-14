import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Mo7ammed Abuzaid — Photographer & Director",
  description:
    "Editorial, brand and documentary photography. Image-led brand worlds by Mo7ammed Abuzaid.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SmoothScrollProvider>
          <CursorProvider>{children}</CursorProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
