import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Engbook - Learn English",
    template: "%s | Engbook"
  },
  description: "Your personal English learning notebook. Track vocabulary, grammar, and improve your skills with AI-powered exercises.",
  keywords: ["English learning", "Vocabulary", "Grammar", "Flashcards", "Personal Notebook", "AI English Tutor"],
  authors: [{ name: "Engbook Team" }],
  creator: "Engbook",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Engbook - Learn English",
    description: "Your personal English learning notebook. Track vocabulary, grammar, and improve your skills with AI-powered exercises.",
    siteName: "Engbook",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Engbook Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engbook - Learn English",
    description: "Your personal English learning notebook.",
    images: ["/icon.png"],
    creator: "@engbook",
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${beVietnamPro.variable} ${geistMono.variable}`}>
      <body
        className={`font-sans antialiased min-h-screen flex flex-col bg-gradient-mesh`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <ThemeToggle />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
