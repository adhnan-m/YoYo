import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YoYo Deals — Best Products & Deals",
  description:
    "Discover the best deals on top-rated products. Curated recommendations with exclusive discounts on electronics, home goods, fashion, and more.",
  keywords: "deals, discounts, amazon, affiliate, products, best deals, electronics, home, fashion",
  openGraph: {
    title: "YoYo Deals — Best Products & Deals",
    description: "Discover the best deals on top-rated products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
