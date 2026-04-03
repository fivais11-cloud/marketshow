import { Metadata } from 'next';
import { ProductClient } from './ProductClient';

// Делаем страницу динамической (не генерируем статику при билде)
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Кэшируем на 1 час

interface Props {
  params: Promise<{ id: string }>;
}

// Базовые metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Базовые metadata без запроса к БД (для скорости билда)
  return {
    title: 'Товар — Маркет Шоу',
    description: 'Воздушные шары премиум-класса с доставкой по Москве. Закажите на сайте или по телефону +7 985 800 97 19',
    alternates: {
      canonical: `https://marketshow.ru/product/${id}`,
    },
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductClient />;
}
