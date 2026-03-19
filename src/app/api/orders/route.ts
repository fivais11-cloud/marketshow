import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Verify admin password
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const orders = await db.order.findMany({
      include: {
        items: {
          include: {
            post: {
              include: {
                hashtags: {
                  include: {
                    hashtag: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      email: order.email,
      totalPrice: order.totalPrice,
      status: order.status,
      source: order.source,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        postId: item.postId,
        title: item.post.title,
        imageUrl: item.post.imageUrl,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, items, totalPrice, source } = body;
    
    if (!phone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create order
    const order = await db.order.create({
      data: {
        phone,
        email: email || null,
        totalPrice,
        source,
        items: {
          create: items.map((item: any) => ({
            postId: item.postId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            post: true,
          },
        },
      },
    });
    
    // Get settings for Telegram notification
    const settings = await db.siteSettings.findFirst();
    
    // Send Telegram notification if bot token is configured
    if (settings?.telegramBotToken && settings?.telegramChatId) {
      try {
        const itemsText = items.map((item: any) => 
          `• ${item.title} x${item.quantity} = ${(item.price * item.quantity / 100).toLocaleString('ru-RU')}₽`
        ).join('\n');
        
        const message = `🛒 **НОВЫЙ ЗАКАЗ #%${order.id.slice(-6)}**\n\n` +
          `📞 Телефон: ${phone}\n` +
          (email ? `📧 Email: ${email}\n` : '') +
          `\n📦 Состав заказа:\n${itemsText}\n\n` +
          `💰 **Итого: ${(totalPrice / 100).toLocaleString('ru-RU')}₽**`;
        
        await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: 'Заказ успешно создан! Мы свяжемся с вами в ближайшее время.'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, password } = body;
    
    // Verify admin password
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
