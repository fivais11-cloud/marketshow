import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// GET all hashtags with popularity
export async function GET() {
  try {
    // Get hashtags with post count
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/hashtags?select=*,post_hashtags(count)&order=click_count.desc,name.asc`,
      { headers, cache: 'no-store' }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch hashtags:', await response.text());
      return NextResponse.json([]);
    }
    
    const hashtags = await response.json();
    
    const formattedHashtags = hashtags.map((h: any) => ({
      id: h.id,
      name: h.name,
      clickCount: h.click_count || 0,
      createdAt: h.created_at,
      postCount: h.post_hashtags?.[0]?.count || 0,
    }));
    
    return NextResponse.json(formattedHashtags);
  } catch (error) {
    console.error('Error fetching hashtags:', error);
    return NextResponse.json({ error: 'Failed to fetch hashtags' }, { status: 500 });
  }
}

// POST create hashtag (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password } = body;
    
    // Verify admin password
    const settingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?id=eq.default&select=admin_password`,
      { headers }
    );
    const settings = await settingsResponse.json();
    
    if (!settings.length || password !== settings[0].admin_password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const normalizedName = name.startsWith('#') ? name.slice(1) : name;
    
    // Check if exists
    const existingResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/hashtags?name=eq.${normalizedName}&select=*`,
      { headers }
    );
    const existing = await existingResponse.json();
    
    if (existing.length > 0) {
      return NextResponse.json({
        id: existing[0].id,
        name: existing[0].name,
        clickCount: existing[0].click_count,
        createdAt: existing[0].created_at,
      });
    }
    
    // Create new
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/hashtags?select=*`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ name: normalizedName }),
    });
    
    const newHashtag = await createResponse.json();
    
    return NextResponse.json({
      id: newHashtag[0].id,
      name: newHashtag[0].name,
      clickCount: 0,
      createdAt: newHashtag[0].created_at,
    });
  } catch (error) {
    console.error('Error creating hashtag:', error);
    return NextResponse.json({ error: 'Failed to create hashtag' }, { status: 500 });
  }
}
