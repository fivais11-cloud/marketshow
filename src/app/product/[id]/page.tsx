import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductClient } from './ProductClient';

interface Props {
  params: Promise<{ id: string }>;
}

// Генерация metadata для SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        seoTitle: true,
        seoDescription: true,
        hashtags: {
          select: {
            hashtag: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!post) {
      return {
        title: 'Товар не найден',
      };
    }

    const title = post.seoTitle || `${post.title} — Воздушные шары в Москве | Маркет Шоу`;
    const description = post.seoDescription || 
      `${post.title}. ${post.description} Цена: ${(post.price / 100).toLocaleString('ru-RU')}₽. Доставка по Москве бесплатно от 3000₽. Заказать по телефону +7 985 800 97 19`;

    return {
      title,
      description,
      keywords: [
        post.title.toLowerCase(),
        'воздушные шары',
        'доставка шаров москва',
        ...post.hashtags.map(h => h.hashtag.name),
      ],
      openGraph: {
        title,
        description,
        type: 'product',
        url: `https://marketshow.ru/product/${id}`,
        images: [
          {
            url: post.imageUrl,
            width: 800,
            height: 800,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [post.imageUrl],
      },
      alternates: {
        canonical: `https://marketshow.ru/product/${id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Товар — Маркет Шоу',
    };
  }
}

// Генерация статических путей для популярных товаров
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { isActive: true },
    select: { id: true },
    take: 50,
  });

  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  
  let post;
  try {
    post = await prisma.post.findUnique({
      where: { id },
      include: {
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });
  } catch (error) {
    notFound();
  }

  if (!post || !post.isActive) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ru-RU');
  };

  return (
    <>
      <ProductClient />
      
      {/* Schema.org Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: post.title,
            description: post.description,
            image: post.imageUrl,
            url: `https://marketshow.ru/product/${id}`,
            brand: {
              '@type': 'Brand',
              name: 'Маркет Шоу',
            },
            offers: {
              '@type': 'Offer',
              price: post.price / 100,
              priceCurrency: 'RUB',
              availability: 'https://schema.org/InStock',
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              seller: {
                '@type': 'Organization',
                name: 'Маркет Шоу',
              },
              areaServed: {
                '@type': 'City',
                name: 'Москва',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '50',
              bestRating: '5',
              worstRating: '1',
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
                  name: post.title,
                  item: `https://marketshow.ru/product/${id}`,
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
