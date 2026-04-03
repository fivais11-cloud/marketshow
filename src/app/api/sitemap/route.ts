import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Получаем все активные товары
    const posts = await prisma.post.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const baseUrl = 'https://marketshow.ru';

    // Формируем URLs для статических страниц
    const staticPages = [
      {
        loc: `${baseUrl}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8',
      },
      {
        loc: `${baseUrl}/delivery`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.9',
      },
      {
        loc: `${baseUrl}/contacts`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8',
      },
    ];

    // Формируем URLs для страниц товаров
    const productPages = posts.map((post) => ({
      loc: `${baseUrl}/product/${post.id}`,
      lastmod: post.updatedAt.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
      image: post.imageUrl,
      title: post.title,
    }));

    // Генерируем XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Статические страницы -->
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  
  <!-- Страницы товаров -->
  ${productPages
    .map(
      (page) => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <image:image>
      <image:loc>${page.image}</image:loc>
      <image:title>${escapeXml(page.title)}</image:title>
    </image:image>
  </url>`
    )
    .join('')}
  
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
