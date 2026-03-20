// Supabase REST API client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qytsilajkulywydolzpj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// Types
export interface Post {
  id: string;
  title: string;
  image_url: string;
  description: string;
  price: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  likes: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Hashtag {
  id: string;
  name: string;
  click_count: number;
  created_at: string;
}

export interface PostHashtag {
  post_id: string;
  hashtag_id: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  phone: string;
  telegram?: string;
  max?: string;
  address?: string;
  working_hours?: string;
  admin_password: string;
}

// API functions
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&is_active=eq.true&order=created_at.desc`, {
    headers,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    console.error('Failed to fetch posts:', await response.text());
    return [];
  }
  
  return response.json();
}

export async function getPostById(id: string): Promise<Post | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}&select=*`, {
    headers,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    console.error('Failed to fetch post:', await response.text());
    return null;
  }
  
  const posts = await response.json();
  return posts[0] || null;
}

export async function getHashtags(): Promise<Hashtag[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/hashtags?select=*&order=click_count.desc`, {
    headers,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    console.error('Failed to fetch hashtags:', await response.text());
    return [];
  }
  
  return response.json();
}

export async function getPostHashtags(postId: string): Promise<Hashtag[]> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/post_hashtags?post_id=eq.${postId}&select=hashtag_id,hashtags(id,name,click_count,created_at)`,
    {
      headers,
      cache: 'no-store',
    }
  );
  
  if (!response.ok) {
    console.error('Failed to fetch post hashtags:', await response.text());
    return [];
  }
  
  const data = await response.json();
  return data.map((item: { hashtags: Hashtag }) => item.hashtags);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?id=eq.default&select=*`, {
    headers,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    console.error('Failed to fetch settings:', await response.text());
    return null;
  }
  
  const settings = await response.json();
  return settings[0] || null;
}

export async function incrementHashtagClick(hashtagId: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_hashtag_click`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ hashtag_id: hashtagId }),
  });
}

export async function likePost(postId: string, sessionId: string): Promise<boolean> {
  // Check if already liked
  const checkResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}&session_id=eq.${sessionId}`,
    { headers }
  );
  
  const existing = await checkResponse.json();
  
  if (existing.length > 0) {
    // Already liked, remove like
    await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}&session_id=eq.${sessionId}`, {
      method: 'DELETE',
      headers,
    });
    
    // Decrement likes count
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/decrement_post_likes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ post_id: postId }),
    });
    
    return false;
  } else {
    // Add like
    await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ post_id: postId, session_id: sessionId }),
    });
    
    // Increment likes count
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_post_likes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ post_id: postId }),
    });
    
    return true;
  }
}

export async function createOrder(data: {
  customerName?: string;
  phone: string;
  email?: string;
  totalPrice: number;
  source?: string;
  items: { postId: string; quantity: number; price: number }[];
}): Promise<string | null> {
  // Create order
  const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify({
      customer_name: data.customerName,
      phone: data.phone,
      email: data.email,
      total_price: data.totalPrice,
      source: data.source,
    }),
  });
  
  if (!orderResponse.ok) {
    console.error('Failed to create order:', await orderResponse.text());
    return null;
  }
  
  const orders = await orderResponse.json();
  const orderId = orders[0].id;
  
  // Create order items
  for (const item of data.items) {
    await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        order_id: orderId,
        post_id: item.postId,
        quantity: item.quantity,
        price: item.price,
      }),
    });
  }
  
  return orderId;
}

export async function createCallbackRequest(data: {
  name?: string;
  phone: string;
  source?: string;
  message?: string;
  type?: string;
}): Promise<boolean> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/callback_requests`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  
  return response.ok;
}
