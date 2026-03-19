import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get('hashtag');
    const search = searchParams.get('search');
    
    const where: any = { isActive: true };
    
    if (hashtag) {
      where.hashtags = {
        some: {
          hashtag: {
            name: hashtag,
          },
        },
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        {
          hashtags: {
            some: {
              hashtag: {
                name: { contains: search },
              },
            },
          },
        },
      ];
    }
    
    const posts = await db.post.findMany({
      where,
      include: {
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl,
      description: post.description,
      price: post.price,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      likes: post.likes,
      isActive: post.isActive,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      hashtags: post.hashtags.map((h) => h.hashtag),
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
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Create or find hashtags
    const hashtagConnections = [];
    if (hashtags && hashtags.length > 0) {
      for (const tagName of hashtags) {
        const normalizedName = tagName.startsWith('#') ? tagName.slice(1) : tagName;
        let hashtag = await db.hashtag.findFirst({
          where: { name: normalizedName },
        });
        
        if (!hashtag) {
          hashtag = await db.hashtag.create({
            data: { name: normalizedName },
          });
        }
        
        hashtagConnections.push({ hashtagId: hashtag.id });
      }
    }
    
    // Price in rubles, store as kopecks (multiply by 100)
    const priceInKopecks = Math.round((price || 0) * 100);
    
    const post = await db.post.create({
      data: {
        title: title || 'Без названия',
        imageUrl,
        description,
        price: priceInKopecks,
        seoTitle,
        seoDescription,
        seoKeywords,
        hashtags: {
          create: hashtagConnections.map((h) => ({ hashtagId: h.hashtagId })),
        },
      },
      include: {
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });
    
    const formattedPost = {
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl,
      description: post.description,
      price: post.price,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      likes: post.likes,
      isActive: post.isActive,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      hashtags: post.hashtags.map((h) => h.hashtag),
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
