import type { Metadata, Viewport } from "next";
import { Geologica, Roboto_Mono } from "next/font/google";
import "./globals.css";

const geologica = Geologica({
  variable: "--font-geologica",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic"],
});

const mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Чистовик — ремонт квартир под ключ в Минске",
  description:
    "Концепт для портфолио: ремонт квартир под ключ с фиксированной сметой. Калькулятор стоимости, этапы работ, объекты и заявка на замер.",
};

export const viewport: Viewport = {
  themeColor: "#f3f0e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geologica.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
