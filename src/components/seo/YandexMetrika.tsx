'use client';

import Script from 'next/script';

// Яндекс.Метрика
// Замените YANDEX_METRIKA_ID на реальный ID счётчика после регистрации в Яндекс.Метрике
const YANDEX_METRIKA_ID = '00000000'; // Заменить на реальный ID

export function YandexMetrika() {
  // Не рендерим в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <>
      {/* Яндекс.Метрика */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${YANDEX_METRIKA_ID}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `,
        }}
      />
      
      {/* Noscript fallback */}
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

// Функция для отправки целей (цели настраиваются в Яндекс.Метрике)
export const sendYandexGoal = (goalName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && 'ym' in window) {
    const ym = (window as { ym?: (id: number, method: string, ...args: unknown[]) => void }).ym;
    if (ym) {
      ym(Number(YANDEX_METRIKA_ID), 'reachGoal', goalName, params);
    }
  }
};

// Цели для отслеживания
export const YA_GOALS = {
  ORDER_CLICK: 'order_click',           // Клик на кнопку заказа
  PHONE_CLICK: 'phone_click',           // Клик на телефон
  TELEGRAM_CLICK: 'telegram_click',     // Клик на Telegram
  CART_ADD: 'cart_add',                 // Добавление в корзину
  CART_OPEN: 'cart_open',               // Открытие корзины
  FORM_SUBMIT: 'form_submit',           // Отправка формы
  PRODUCT_VIEW: 'product_view',         // Просмотр товара
  CATEGORY_CLICK: 'category_click',     // Клик по категории
  SEARCH: 'search',                     // Поиск
  SCROLL_DEPTH: 'scroll_depth',         // Глубина скролла
} as const;
