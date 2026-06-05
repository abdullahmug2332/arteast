// app/layout.tsx
import type { Metadata } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/store/auth-context";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arteast",
  description: "Your art platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${inter.variable} antialiased`}>
        <main className="">
        
          <AuthContextProvider>{children}</AuthContextProvider></main>
      </body>
    </html>
  );
}
