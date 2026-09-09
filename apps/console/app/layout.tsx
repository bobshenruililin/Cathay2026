import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reconnect — HKG Transfer Desk",
  description: "Missed-connection recovery console for HKG gate agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
