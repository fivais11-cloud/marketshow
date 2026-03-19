import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET likes for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const sessionId = searchParams.get('sessionId');
    
    if (postId) {
      const likes = await db.like.count({
        where: { postId },
      });
      
      let userLiked = false;
      if (sessionId) {
        const existingLike = await db.like.findFirst({
          where: { postId, sessionId },
        });
        userLiked = !!existingLike;
      }
      
      return NextResponse.json({ count: likes, userLiked });
    }
    
    return NextResponse.json({ error: 'postId required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

// POST toggle like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, sessionId } = body;
    
    if (!postId || !sessionId) {
      return NextResponse.json({ error: 'postId and sessionId required' }, { status: 400 });
    }
    
    const existingLike = await db.like.findFirst({
      where: { postId, sessionId },
    });
    
    if (existingLike) {
      // Unlike
      await db.like.delete({
        where: { id: existingLike.id },
      });
      
      await db.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      });
      
      const count = await db.like.count({ where: { postId } });
      return NextResponse.json({ count, userLiked: false });
    } else {
      // Like
      await db.like.create({
        data: { postId, sessionId },
      });
      
      await db.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });
      
      const count = await db.like.count({ where: { postId } });
      return NextResponse.json({ count, userLiked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
