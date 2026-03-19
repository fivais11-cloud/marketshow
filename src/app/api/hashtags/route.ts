import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all hashtags with popularity
export async function GET() {
  try {
    const hashtags = await db.hashtag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: [
        { clickCount: 'desc' },
        { name: 'asc' },
      ],
    });
    
    const formattedHashtags = hashtags.map((h) => ({
      ...h,
      postCount: h._count.posts,
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
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const normalizedName = name.startsWith('#') ? name.slice(1) : name;
    
    const existingHashtag = await db.hashtag.findFirst({
      where: { name: normalizedName },
    });
    
    if (existingHashtag) {
      return NextResponse.json(existingHashtag);
    }
    
    const hashtag = await db.hashtag.create({
      data: { name: normalizedName },
    });
    
    return NextResponse.json(hashtag);
  } catch (error) {
    console.error('Error creating hashtag:', error);
    return NextResponse.json({ error: 'Failed to create hashtag' }, { status: 500 });
  }
}
