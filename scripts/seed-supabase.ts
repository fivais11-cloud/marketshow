import { Pool } from 'pg';
import dns from 'dns';

// Force IPv4 for DNS resolution
dns.setDefaultResultOrder('ipv4first');

// Supabase connection
const DATABASE_URL = 'postgresql://postgres:MarketShow2024@db.qytsilajkulywydolzpj.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createTables() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      -- Site Settings
      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY DEFAULT 'cmdefault',
        company_name TEXT DEFAULT 'Маркет Шоу',
        phone TEXT DEFAULT '+7 985 800 97 19',
        telegram TEXT DEFAULT 'https://t.me/TanyaShow',
        max TEXT DEFAULT 'https://max.ru/chat/marketshow',
        telegram_bot_token TEXT,
        telegram_chat_id TEXT,
        address TEXT DEFAULT 'Москва',
        working_hours TEXT DEFAULT 'Пн-Вс: 9:00 - 21:00',
        about_text TEXT DEFAULT 'Маркет Шоу - премиум оформление праздников воздушными шарами',
        delivery_text TEXT DEFAULT 'Доставка по Москве - бесплатно от 3000₽',
        admin_password TEXT DEFAULT 'admin123'
      );
    `);

    await client.query(`
      -- Hashtags
      CREATE TABLE IF NOT EXISTS hashtags (
        id TEXT PRIMARY KEY DEFAULT 'ht' || substr(md5(random()::text), 1, 20),
        name TEXT UNIQUE NOT NULL,
        click_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      -- Posts
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY DEFAULT 'pt' || substr(md5(random()::text), 1, 20),
        title TEXT DEFAULT 'Товар',
        image_url TEXT NOT NULL,
        description TEXT,
        price INTEGER DEFAULT 0,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        likes INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      -- Post Hashtags (many-to-many)
      CREATE TABLE IF NOT EXISTS post_hashtags (
        post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
        hashtag_id TEXT REFERENCES hashtags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, hashtag_id)
      );
    `);

    await client.query(`
      -- Likes
      CREATE TABLE IF NOT EXISTS likes (
        id TEXT PRIMARY KEY DEFAULT 'lk' || substr(md5(random()::text), 1, 20),
        post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
        session_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (post_id, session_id)
      );
    `);

    await client.query(`
      -- Orders
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY DEFAULT 'ord' || substr(md5(random()::text), 1, 20),
        customer_name TEXT,
        phone TEXT NOT NULL,
        email TEXT,
        total_price INTEGER,
        status TEXT DEFAULT 'new',
        source TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      -- Order Items
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY DEFAULT 'oi' || substr(md5(random()::text), 1, 20),
        order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
        post_id TEXT REFERENCES posts(id),
        quantity INTEGER DEFAULT 1,
        price INTEGER
      );
    `);

    await client.query(`
      -- Callback Requests
      CREATE TABLE IF NOT EXISTS callback_requests (
        id TEXT PRIMARY KEY DEFAULT 'cb' || substr(md5(random()::text), 1, 20),
        name TEXT,
        phone TEXT NOT NULL,
        source TEXT,
        message TEXT,
        type TEXT DEFAULT 'callback',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables created successfully');
  } finally {
    client.release();
  }
}

