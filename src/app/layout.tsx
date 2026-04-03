import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/QueryProvider";
import { Header } from "@/components/layout/Header";
import { FloatingContactButton } from "@/components/layout/FloatingContactButton";
import { CartModal } from "@/components/cart/CartModal";
import { YandexMetrika } from "@/components/seo/YandexMetrika";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://marketshow.ru'),
  
  // Основные мета-теги
  title: {
    default: "Маркет Шоу — Воздушные шары премиум-класса с доставкой по Москве",
    template: "%s | Маркет Шоу",
  },
  description: "Маркет Шоу — премиум оформление праздников воздушными шарами в Москве. Доставка бесплатно от 3000₽. Фотозоны, гирлянды, композиции из шаров на свадьбу, день рождения, детский праздник. Заказывайте онлайн +7 985 800 97 19",
  keywords: [
    // Основные ключевые слова
    "воздушные шары",
    "доставка шаров",
    "шары москва",
    "заказать шары",
    "шарики на праздник",
    // Услуги
    "фотозоны из шаров",
    "гирлянды из шаров",
    "композиции из шаров",
    "оформление праздников",
    "декор шарами",
    // Поводы
    "шары на день рождения",
    "свадебные шары",
    "детские шары",
    "шары на юбилей",
    "корпоративное оформление",
    // Качество
    "премиум шары",
    "качественные шары",
    "шары с гелием",
    // Бренд
    "маркет шоу",
    "marketshow",
  ],
  authors: [{ name: "Маркет Шоу", url: "https://marketshow.ru" }],
  publisher: "Маркет Шоу",
  creator: "Маркет Шоу",
  
  // Роботы
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Иконки
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  
  // Тема
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C4A4A4" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  
  // Manifest для PWA
  manifest: "/manifest.json",
  
  // Open Graph (для соцсетей)
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://marketshow.ru",
    siteName: "Маркет Шоу",
    title: "Маркет Шоу — Воздушные шары премиум-класса с доставкой по Москве",
    description: "Премиум оформление праздников воздушными шарами. Доставка по Москве бесплатно от 3000₽. Фотозоны, гирлянды, композиции из шаров.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Маркет Шоу — воздушные шары премиум-класса",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Маркет Шоу — Воздушные шары премиум-класса",
    description: "Премиум оформление праздников воздушными шарами в Москве. Доставка бесплатно от 3000₽.",
    images: ["/og-image.jpg"],
    creator: "@marketshow",
  },
  
  // Верификация для поисковиков (заполнить при регистрации)
  verification: {
    google: "google-site-verification-code", // Заменить при регистрации в Google Search Console
    yandex: "yandex-verification-code", // Заменить при регистрации в Яндекс.Вебмастер
  },
  
  // Альтернативные языки (если будет мультиязычность)
  alternates: {
    canonical: "https://marketshow.ru",
  },
  
  // Категория для поисковиков
  category: "shopping",
  
  // Форматирование
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Приложения
  applicationName: "Маркет Шоу",
  
  // Генерация
  generator: "Next.js",
};

// Viewport settings
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C4A4A4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Предподключение к внешним ресурсам */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch для ускорения */}
        <link rel="dns-prefetch" href="https://yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://marketshow.ru" />
        
        {/* Дополнительные мета-теги для геолокации */}
        <meta name="geo.region" content="RU-MOW" />
        <meta name="geo.placename" content="Москва" />
        <meta name="geo.position" content="55.7558;37.6173" />
        <meta name="ICBM" content="55.7558, 37.6173" />
        
        {/* Для мобильных */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Маркет Шоу" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <Header />
          {children}
          <FloatingContactButton />
          <CartModal />
        </QueryProvider>
        <Toaster />
        
        {/* Аналитика */}
        <YandexMetrika />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
