import { Metadata } from 'next';
import { DeliveryClient } from './DeliveryClient';

export const metadata: Metadata = {
  title: 'Доставка и оплата воздушных шаров по Москве',
  description: 'Доставка воздушных шаров по всей Москве бесплатно от 3000₽. Срочная доставка за 2 часа. Оплата картой, наличными, безналичный расчёт. Работаем ежедневно с 9:00 до 21:00. Телефон: +7 985 800 97 19',
  keywords: [
    'доставка шаров москва',
    'доставка воздушных шаров',
    'заказать шары с доставкой',
    'шары с доставкой москва',
    'срочная доставка шаров',
    'бесплатная доставка шаров',
    'шары на дом москва',
    'доставка гелиевых шаров',
  ],
  openGraph: {
    title: 'Доставка и оплата воздушных шаров — Маркет Шоу',
    description: 'Бесплатная доставка шаров по Москве от 3000₽. Срочная доставка за 2 часа.',
    url: 'https://marketshow.ru/delivery',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://marketshow.ru/delivery',
  },
};

export default function DeliveryPage() {
  return (
    <>
      <DeliveryClient />
      
      {/* Schema.org для страницы доставки */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Доставка и оплата воздушных шаров',
            description: 'Доставка воздушных шаров по Москве. Бесплатно от 3000₽. Срочная доставка за 2 часа.',
            url: 'https://marketshow.ru/delivery',
            mainEntity: {
              '@type': 'LocalBusiness',
              name: 'Маркет Шоу',
              '@id': 'https://marketshow.ru/#organization',
              offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceRange: 'От 500₽',
                areaServed: {
                  '@type': 'City',
                  name: 'Москва',
                },
                deliveryLeadTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 2,
                  maxValue: 4,
                  unitText: 'час',
                },
              },
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Главная',
                  item: 'https://marketshow.ru/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Доставка и оплата',
                  item: 'https://marketshow.ru/delivery',
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
