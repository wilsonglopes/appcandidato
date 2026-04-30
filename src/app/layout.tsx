import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zé Milton | Conectando Apoiadores",
  description: "Uma rede social privada para organização e engajamento da equipe.",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Zé Milton",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icon.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} h-full antialiased selection:bg-primary/20 selection:text-primary`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
