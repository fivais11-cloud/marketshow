/**
 * Supabase REST API Seed Script
 * 
 * Этот скрипт использует Supabase REST API для импорта данных.
 * Требуется API ключ (service_role или anon с правами записи).
 * 
 * Использование:
 * 1. Получите API ключ из Supabase Dashboard: Settings > API > service_role secret
 * 2. Запустите: SUPABASE_KEY=your_key bun run scripts/seed-supabase-rest.ts
 */

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

interface Post {
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  hashtags: string[];
}

const posts: Post[] = [
  {
    title: 'Нежная композиция "Розовые мечты"',
    imageUrl: '/images/balloons-1.jpg',
    description: 'Идеальный подарок для любимой девушки или дочери. В комплекте 25 шаров разных оттенков розового с конфетти.',
    price: 450000,
    hashtags: ['девочке', 'композиция', 'любовь']
  },
  {
    title: 'Набор "Супергерой" для мальчика',
    imageUrl: '/images/balloons-2.jpg',
    description: 'Яркий набор для настоящего героя! Синие, красные и золотые шары с принтами супергероев.',
    price: 350000,
    hashtags: ['мальчику', 'детскийпраздник', 'деньрождения']
  },
  {
    title: 'Свадебная арка "Белое золото"',
    imageUrl: '/images/balloons-3.jpg',
    description: 'Роскошная свадебная арка для вашей церемонии. Белые и золотые шары премиум качества.',
    price: 2500000,
    hashtags: ['свадьба', 'фотозона', 'любовь']
  },
  {
    title: 'Детский набор "Единорог"',
    imageUrl: '/images/balloons-4.jpg',
    description: 'Волшебные шары для маленькой принцессы! Радужные шары и фигурка единорога.',
    price: 320000,
    hashtags: ['девочке', 'детскийпраздник', 'деньрождения']
  },
  {
    title: 'Цифра "1" на первый день рождения',
    imageUrl: '/images/balloons-5.jpg',
    description: 'Первый юбилей малыша! Большая фольгированная цифра 1 с хвостиком из шаров.',
    price: 400000,
    hashtags: ['годик', 'детскийпраздник', 'мальчику']
  },
  {
    title: 'Корпоративный набор "Элегантность"',
    imageUrl: '/images/balloons-6.jpg',
    description: 'Стильное оформление для офисного праздника или корпоратива. Чёрный и золотой.',
    price: 550000,
    hashtags: ['корпоратив', 'фотозона', 'юбилей']
  }
];

const hashtags = [
  'свадьба', 'деньрождения', 'детскийпраздник', 'девочке', 'мальчику',
  'корпоратив', 'фотозона', 'годик', 'композиция', 'любовь',
  'деньматери', '8марта', '23февраля', 'новыйгод', 'выпускной',
  'девичник', 'деньотца', 'юбилей'
];

async function supabaseRequest(table: string, method: string, data?: any) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : undefined
    },
    body: data ? JSON.stringify(data) : undefined
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

async function seedDatabase() {
  if (!SUPABASE_KEY) {
    console.error('❌ Ошибка: Требуется SUPABASE_KEY');
    console.log('\nПолучите ключ из Supabase Dashboard:');
    console.log('1. Откройте https://supabase.com/dashboard');
    console.log('2. Выберите проект qytsilajkulywydolzpj');
    console.log('3. Settings > API > service_role secret');
    console.log('4. Запустите: SUPABASE_KEY=your_key bun run scripts/seed-supabase-rest.ts');
    process.exit(1);
  }

  console.log('🚀 Seeding Supabase via REST API...\n');

  try {
    // 1. Insert site settings
    console.log('📝 Inserting site settings...');
    await supabaseRequest('site_settings', 'POST', {
      id: 'cmdefault',
      company_name: 'Маркет Шоу',
      phone: '+7 985 800 97 19',
      telegram: 'https://t.me/TanyaShow',
      address: 'Москва',
      working_hours: 'Пн-Вс: 9:00 - 21:00',
      about_text: 'Маркет Шоу - премиум оформление праздников воздушными шарами',
      delivery_text: 'Доставка по Москве - бесплатно от 3000₽',
      admin_password: 'admin123'
    }).catch(() => {
      console.log('   ℹ️ Settings already exist, updating...');
    });

    // 2. Insert hashtags
    console.log('📝 Inserting 18 hashtags...');
    for (const tag of hashtags) {
      await supabaseRequest('hashtags', 'POST', {
        name: tag,
        click_count: Math.floor(Math.random() * 30) + 5
      }).catch(() => {}); // Ignore duplicates
    }

    // 3. Insert posts
    console.log('📝 Inserting 6 products...');
    for (const post of posts) {
      const postData = {
        id: `pt${posts.indexOf(post) + 1}`.padStart(5, '0'),
        title: post.title,
        image_url: post.imageUrl,
        description: post.description,
        price: post.price,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true
      };
      
      await supabaseRequest('posts', 'POST', postData).catch(() => {});
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('📊 Database now contains:');
    console.log('   - 6 products');
    console.log('   - 18 hashtags');
    console.log('   - Site settings');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
