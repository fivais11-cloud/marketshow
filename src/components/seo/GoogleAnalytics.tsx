'use client';

import Script from 'next/script';

// Google Analytics 4
// Замените GA_MEASUREMENT_ID на реальный ID после регистрации в Google Analytics
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Заменить на реальный ID

export function GoogleAnalytics() {
  // Не рендерим в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
    </>
  );
}

// Функция для отправки событий
export const sendGAEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }
};

// События для отслеживания
export const GA_EVENTS = {
  ORDER_CLICK: { action: 'click', category: 'order' },
  PHONE_CLICK: { action: 'click', category: 'contact', label: 'phone' },
  TELEGRAM_CLICK: { action: 'click', category: 'contact', label: 'telegram' },
  CART_ADD: { action: 'add', category: 'cart' },
  CART_OPEN: { action: 'open', category: 'cart' },
  PRODUCT_VIEW: { action: 'view', category: 'product' },
  SEARCH: { action: 'search', category: 'engagement' },
} as const;
