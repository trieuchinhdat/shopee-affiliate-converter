import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '7days';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get('limit') || '15', 10)));
    const search = searchParams.get('search')?.trim() || '';

    // Calculate Date Threshold
    let since = '1970-01-01T00:00:00.000Z';
    let until = '2099-12-31T23:59:59.999Z';
    const now = new Date();

    if (period === 'today') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      since = startOfToday.toISOString();
    } else if (period === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      since = sevenDaysAgo.toISOString();
    } else if (period === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      since = thirtyDaysAgo.toISOString();
    } else if (period === 'custom' && startDate && endDate) {
      since = new Date(`${startDate}T00:00:00.000Z`).toISOString();
      until = new Date(`${endDate}T23:59:59.999Z`).toISOString();
    }

    const offset = (page - 1) * limit;
    const limitPlusOffset = offset + limit;

    // Base filter conditions
    const hasSearch = search.length > 0;
    const searchPattern = `*${search}*`;

    // Query 1: Total conversions in period (filtered by search if provided)
    const countQuery = hasSearch
      ? `count(*[_type == "conversionLog" && createdAt >= $since && createdAt <= $until && (productName match $search || shopId match $search || itemId match $search)])`
      : `count(*[_type == "conversionLog" && createdAt >= $since && createdAt <= $until])`;

    // Query 2: Total conversions without search (for global KPI)
    const globalCountQuery = `count(*[_type == "conversionLog" && createdAt >= $since && createdAt <= $until])`;

    // Query 3: Total clicks in period
    const totalClicksQuery = `count(*[_type == "clickTrack" && clickedAt >= $since && clickedAt <= $until])`;

    // Query 4: Clicks by channel
    const clicksChannelQuery = `*[_type == "clickTrack" && clickedAt >= $since && clickedAt <= $until]{ channel }`;

    // Query 5: Paginated conversion logs
    const paginatedLogsQuery = hasSearch
      ? `*[_type == "conversionLog" && createdAt >= $since && createdAt <= $until && (productName match $search || shopId match $search || itemId match $search)] | order(createdAt desc) [$offset...$limitPlusOffset]{
          _id,
          inputUrl,
          shopId,
          itemId,
          productName,
          price,
          imageUrl,
          device,
          createdAt,
          affiliateIdUsed
        }`
      : `*[_type == "conversionLog" && createdAt >= $since && createdAt <= $until] | order(createdAt desc) [$offset...$limitPlusOffset]{
          _id,
          inputUrl,
          shopId,
          itemId,
          productName,
          price,
          imageUrl,
          device,
          createdAt,
          affiliateIdUsed
        }`;

    // Query 6: Top recent conversions to aggregate top trending products
    const trendingPoolQuery = `*[_type == "conversionLog" && createdAt >= $since && createdAt <= $until && defined(productName)] | order(createdAt desc)[0...300]{
      shopId,
      itemId,
      productName,
      imageUrl,
      price
    }`;

    // Query 7: App Config
    const appConfigQuery = `*[_type == "appConfig"][0]{ affiliateId, zaloGroupUrl }`;

    const [
      totalFilteredConversions,
      totalGlobalConversions,
      totalClicks,
      clicksByChannel,
      paginatedLogs,
      trendingPool,
      appConfig,
    ] = await Promise.all([
      sanityClient.fetch<number>(countQuery, { since, until, search: searchPattern, offset, limitPlusOffset }),
      sanityClient.fetch<number>(globalCountQuery, { since, until }),
      sanityClient.fetch<number>(totalClicksQuery, { since, until }),
      sanityClient.fetch<any[]>(clicksChannelQuery, { since, until }),
      sanityClient.fetch<any[]>(paginatedLogsQuery, { since, until, search: searchPattern, offset, limitPlusOffset }),
      sanityClient.fetch<any[]>(trendingPoolQuery, { since, until }),
      sanityClient.fetch<any>(appConfigQuery),
    ]);

    // Aggregate Channel Clicks
    const channelCounts: Record<string, number> = {
      fb_22: 0,
      fb_20: 0,
      ytb: 0,
      ig: 0,
      zalo: 0,
      other: 0,
    };

    if (Array.isArray(clicksByChannel)) {
      clicksByChannel.forEach((c) => {
        const ch = c.channel || 'other';
        channelCounts[ch] = (channelCounts[ch] || 0) + 1;
      });
    }

    // Aggregate Top 5 Trending Products
    const productMap = new Map<string, { count: number; name: string; imageUrl?: string; shopId: string; itemId: string; price?: number }>();
    if (Array.isArray(trendingPool)) {
      trendingPool.forEach((item) => {
        const key = `${item.shopId}_${item.itemId}`;
        if (!productMap.has(key)) {
          productMap.set(key, {
            count: 1,
            name: item.productName || 'Sản phẩm Shopee',
            imageUrl: item.imageUrl,
            shopId: item.shopId,
            itemId: item.itemId,
            price: item.price,
          });
        } else {
          productMap.get(key)!.count += 1;
        }
      });
    }

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const ctr = totalGlobalConversions > 0 ? ((totalClicks / totalGlobalConversions) * 100).toFixed(1) : '0.0';
    const totalPages = Math.max(1, Math.ceil((totalFilteredConversions || 0) / limit));

    return NextResponse.json({
      success: true,
      stats: {
        period,
        startDate: startDate || null,
        endDate: endDate || null,
        totalConversions: totalGlobalConversions || 0,
        totalClicks: totalClicks || 0,
        ctr: `${ctr}%`,
        channelCounts,
        topProducts,
        recentConversions: paginatedLogs || [],
        pagination: {
          page,
          limit,
          totalItems: totalFilteredConversions || 0,
          totalPages,
        },
        appConfig: appConfig || null,
      },
    });
  } catch (err: any) {
    console.error('[API Admin Stats] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
