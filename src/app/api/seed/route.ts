import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST seed database with sample data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    
    // Create or update settings
    let siteSettings = await db.siteSettings.findFirst();
    if (!siteSettings) {
      siteSettings = await db.siteSettings.create({
        data: {
          companyName: 'Маркет Шоу',
          phone: '+7 985 800 97 19',
          telegram: 'https://t.me/marketshow',
          max: 'https://max.ru/chat/marketshow',
          address: 'Москва, Россия',
          workingHours: 'Пн-Вс: 9:00 - 21:00',
          aboutText: 'Маркет Шоу — премиум оформление праздников воздушными шарами.',
          deliveryText: '🚚 Доставка по Москве — БЕСПЛАТНО от 3000₽',
          adminPassword: 'admin123',
        },
      });
    }
    
    // Only allow with correct password
    if (password !== siteSettings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Create hashtags
    const hashtagNames = [
      'свадьба', 'деньрождения', 'детскийпраздник', 'девочке', 'мальчику', 
      'корпоратив', 'фотозона', 'годик', 'композиция'
    ];
    
    for (const name of hashtagNames) {
      await db.hashtag.upsert({
        where: { name },
        create: { name, clickCount: Math.floor(Math.random() * 30) + 5 },
        update: {},
      });
    }
    
    // Check if posts already exist
    const existingPosts = await db.post.count();
    if (existingPosts > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database already has posts. Seeding skipped.',
        postsCount: existingPosts
      });
    }
    
    // Create sample posts with placeholder images
    const samplePosts = [
      {
        title: 'Нежная композиция "Розовые мечты"',
        imageUrl: '/images/balloons-1.jpg',
        description: 'Идеальный подарок для любимой девушки или дочери. В комплекте 25 шаров разных оттенков розового с конфетти.',
        price: 450000,
        hashtags: ['девочке', 'композиция'],
      },
      {
        title: 'Набор "Супергерой" для мальчика',
        imageUrl: '/images/balloons-2.jpg',
        description: 'Яркий набор для настоящего героя! Синие, красные и золотые шары с принтами супергероев.',
        price: 350000,
        hashtags: ['мальчику', 'детскийпраздник'],
      },
      {
        title: 'Свадебная арка "Белое золото"',
        imageUrl: '/images/balloons-3.jpg',
        description: 'Роскошная свадебная арка для вашей церемонии. Белые и золотые шары премиум качества.',
        price: 2500000,
        hashtags: ['свадьба', 'фотозона'],
      },
      {
        title: 'Детский набор "Единорог"',
        imageUrl: '/images/balloons-4.jpg',
        description: 'Волшебные шары для маленькой принцессы! Радужные шары и фигурка единорога.',
        price: 320000,
        hashtags: ['девочке', 'детскийпраздник'],
      },
      {
        title: 'Цифра "1" на первый день рождения',
        imageUrl: '/images/balloons-5.jpg',
        description: 'Первый юбилей малыша! Большая фольгированная цифра 1 с хвостиком из шаров.',
        price: 400000,
        hashtags: ['годик', 'детскийпраздник'],
      },
      {
        title: 'Корпоративный набор "Элегантность"',
        imageUrl: '/images/balloons-6.jpg',
        description: 'Стильное оформление для офисного праздника или корпоратива. Чёрный и золотой.',
        price: 550000,
        hashtags: ['корпоратив', 'фотозона'],
      },
    ];
    
    for (const postData of samplePosts) {
      const hashtagIds = [];
      for (const tagName of postData.hashtags) {
        const hashtag = await db.hashtag.findFirst({
          where: { name: tagName },
        });
        if (hashtag) {
          hashtagIds.push(hashtag.id);
        }
      }
      
      await db.post.create({
        data: {
          title: postData.title,
          imageUrl: postData.imageUrl,
          description: postData.description,
          price: postData.price,
          likes: Math.floor(Math.random() * 50) + 5,
          hashtags: {
            create: hashtagIds.map((id) => ({ hashtagId: id })),
          },
        },
      });
    }
    
    const postsCount = await db.post.count();
    const hashtagsCount = await db.hashtag.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      postsCount,
      hashtagsCount
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 });
  }
}
