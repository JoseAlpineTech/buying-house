import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  metadataBase: new URL("https://buying-house.pages.dev"),

  title: "Housing Affordability Analysis 2025",
  description: "Interactive analysis of income, prices, mortgage burden, and buying power in 2025.",

  openGraph: {
    title: "Housing Affordability Analysis 2025",
    description:
      "Interactive analysis of home buying conditions — incomes, prices, mortgage burden, and affordability.",
    url: "https://buying-house.pages.dev",
    siteName: "Buying House",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Housing Affordability 2025",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Housing Affordability Analysis 2025",
    description:
      "Interactive affordability model exploring income, home prices, and mortgage burden.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
