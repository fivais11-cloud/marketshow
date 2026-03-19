import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const post = await db.post.findUnique({
      where: { id },
      include: {
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
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
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Update hashtags if provided
    if (hashtags !== undefined) {
      await db.postHashtag.deleteMany({
        where: { postId: id },
      });
      
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
        
        await db.postHashtag.create({
          data: { postId: id, hashtagId: hashtag.id },
        });
      }
    }
    
    // Price in rubles, store as kopecks
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Math.round(price * 100);
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const post = await db.post.update({
      where: { id },
      data: updateData,
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
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await db.post.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