async function seedData() {
  const client = await pool.connect();
  try {
    // 1. Insert Site Settings
    const settingsExists = await client.query(`SELECT id FROM site_settings WHERE id = 'cmdefault'`);
    if (settingsExists.rows.length === 0) {
      await client.query(`
        INSERT INTO site_settings (id, company_name, phone, telegram, address, working_hours, about_text, delivery_text, admin_password)
        VALUES ('cmdefault', 'Маркет Шоу', '+7 985 800 97 19', 'https://t.me/TanyaShow', 'Москва', 'Пн-Вс: 9:00 - 21:00', 'Маркет Шоу - премиум оформление праздников воздушными шарами', 'Доставка по Москве - бесплатно от 3000₽', 'admin123')
      `);
      console.log('✅ Site settings inserted');
    } else {
      console.log('ℹ️ Site settings already exist, updating...');
      await client.query(`
        UPDATE site_settings SET 
          phone = '+7 985 800 97 19',
          telegram = 'https://t.me/TanyaShow'
        WHERE id = 'cmdefault'
      `);
    }

    // 2. Insert 18 Hashtags
    const hashtags = [
      'свадьба', 'деньрождения', 'детскийпраздник', 'девочке', 'мальчику',
      'корпоратив', 'фотозона', 'годик', 'композиция', 'любовь',
      'деньматери', '8марта', '23февраля', 'новыйгод', 'выпускной',
      'девичник', 'деньотца', 'юбилей'
    ];

    for (const tag of hashtags) {
      await client.query(`
        INSERT INTO hashtags (name, click_count) 
        VALUES ($1, $2) 
        ON CONFLICT (name) DO NOTHING
      `, [tag, Math.floor(Math.random() * 30) + 5]);
    }
    console.log('✅ 18 hashtags inserted');

    // 3. Insert 6 Products
    const postsExist = await client.query(`SELECT COUNT(*) as count FROM posts`);
    if (parseInt(postsExist.rows[0].count) === 0) {
      const posts = [
        {
          id: 'pt001',
          title: 'Нежная композиция "Розовые мечты"',
          imageUrl: '/images/balloons-1.jpg',
          description: 'Идеальный подарок для любимой девушки или дочери. В комплекте 25 шаров разных оттенков розового с конфетти.',
          price: 4500,
          hashtags: ['девочке', 'композиция', 'любовь']
        },
        {
          id: 'pt002',
          title: 'Набор "Супергерой" для мальчика',
          imageUrl: '/images/balloons-2.jpg',
          description: 'Яркий набор для настоящего героя! Синие, красные и золотые шары с принтами супергероев.',
          price: 3500,
          hashtags: ['мальчику', 'детскийпраздник', 'деньрождения']
        },
        {
          id: 'pt003',
          title: 'Свадебная арка "Белое золото"',
          imageUrl: '/images/balloons-3.jpg',
          description: 'Роскошная свадебная арка для вашей церемонии. Белые и золотые шары премиум качества.',
          price: 25000,
          hashtags: ['свадьба', 'фотозона', 'любовь']
        },
        {
          id: 'pt004',
          title: 'Детский набор "Единорог"',
          imageUrl: '/images/balloons-4.jpg',
          description: 'Волшебные шары для маленькой принцессы! Радужные шары и фигурка единорога.',
          price: 3200,
          hashtags: ['девочке', 'детскийпраздник', 'деньрождения']
        },
        {
          id: 'pt005',
          title: 'Цифра "1" на первый день рождения',
          imageUrl: '/images/balloons-5.jpg',
          description: 'Первый юбилей малыша! Большая фольгированная цифра 1 с хвостиком из шаров.',
          price: 4000,
          hashtags: ['годик', 'детскийпраздник', 'мальчику']
        },
        {
          id: 'pt006',
          title: 'Корпоративный набор "Элегантность"',
          imageUrl: '/images/balloons-6.jpg',
          description: 'Стильное оформление для офисного праздника или корпоратива. Чёрный и золотой.',
          price: 5500,
          hashtags: ['корпоратив', 'фотозона', 'юбилей']
        }
      ];

      for (const post of posts) {
        await client.query(`
          INSERT INTO posts (id, title, image_url, description, price, likes, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, true)
        `, [post.id, post.title, post.imageUrl, post.description, post.price * 100, Math.floor(Math.random() * 50) + 5]);

        // Link hashtags
        for (const tagName of post.hashtags) {
          const hashtagResult = await client.query(`SELECT id FROM hashtags WHERE name = $1`, [tagName]);
          if (hashtagResult.rows.length > 0) {
            await client.query(`
              INSERT INTO post_hashtags (post_id, hashtag_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [post.id, hashtagResult.rows[0].id]);
          }
        }
      }
      console.log('✅ 6 products inserted with hashtags');
    } else {
      console.log('ℹ️ Products already exist, skipping...');
    }

    // Verify
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM posts) as posts,
        (SELECT COUNT(*) FROM hashtags) as hashtags,
        (SELECT COUNT(*) FROM post_hashtags) as post_hashtags,
        (SELECT COUNT(*) FROM site_settings) as settings
    `);
    
    console.log('\n📊 Database Stats:');
    console.log(`   Posts: ${stats.rows[0].posts}`);
    console.log(`   Hashtags: ${stats.rows[0].hashtags}`);
    console.log(`   Post-Hashtag links: ${stats.rows[0].post_hashtags}`);
    console.log(`   Settings: ${stats.rows[0].settings}`);

    return true;
  } finally {
    client.release();
  }
}

async function main() {
  console.log('🚀 Starting Supabase seed...\n');
  console.log('📡 Connecting to: db.qytsilajkulywydolzpj.supabase.co\n');

  try {
    await createTables();
    await seedData();
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
