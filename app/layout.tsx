import type { Metadata } from "next";
import {
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_Hebrew,
} from "next/font/google";
import "./globals.css";

const noto = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  display: "swap",
});

const notoKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  display: "swap",
});

const notoHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Housing Affordability in 2025",
  description: "A visual journey through housing affordability dynamics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${noto.variable} ${notoJP.variable} ${notoKR.variable} ${notoHebrew.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}