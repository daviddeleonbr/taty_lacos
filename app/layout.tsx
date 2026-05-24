import type { Metadata } from "next";
import { playfair, inter, allura, cormorant } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lúa & Lis · Lacinhos artesanais para princesinhas",
    template: "%s · Lúa & Lis",
  },
  description:
    "Laços feitos à mão, em pequenos lotes, especialmente para a princesa da sua vida. Pronta entrega e peças sob encomenda — para a primeira foto, o batizado e os dias mais especiais.",
  keywords: [
    "laços infantis",
    "lacinhos artesanais",
    "laço para bebê",
    "tiara newborn",
    "ateliê de laços",
    "moda infantil",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Lúa & Lis · Lacinhos artesanais para princesinhas",
    description:
      "Laços feitos à mão, especialmente para a princesa da sua vida.",
    siteName: "Lúa & Lis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lúa & Lis · Lacinhos artesanais para princesinhas",
    description: "Laços feitos à mão, especialmente para a princesa da sua vida.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} ${allura.variable} ${cormorant.variable}`}
    >
      <body className="font-sans antialiased bg-cream text-ink-600 min-h-screen">
        {children}
      </body>
    </html>
  );
}
