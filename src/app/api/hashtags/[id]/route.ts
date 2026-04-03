import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT increment click count
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const hashtag = await db.hashtag.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
    
    return NextResponse.json(hashtag);
  } catch (error) {
    console.error('Error updating hashtag:', error);
    return NextResponse.json({ error: 'Failed to update hashtag' }, { status: 500 });
  }
}

// DELETE hashtag (admin only)
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
    
    await db.hashtag.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hashtag:', error);
    return NextResponse.json({ error: 'Failed to delete hashtag' }, { status: 500 });
  }
}
