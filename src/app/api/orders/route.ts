import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://qytsilajkulywydolzpj.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dHNpbGFqa3VseXd5ZG9senBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMTA3NCwiZXhwIjoyMDg5NTA3MDc0fQ.1vnktRT5Frlf4j4jJnpcswSrt0A9Yqu9tpYT1ZGu9HA';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// GET orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Verify admin password
    const settingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?id=eq.default&select=admin_password`,
      { headers }
    );
    const settings = await settingsResponse.json();
    
    if (!settings.length || password !== settings[0].admin_password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get orders with items
    const ordersResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?select=*,items:order_items(*,post:posts(id,title,image_url,price))&order=created_at.desc`,
      { headers, cache: 'no-store' }
    );
    
    const orders = await ordersResponse.json();
    
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      customerName: order.customer_name,
      phone: order.phone,
      email: order.email,
      totalPrice: order.total_price,
      status: order.status,
      source: order.source,
      createdAt: order.created_at,
      items: order.items?.map((item: any) => ({
        id: item.id,
        postId: item.post_id,
        quantity: item.quantity,
        price: item.price,
        post: item.post,
      })) || [],
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
    const { customerName, phone, email, totalPrice, source, items } = body;
    
    // Create order
    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        customer_name: customerName,
        phone,
        email,
        total_price: totalPrice,
        source,
        status: 'new',
      }),
    });
    
    if (!orderResponse.ok) {
      console.error('Failed to create order:', await orderResponse.text());
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
    
    const orders = await orderResponse.json();
    const orderId = orders[0].id;
    
    // Create order items
    if (items && items.length > 0) {
      for (const item of items) {
        await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            order_id: orderId,
            post_id: item.postId,
            quantity: item.quantity,
            price: item.price,
          }),
        });
      }
    }
    
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, password } = body;
    
    // Verify admin password
    const settingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?id=eq.default&select=admin_password`,
      { headers }
    );
    const settings = await settingsResponse.json();
    
    if (!settings.length || password !== settings[0].admin_password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      }
    );
    
    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
