import { Metadata } from 'next';
import { ContactsClient } from './ContactsClient';

export const metadata: Metadata = {
  title: 'Контакты — Связаться с Маркет Шоу',
  description: 'Свяжитесь с Маркет Шоу для заказа воздушных шаров в Москве. Телефон: +7 985 800 97 19. Telegram, Max. Работаем ежедневно с 9:00 до 21:00. Доставка по всей Москве.',
  keywords: [
    'контакты маркет шоу',
    'заказать шары москва телефон',
    'шары на праздник контакты',
    'воздушные шары заказать',
    'маркет шоу телефон',
    'шары москва заказать',
  ],
  openGraph: {
    title: 'Контакты Маркет Шоу — Заказ воздушных шаров в Москве',
    description: 'Свяжитесь с нами для заказа воздушных шаров. Телефон: +7 985 800 97 19. Работаем ежедневно.',
    url: 'https://marketshow.ru/contacts',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://marketshow.ru/contacts',
  },
};

export default function ContactsPage() {
  return (
    <>
      <ContactsClient />
      
      {/* Schema.org для страницы контактов */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Контакты Маркет Шоу',
            description: 'Свяжитесь с нами для заказа воздушных шаров в Москве',
            url: 'https://marketshow.ru/contacts',
            mainEntity: {
              '@type': 'LocalBusiness',
              '@id': 'https://marketshow.ru/#organization',
              name: 'Маркет Шоу',
              telephone: '+79858009719',
              email: 'info@marketshow.ru',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Москва',
                addressCountry: 'RU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '55.7558',
                longitude: '37.6173',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '09:00',
                closes: '21:00',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+7-985-800-97-19',
                  contactType: 'customer service',
                  availableLanguage: ['Russian'],
                  areaServed: 'RU',
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+7-985-800-97-19',
                  contactType: 'sales',
                  availableLanguage: ['Russian'],
                  areaServed: 'RU',
                },
              ],
              sameAs: [
                'https://t.me/TanyaShow',
              ],
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
                  name: 'Контакты',
                  item: 'https://marketshow.ru/contacts',
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
