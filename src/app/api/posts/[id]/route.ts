import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?id=eq.${id}&select=*,hashtags:post_hashtags(hashtag:hashtags(*))`,
      { headers, cache: 'no-store' }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch post:', await response.text());
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const posts = await response.json();
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const post = posts[0];
    
    const formattedPost = {
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
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      isActive,
      password 
    } = body;
    
    // Verify admin password
    const settingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?select=admin_password&limit=1`,
      { headers }
    );
    const settings = await settingsResponse.json();
    
    if (!settings || settings.length === 0 || password !== settings[0].admin_password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Update hashtags if provided
    if (hashtags !== undefined) {
      // Delete existing connections
      await fetch(`${SUPABASE_URL}/rest/v1/post_hashtags?post_id=eq.${id}`, {
        method: 'DELETE',
        headers,
      });
      
      // Create new connections
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
          body: JSON.stringify({ post_id: id, hashtag_id: hashtagId }),
        });
      }
    }
    
    // Update post
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (seoTitle !== undefined) updateData.seo_title = seoTitle;
    if (seoDescription !== undefined) updateData.seo_description = seoDescription;
    if (seoKeywords !== undefined) updateData.seo_keywords = seoKeywords;
    if (isActive !== undefined) updateData.is_active = isActive;
    
    if (Object.keys(updateData).length > 0) {
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(updateData),
      });
      
      if (!updateResponse.ok) {
        console.error('Failed to update post:', await updateResponse.text());
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
      }
    }
    
    // Fetch updated post with hashtags
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?id=eq.${id}&select=*,hashtags:post_hashtags(hashtag:hashtags(*))`,
      { headers }
    );
    const posts = await response.json();
    const post = posts[0];
    
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
      updatedAt: post.updated_at,
      hashtags: post.hashtags?.map((h: any) => h.hashtag).filter(Boolean) || [],
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Verify admin password
    const settingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?select=admin_password&limit=1`,
      { headers }
    );
    const settings = await settingsResponse.json();
    
    if (!settings || settings.length === 0 || password !== settings[0].admin_password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete hashtag connections first
    await fetch(`${SUPABASE_URL}/rest/v1/post_hashtags?post_id=eq.${id}`, {
      method: 'DELETE',
      headers,
    });
    
    // Delete post
    await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      method: 'DELETE',
      headers,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
