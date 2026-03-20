import { NextResponse } from 'next/server';

// Supabase REST API configuration
const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

const defaultHashtags = [
  'свадьба', 'детскийпраздник', 'фотозона', 'корпоратив',
  'деньрождения', 'юбилей', 'мальчик', 'девочка',
  'розовые', 'синие', 'золотые', 'серебряные',
  'гирлянда', 'композиция', 'фигура', 'цифра',
  'букет', 'хром', 'перламутр'
];

const defaultPosts = [
  {
    id: 'post1',
    title: 'Свадебная композиция "Нежность"',
    description: 'Изысканная композиция из белых и розовых шаров для свадебного торжества.',
    price: 8500,
    image_url: '/images/balloons-1.jpg',
    hashtags: ['свадьба', 'розовые', 'композиция'],
  },
  {
    id: 'post2',
    title: 'Детский праздник "Принцесса"',
    description: 'Нежная композиция в розовых тонах для маленькой принцессы.',
    price: 5500,
    image_url: '/images/balloons-2.jpg',
    hashtags: ['детскийпраздник', 'девочка', 'розовые'],
  },
  {
    id: 'post3',
    title: 'Фотозона "Праздник"',
    description: 'Большая фотозона из воздушных шаров для мероприятий.',
    price: 15000,
    image_url: '/images/balloons-3.jpg',
    hashtags: ['фотозона', 'гирлянда', 'корпоратив'],
  },
  {
    id: 'post4',
    title: 'Гирлянда "Радуга"',
    description: 'Яркая гирлянда из разноцветных шаров.',
    price: 3500,
    image_url: '/images/balloons-4.jpg',
    hashtags: ['детскийпраздник', 'гирлянда'],
  },
  {
    id: 'post5',
    title: 'Золотой юбилей',
    description: 'Элегантная композиция для юбилея в золотых тонах.',
    price: 7500,
    image_url: '/images/balloons-5.jpg',
    hashtags: ['юбилей', 'золотые', 'цифра'],
  },
  {
    id: 'post6',
    title: 'Корпоратив "Стиль"',
    description: 'Оформление корпоративного мероприятия в фирменных цветах.',
    price: 25000,
    image_url: '/images/balloons-6.jpg',
    hashtags: ['корпоратив', 'фотозона', 'гирлянда'],
  },
];

// SQL for creating tables - user needs to run this in Supabase Dashboard
const createTablesSQL = `
-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT 'Товар',
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  likes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Post-Hashtag relation table
CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id TEXT REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, session_id)
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT DEFAULT 'Маркет Шоу',
  phone TEXT DEFAULT '+7 985 800 97 19',
  telegram TEXT DEFAULT 'https://t.me/TanyaShow',
  max TEXT,
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  address TEXT DEFAULT 'Москва',
  working_hours TEXT DEFAULT 'Пн-Вс: 9:00 - 21:00',
  about_text TEXT,
  delivery_text TEXT,
  admin_password TEXT DEFAULT 'admin123'
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'new',
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  post_id TEXT REFERENCES posts(id),
  quantity INTEGER DEFAULT 1,
  price INTEGER NOT NULL
);

-- Callback requests table
CREATE TABLE IF NOT EXISTS callback_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT NOT NULL,
  source TEXT,
  message TEXT,
  type TEXT DEFAULT 'callback',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
CREATE POLICY "Allow all on posts" ON posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on hashtags" ON hashtags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on post_hashtags" ON post_hashtags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on likes" ON likes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on callback_requests" ON callback_requests FOR ALL USING (true) WITH CHECK (true);
`;

export async function GET() {
  try {
    console.log('🚀 Starting Supabase REST API seed...');

    // Check if posts table exists
    const checkPosts = await fetch(`${SUPABASE_URL}/rest/v1/posts?limit=1`, { headers });
    
    if (checkPosts.status === 404) {
      return NextResponse.json({
        success: false,
        message: 'Tables not found! Please run this SQL in Supabase Dashboard:',
        sql: createTablesSQL,
        instructions: [
          '1. Go to: https://supabase.com/dashboard/project/qytsilajkulywydolzpj/sql',
          '2. Click "New Query"',
          '3. Paste the SQL below',
          '4. Click "Run"',
          '5. Then call this API again'
        ]
      });
    }

    // Insert hashtags
    console.log('🏷️ Inserting hashtags...');
    const hashtagsData = defaultHashtags.map(name => ({ name }));
    
    const hashtagsResponse = await fetch(`${SUPABASE_URL}/rest/v1/hashtags?on_conflict=name`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(hashtagsData)
    });

    let insertedHashtags: { id: string; name: string }[] = [];
    if (hashtagsResponse.ok) {
      insertedHashtags = await hashtagsResponse.json();
      console.log(`✅ Inserted ${insertedHashtags.length} hashtags`);
    } else {
      const error = await hashtagsResponse.text();
      console.error('Hashtags error:', error);
    }

    // Insert posts
    console.log('📝 Inserting posts...');
    const postsData = defaultPosts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      price: post.price,
      image_url: post.image_url,
      is_active: true
    }));

    const postsResponse = await fetch(`${SUPABASE_URL}/rest/v1/posts?on_conflict=id`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(postsData)
    });

    let insertedPosts: { id: string }[] = [];
    if (postsResponse.ok) {
      insertedPosts = await postsResponse.json();
      console.log(`✅ Inserted ${insertedPosts.length} posts`);
    } else {
      const error = await postsResponse.text();
      console.error('Posts error:', error);
    }

    // Link posts to hashtags
    console.log('🔗 Linking posts to hashtags...');
    const postHashtagsData: { post_id: string; hashtag_id: string }[] = [];
    
    for (const post of defaultPosts) {
      for (const tagName of post.hashtags) {
        const hashtag = insertedHashtags.find(h => h.name === tagName);
        if (hashtag) {
          postHashtagsData.push({
            post_id: post.id,
            hashtag_id: hashtag.id
          });
        }
      }
    }

    if (postHashtagsData.length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/post_hashtags`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postHashtagsData)
      });
      console.log(`✅ Created ${postHashtagsData.length} post-hashtag links`);
    }

    // Insert site settings
    console.log('⚙️ Inserting site settings...');
    await fetch(`${SUPABASE_URL}/rest/v1/site_settings?on_conflict=id`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({
        id: 'default',
        company_name: 'Маркет Шоу',
        phone: '+7 985 800 97 19',
        telegram: 'https://t.me/TanyaShow',
        address: 'Москва',
        working_hours: 'Пн-Вс: 9:00 - 21:00',
        admin_password: 'admin123'
      })
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      hashtags: insertedHashtags.length,
      posts: insertedPosts.length,
      links: postHashtagsData.length
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
