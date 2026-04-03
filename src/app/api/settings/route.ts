import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// GET settings
export async function GET() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?id=eq.default&select=*`,
      { headers, cache: 'no-store' }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch settings:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
    
    const settings = await response.json();
    
    if (!settings.length) {
      // Return default settings
      return NextResponse.json({
        companyName: 'Маркет Шоу',
        phone: '+7 985 800 97 19',
        telegram: 'https://t.me/TanyaShow',
        address: 'Москва',
        workingHours: 'Пн-Вс: 9:00 - 21:00',
      });
    }
    
    const { admin_password, ...publicSettings } = settings[0];
    
    return NextResponse.json({
      companyName: publicSettings.company_name,
      phone: publicSettings.phone,
      telegram: publicSettings.telegram,
      max: publicSettings.max,
      address: publicSettings.address,
      workingHours: publicSettings.working_hours,
      aboutText: publicSettings.about_text,
      deliveryText: publicSettings.delivery_text,
    });
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
    
    // Get current settings to verify password
    const settingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?id=eq.default&select=admin_password`,
      { headers }
    );
    
    const settings = await settingsResponse.json();
    
    if (!settings.length || password !== settings[0].admin_password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {};
    if (updates.companyName) updateData.company_name = updates.companyName;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.telegram) updateData.telegram = updates.telegram;
    if (updates.max) updateData.max = updates.max;
    if (updates.address) updateData.address = updates.address;
    if (updates.workingHours) updateData.working_hours = updates.workingHours;
    if (updates.aboutText) updateData.about_text = updates.aboutText;
    if (updates.deliveryText) updateData.delivery_text = updates.deliveryText;
    if (updates.adminPassword) updateData.admin_password = updates.adminPassword;
    
    // Update settings
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?id=eq.default`,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(updateData),
      }
    );
    
    if (!updateResponse.ok) {
      console.error('Failed to update settings:', await updateResponse.text());
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
    
    const updated = await updateResponse.json();
    const { admin_password: _, ...publicSettings } = updated[0];
    
    return NextResponse.json({
      companyName: publicSettings.company_name,
      phone: publicSettings.phone,
      telegram: publicSettings.telegram,
      max: publicSettings.max,
      address: publicSettings.address,
      workingHours: publicSettings.working_hours,
      aboutText: publicSettings.about_text,
      deliveryText: publicSettings.delivery_text,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
