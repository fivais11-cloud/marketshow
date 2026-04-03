import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// POST toggle like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, sessionId } = body;
    
    if (!postId || !sessionId) {
      return NextResponse.json({ error: 'Missing postId or sessionId' }, { status: 400 });
    }
    
    // Check if already liked
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}&session_id=eq.${sessionId}&select=id`,
      { headers }
    );
    
    const existing = await checkResponse.json();
    
    if (existing.length > 0) {
      // Remove like
      await fetch(
        `${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}&session_id=eq.${sessionId}`,
        { method: 'DELETE', headers }
      );
      
      // Get current likes count and decrement
      const postResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/posts?id=eq.${postId}&select=likes`,
        { headers }
      );
      const post = await postResponse.json();
      const newLikes = Math.max(0, (post[0]?.likes || 0) - 1);
      
      await fetch(
        `${SUPABASE_URL}/rest/v1/posts?id=eq.${postId}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ likes: newLikes }),
        }
      );
      
      return NextResponse.json({ liked: false, likes: newLikes });
    } else {
      // Add like
      await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ post_id: postId, session_id: sessionId }),
      });
      
      // Get current likes count and increment
      const postResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/posts?id=eq.${postId}&select=likes`,
        { headers }
      );
      const post = await postResponse.json();
      const newLikes = (post[0]?.likes || 0) + 1;
      
      await fetch(
        `${SUPABASE_URL}/rest/v1/posts?id=eq.${postId}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ likes: newLikes }),
        }
      );
      
      return NextResponse.json({ liked: true, likes: newLikes });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}

// GET check if liked
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const sessionId = searchParams.get('sessionId');
    
    if (!postId || !sessionId) {
      return NextResponse.json({ liked: false });
    }
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}&session_id=eq.${sessionId}&select=id`,
      { headers }
    );
    
    const likes = await response.json();
    
    return NextResponse.json({ liked: likes.length > 0 });
  } catch (error) {
    console.error('Error checking like:', error);
    return NextResponse.json({ liked: false });
  }
}
