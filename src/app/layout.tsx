import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "y/labs",
  description: "A Yale Research database. Search through 1400+ Yale faculty listings across 60+ fields of study. Learn about professors who share your research interests and find potential research mentors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
