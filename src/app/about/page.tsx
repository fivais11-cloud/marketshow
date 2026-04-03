import { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'О компании Маркет Шоу — Воздушные шары премиум-класса',
  description: 'Маркет Шоу — команда профессионалов по оформлению праздников воздушными шарами с 2019 года. Более 5000 оформленных мероприятий. Премиум качество, бережная доставка по Москве. Телефон: +7 985 800 97 19',
  keywords: [
    'о компании маркет шоу',
    'воздушные шары москва',
    'оформление праздников',
    'декораторы шаров',
    'фотозоны из шаров',
    'компания по оформлению праздников',
  ],
  openGraph: {
    title: 'О компании Маркет Шоу — Воздушные шары премиум-класса',
    description: 'Более 5 лет опыта, 5000+ оформленных мероприятий. Премиум оформление праздников воздушными шарами в Москве.',
    url: 'https://marketshow.ru/about',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://marketshow.ru/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutClient />
      
      {/* Schema.org для страницы О компании */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'О компании Маркет Шоу',
            description: 'Информация о компании Маркет Шоу — премиум оформление праздников воздушными шарами',
            url: 'https://marketshow.ru/about',
            mainEntity: {
              '@type': 'LocalBusiness',
              '@id': 'https://marketshow.ru/#organization',
              name: 'Маркет Шоу',
              description: 'Доставка воздушных шаров премиум-класса по Москве. Оформление праздников, фотозон, гирлянд и композиций из шаров.',
              url: 'https://marketshow.ru',
              logo: 'https://marketshow.ru/logo.svg',
              foundingDate: '2019',
              numberOfEmployees: {
                '@type': 'QuantitativeValue',
                minValue: 10,
                maxValue: 20,
              },
              telephone: '+7-985-800-97-19',
              email: 'info@marketshow.ru',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Москва',
                addressRegion: 'Москва',
                addressCountry: 'RU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '55.7558',
                longitude: '37.6173',
              },
              areaServed: {
                '@type': 'City',
                name: 'Москва',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Услуги по оформлению праздников',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Фотозоны из шаров',
                      description: 'Создание фотозон из воздушных шаров для мероприятий',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Гирлянды из шаров',
                      description: 'Изготовление гирлянд из воздушных шаров',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Композиции из шаров',
                      description: 'Создание композиций из воздушных шаров для праздников',
                    },
                  },
                ],
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '500',
                bestRating: '5',
                worstRating: '1',
              },
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
                  name: 'О компании',
                  item: 'https://marketshow.ru/about',
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
