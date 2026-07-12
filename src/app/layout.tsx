import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import CustomCursor from "@/components/custom-cursor";
import LoadingScreen from "@/components/loading-screen";
import WhatsappButton from "@/components/whatsapp-button";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RobsonLuiz.DEV — Desenvolvedor Full Stack & Especialista em Infraestrutura",
  description:
    "Portfólio de Robson Luiz, Desenvolvedor Full Stack e Analista de Infraestrutura, especializado em criar aplicações modernas, sistemas inteligentes e soluções escaláveis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LoadingScreen />
          <CustomCursor />
          {children}
          <WhatsappButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
