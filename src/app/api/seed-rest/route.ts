import { NextRequest, NextResponse } from 'next/server';

// POST seed database using Supabase REST API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supabaseKey } = body;
    
    // Require Supabase service_role key
    if (!supabaseKey || !supabaseKey.startsWith('eyJ')) {
      return NextResponse.json({ 
        error: 'Missing or invalid supabaseKey. Get it from Supabase Dashboard > Settings > API > service_role secret' 
      }, { status: 400 });
    }

    const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
    
    async function supabaseRequest(table: string, method: string, data?: any, query?: string) {
      const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`;
      const response = await fetch(url, {
        method,
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,respect-empty-body'
        },
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Supabase API error: ${response.status} - ${error}`);
      }
      
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    const posts = [
      {
        id: 'pt001',
        title: 'Нежная композиция "Розовые мечты"',
        image_url: '/images/balloons-1.jpg',
        description: 'Идеальный подарок для любимой девушки или дочери. В комплекте 25 шаров разных оттенков розового с конфетти.',
        price: 450000,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true,
        hashtags: ['девочке', 'композиция', 'любовь']
      },
      {
        id: 'pt002',
        title: 'Набор "Супергерой" для мальчика',
        image_url: '/images/balloons-2.jpg',
        description: 'Яркий набор для настоящего героя! Синие, красные и золотые шары с принтами супергероев.',
        price: 350000,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true,
        hashtags: ['мальчику', 'детскийпраздник', 'деньрождения']
      },
      {
        id: 'pt003',
        title: 'Свадебная арка "Белое золото"',
        image_url: '/images/balloons-3.jpg',
        description: 'Роскошная свадебная арка для вашей церемонии. Белые и золотые шары премиум качества.',
        price: 2500000,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true,
        hashtags: ['свадьба', 'фотозона', 'любовь']
      },
      {
        id: 'pt004',
        title: 'Детский набор "Единорог"',
        image_url: '/images/balloons-4.jpg',
        description: 'Волшебные шары для маленькой принцессы! Радужные шары и фигурка единорога.',
        price: 320000,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true,
        hashtags: ['девочке', 'детскийпраздник', 'деньрождения']
      },
      {
        id: 'pt005',
        title: 'Цифра "1" на первый день рождения',
        image_url: '/images/balloons-5.jpg',
        description: 'Первый юбилей малыша! Большая фольгированная цифра 1 с хвостиком из шаров.',
        price: 400000,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true,
        hashtags: ['годик', 'детскийпраздник', 'мальчику']
      },
      {
        id: 'pt006',
        title: 'Корпоративный набор "Элегантность"',
        image_url: '/images/balloons-6.jpg',
        description: 'Стильное оформление для офисного праздника или корпоратива. Чёрный и золотой.',
        price: 550000,
        likes: Math.floor(Math.random() * 50) + 5,
        is_active: true,
        hashtags: ['корпоратив', 'фотозона', 'юбилей']
      }
    ];

    const hashtags = [
      'свадьба', 'деньрождения', 'детскийпраздник', 'девочке', 'мальчику',
      'корпоратив', 'фотозона', 'годик', 'композиция', 'любовь',
      'деньматери', '8марта', '23февраля', 'новыйгод', 'выпускной',
      'девичник', 'деньотца', 'юбилей'
    ];

    // 1. Insert site settings (upsert)
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
      // If insert fails, try update
      return supabaseRequest('site_settings', 'PATCH', {
        phone: '+7 985 800 97 19',
        telegram: 'https://t.me/TanyaShow'
      }, 'id=eq.cmdefault');
    });

    // 2. Insert hashtags (ignore duplicates)
    console.log('📝 Inserting 18 hashtags...');
    for (const tag of hashtags) {
      await supabaseRequest('hashtags', 'POST', {
        name: tag,
        click_count: Math.floor(Math.random() * 30) + 5
      }).catch(() => {});
    }

    // 3. Insert posts (ignore duplicates)
    console.log('📝 Inserting 6 products...');
    for (const post of posts) {
      const { hashtags: postHashtags, ...postData } = post;
      await supabaseRequest('posts', 'POST', postData).catch(() => {});
      
      // Link hashtags to post
      for (const tagName of postHashtags) {
        // Get hashtag ID
        const hashtagResult = await supabaseRequest('hashtags', 'GET', null, `name=eq.${tagName}&select=id`);
        if (hashtagResult && hashtagResult[0]) {
          await supabaseRequest('post_hashtags', 'POST', {
            post_id: post.id,
            hashtag_id: hashtagResult[0].id
          }).catch(() => {});
        }
      }
    }

    // Get counts
    const postsResult = await supabaseRequest('posts', 'GET', null, 'select=count');
    const hashtagsResult = await supabaseRequest('hashtags', 'GET', null, 'select=count');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully via REST API',
      postsCount: postsResult?.[0]?.count || posts.length,
      hashtagsCount: hashtagsResult?.[0]?.count || hashtags.length
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ 
      error: 'Failed to seed database', 
      details: String(error) 
    }, { status: 500 });
  }
}
