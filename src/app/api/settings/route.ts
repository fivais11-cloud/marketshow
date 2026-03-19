import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET settings
export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst();
    
    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          companyName: 'Маркет Шоу',
          phone: '+7 985 800 97 19',
          telegram: 'https://t.me/marketshow',
          max: 'https://max.ru/chat/marketshow',
          address: 'Москва',
          workingHours: 'Пн-Вс: 9:00 - 21:00',
          aboutText: 'Маркет Шоу — премиум оформление праздников воздушными шарами. Делаем каждый праздник незабываемым! Более 5 лет опыта, сотни довольных клиентов.',
          deliveryText: '🚚 Доставка по Москве — БЕСПЛАТНО от 3000₽\n⏰ Срочная доставка за 2 часа\n💳 Оплата: наличными, картой при получении',
          adminPassword: 'admin123',
        },
      });
    }
    
    // Don't return sensitive fields
    const { adminPassword, telegramBotToken, telegramChatId, ...publicSettings } = settings;
    
    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, ...updates } = body;
    
    let settings = await db.siteSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }
    
    // Verify password
    if (password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    // If updating password, use the new one
    if (updates.adminPassword) {
      updates.adminPassword = updates.adminPassword;
    }
    
    // Update settings
    settings = await db.siteSettings.update({
      where: { id: settings.id },
      data: updates,
    });
    
    const { adminPassword, telegramBotToken, telegramChatId, ...publicSettings } = settings;
    
    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
