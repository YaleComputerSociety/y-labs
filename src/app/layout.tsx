import type { Metadata } from "next";
import UserContextProvider from "@/context/UserContextProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter', // optional CSS variable
  display: 'swap',
});

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
    <html lang="en" className={inter.variable}>
      <body>
        <UserContextProvider>
          <Navbar />
          <main>{children}</main>
        </UserContextProvider>
      </body>
    </html>
  );
}