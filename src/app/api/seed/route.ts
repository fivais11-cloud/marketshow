import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultHashtags = [
  'свадьба', 'детскийпраздник', 'фотозона', 'корпоратив',
  'деньрождения', 'юбилей', 'мальчик', 'девочка',
  'розовые', 'синие', 'золотые', 'серебряные',
  'гирлянда', 'композиция', 'фигура', 'цифра',
  'букет', 'хром', 'перламутр'
];

const defaultPosts = [
  {
    title: 'Свадебная композиция "Нежность"',
    description: 'Изысканная композиция из белых и розовых шаров для свадебного торжества. Включает гелиевые шары премиум-класса с обработкой Hi-Float.',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    hashtags: ['свадьба', 'розовые', 'композиция'],
  },
  {
    title: 'Детский праздник "Принцесса"',
    description: 'Нежная композиция в розовых тонах для маленькой принцессы. Включает цифру, гирлянду и отдельные шары.',
    price: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=800',
    hashtags: ['детскийпраздник', 'девочка', 'розовые', 'композиция', 'цифра'],
  },
  {
    title: 'Фотозона "Праздник"',
    description: 'Большая фотозона из воздушных шаров для мероприятий. Размер 3x2 метра. Идеально для фотосессий и праздников.',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    hashtags: ['фотозона', 'гирлянда', 'корпоратив'],
  },
  {
    title: 'Гирлянда "Радуга"',
    description: 'Яркая гирлянда из разноцветных шаров. Длина 3 метра. Отличный выбор для детского праздника.',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
    hashtags: ['детскийпраздник', 'гирлянда', 'деньрождения'],
  },
  {
    title: 'Золотой юбилей',
    description: 'Элегантная композиция для юбилея в золотых тонах. Включает цифру 50 и декоративные элементы.',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800',
    hashtags: ['юбилей', 'золотые', 'цифра', 'композиция'],
  },
  {
    title: 'Корпоратив "Стиль"',
    description: 'Оформление корпоративного мероприятия в фирменных цветах. Гирлянды, стойки и отдельные шары.',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    hashtags: ['корпоратив', 'фотозона', 'гирлянда'],
  },
];

export async function GET() {
  try {
    // Создаём хэштеги
    const hashtagRecords = await Promise.all(
      defaultHashtags.map((name) =>
        prisma.hashtag.upsert({
          where: { name },
          create: { name },
          update: {},
        })
      )
    );

    console.log(`✅ Created ${hashtagRecords.length} hashtags`);

    // Создаём товары
    for (const post of defaultPosts) {
      const existingPost = await prisma.post.findFirst({
        where: { title: post.title },
      });

      if (!existingPost) {
        const newPost = await prisma.post.create({
          data: {
            title: post.title,
            description: post.description,
            price: post.price,
            imageUrl: post.imageUrl,
            isActive: true,
          },
        });

        // Связываем с хэштегами
        for (const tagName of post.hashtags) {
          const tag = hashtagRecords.find((t) => t.name === tagName);
          if (tag) {
            await prisma.postHashtag.create({
              data: {
                postId: newPost.id,
                hashtagId: tag.id,
              },
            });
          }
        }

        console.log(`✅ Created post: ${post.title}`);
      }
    }

    // Создаём настройки сайта
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        companyName: 'Маркет Шоу',
        phone: '+7 985 800 97 19',
        telegram: 'https://t.me/TanyaShow',
        address: 'Москва',
        workingHours: 'Пн-Вс: 9:00 - 21:00',
        aboutText: 'Маркет Шоу - премиум оформление праздников воздушными шарами',
        deliveryText: 'Доставка по Москве - бесплатно от 3000₽',
        adminPassword: 'admin123',
      },
      update: {
        phone: '+7 985 800 97 19',
        telegram: 'https://t.me/TanyaShow',
      },
    });

    console.log(`✅ Created settings`);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      hashtags: hashtagRecords.length,
      posts: defaultPosts.length,
      settings: settings.companyName,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
