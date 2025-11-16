import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Buying House",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="light antialiased">
        {children}
      </body>
    </html>
  );
}
