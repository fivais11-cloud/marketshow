interface SchemaOrgProps {
  settings?: {
    phone?: string;
    address?: string | null;
    workingHours?: string | null;
    telegram?: string | null;
  } | null;
}

export function SchemaOrg({ settings }: SchemaOrgProps) {
  const phone = settings?.phone || '+7 985 800 97 19';
  const address = settings?.address || 'Москва';
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            // Organization Schema
            {
              '@type': 'Organization',
              '@id': 'https://marketshow.ru/#organization',
              name: 'Маркет Шоу',
              alternateName: 'Market Show',
              url: 'https://marketshow.ru',
              logo: {
                '@type': 'ImageObject',
                url: 'https://marketshow.ru/logo.svg',
                width: 200,
                height: 60,
              },
              description: 'Доставка воздушных шаров премиум-класса по Москве. Оформление праздников, фотозон, гирлянд и композиций из шаров.',
              telephone: phone.replace(/\s/g, ''),
              email: 'info@marketshow.ru',
              address: {
                '@type': 'PostalAddress',
                addressLocality: address,
                addressRegion: 'Москва',
                addressCountry: 'RU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '55.7558',
                longitude: '37.6173',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '09:00',
                  closes: '21:00',
                },
              ],
              priceRange: '₽₽',
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
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: phone.replace(/\s/g, ''),
                  contactType: 'customer service',
                  availableLanguage: ['Russian'],
                  areaServed: 'RU',
                },
                {
                  '@type': 'ContactPoint',
                  telephone: phone.replace(/\s/g, ''),
                  contactType: 'sales',
                  availableLanguage: ['Russian'],
                  areaServed: 'RU',
                },
              ],
            },
            // WebSite Schema
            {
              '@type': 'WebSite',
              '@id': 'https://marketshow.ru/#website',
              url: 'https://marketshow.ru',
              name: 'Маркет Шоу',
              description: 'Доставка воздушных шаров премиум-класса по Москве',
              publisher: {
                '@id': 'https://marketshow.ru/#organization',
              },
              inLanguage: 'ru-RU',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://marketshow.ru/?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            },
            // LocalBusiness Schema
            {
              '@type': 'LocalBusiness',
              '@id': 'https://marketshow.ru/#localbusiness',
              name: 'Маркет Шоу',
              description: 'Доставка воздушных шаров премиум-класса по Москве. Фотозоны, гирлянды, композиции из шаров.',
              url: 'https://marketshow.ru',
              telephone: phone.replace(/\s/g, ''),
              address: {
                '@type': 'PostalAddress',
                addressLocality: address,
                addressCountry: 'RU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '55.7558',
                longitude: '37.6173',
              },
              openingHours: 'Mo-Su 09:00-21:00',
              priceRange: '₽₽',
              image: 'https://marketshow.ru/og-image.jpg',
              hasMap: 'https://yandex.ru/maps/-/CDxZzF',
              areaServed: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: '55.7558',
                  longitude: '37.6173',
                },
                geoRadius: '50000',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Услуги по оформлению праздников',
                itemListElement: [
                  {
                    '@type': 'OfferCatalog',
                    name: 'Воздушные шары',
                    itemListElement: [
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Product',
                          name: 'Гирлянды из шаров',
                          description: 'Гирлянды из воздушных шаров для оформления праздников',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Product',
                          name: 'Фотозоны из шаров',
                          description: 'Фотозоны из воздушных шаров для мероприятий',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Product',
                          name: 'Композиции из шаров',
                          description: 'Композиции из воздушных шаров для праздников',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }),
      }}
    />
  );
}
