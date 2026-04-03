import { NextRequest, NextResponse } from 'next/server';
import { getPosts, getHashtags, getSiteSettings } from '@/lib/supabase';

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// GET all posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get('hashtag');
    const search = searchParams.get('search');
    
    // Build query
    let query = 'select=*,hashtags:post_hashtags(hashtag:hashtags(*))&is_active=eq.true&order=created_at.desc';
    
    if (hashtag) {
      // Filter by hashtag - need to join
      const hashtagData = await fetch(`${SUPABASE_URL}/rest/v1/hashtags?name=eq.${hashtag}&select=id`, { headers });
      const tags = await hashtagData.json();
      if (tags.length > 0) {
        const postsWithTag = await fetch(
          `${SUPABASE_URL}/rest/v1/post_hashtags?hashtag_id=eq.${tags[0].id}&select=post_id`,
          { headers }
        );
        const postIds = (await postsWithTag.json()).map((p: { post_id: string }) => p.post_id);
        if (postIds.length > 0) {
          query += `&id=in.(${postIds.join(',')})`;
        } else {
          return NextResponse.json([]);
        }
      } else {
        return NextResponse.json([]);
      }
    }
    
    if (search) {
      query += `&or=(title.ilike.%25${search}%25,description.ilike.%25${search}%25)`;
    }
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?${query}`, {
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch posts:', await response.text());
      return NextResponse.json([]);
    }
    
    const posts = await response.json();
    
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      imageUrl: post.image_url,
      description: post.description,
      price: post.price,
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      seoKeywords: post.seo_keywords,
      likes: post.likes || 0,
      isActive: post.is_active,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      hashtags: post.hashtags?.map((h: any) => h.hashtag).filter(Boolean) || [],
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      imageUrl, 
      description, 
      price, 
      hashtags, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      password 
    } = body;
    
    // Verify admin password
    const settings = await getSiteSettings();
    if (!settings || password !== settings.admin_password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Create post
    const postResponse = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        title: title || 'Без названия',
        image_url: imageUrl,
        description,
        price: price || 0,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        is_active: true,
      }),
    });
    
    if (!postResponse.ok) {
      console.error('Failed to create post:', await postResponse.text());
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
    
    const posts = await postResponse.json();
    const post = posts[0];
    
    // Create hashtag connections
    if (hashtags && hashtags.length > 0) {
      for (const tagName of hashtags) {
        const normalizedName = tagName.startsWith('#') ? tagName.slice(1) : tagName;
        
        // Find or create hashtag
        let hashtagId: string;
        const existingTag = await fetch(`${SUPABASE_URL}/rest/v1/hashtags?name=eq.${normalizedName}&select=id`, { headers });
        const existingTags = await existingTag.json();
        
        if (existingTags.length > 0) {
          hashtagId = existingTags[0].id;
        } else {
          const newTag = await fetch(`${SUPABASE_URL}/rest/v1/hashtags?select=id`, {
            method: 'POST',
            headers: { ...headers, 'Prefer': 'return=representation' },
            body: JSON.stringify({ name: normalizedName }),
          });
          const tagData = await newTag.json();
          hashtagId = tagData[0].id;
        }
        
        // Create connection
        await fetch(`${SUPABASE_URL}/rest/v1/post_hashtags`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ post_id: post.id, hashtag_id: hashtagId }),
        });
      }
    }
    
    return NextResponse.json({
      id: post.id,
      title: post.title,
      imageUrl: post.image_url,
      description: post.description,
      price: post.price,
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      seoKeywords: post.seo_keywords,
      likes: post.likes || 0,
      isActive: post.is_active,
      createdAt: post.created_at,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
