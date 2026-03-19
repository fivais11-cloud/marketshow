import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST create callback request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, source, message, type } = body;
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }
    
    // Save callback request
    const callbackRequest = await db.callbackRequest.create({
      data: {
        name,
        phone,
        source,
        message,
        type: type || 'callback',
      },
    });
    
    // Get settings for Telegram notification
    const settings = await db.siteSettings.findFirst();
    
    // Send Telegram notification if bot is configured
    if (settings?.telegramBotToken && settings?.telegramChatId) {
      try {
        const typeLabels: Record<string, string> = {
          callback: '📞 ЗАПРОС ЗВОНКА',
          telegram: '✈️ ЗАЯВКА ИЗ TELEGRAM',
          max: '💬 ЗАЯВКА ИЗ MAX',
          order: '🛒 ЗАКАЗ',
        };
        
        let notificationMessage = `${typeLabels[type] || '📝 НОВАЯ ЗАЯВКА'} #%${callbackRequest.id.slice(-6)}\n\n`;
        
        if (name) {
          notificationMessage += `👤 Имя: ${name}\n`;
        }
        
        notificationMessage += `📞 Телефон: ${phone}\n`;
        
        if (message) {
          notificationMessage += `💬 Сообщение: ${message}\n`;
        }
        
        if (source) {
          notificationMessage += `📍 Источник: ${source}\n`;
        }
        
        notificationMessage += `\n🕐 ${new Date().toLocaleString('ru-RU')}`;
        
        await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegramChatId,
            text: notificationMessage,
            parse_mode: 'HTML',
          }),
        });
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      id: callbackRequest.id,
      message: 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.'
    });
  } catch (error) {
    console.error('Error creating callback request:', error);
    return NextResponse.json({ error: 'Failed to create callback request' }, { status: 500 });
  }
}

// GET callback requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Verify admin password
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const requests = await db.callbackRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching callback requests:', error);
    return NextResponse.json({ error: 'Failed to fetch callback requests' }, { status: 500 });
  }
}
