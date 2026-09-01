import { ShopeeProduct } from './types';

interface CacheEntry {
  data: ShopeeProduct;
  expiresAt: number;
}
const productCache = new Map<string, CacheEntry>();

export function extractShopeeIds(text: string): { shopId: string; itemId: string } | null {
  if (!text) return null;

  // Unescape slashes and encoded characters
  const clean = text
    .split('\\/').join('/')
    .split('%2F').join('/')
    .split('%2f').join('/');

  // Pattern 1: product/123/456 or opaanlp/123/456 or item/123/456
  const p1 = clean.match(/(?:product|opaanlp|item)\/(\d+)\/(\d+)/i);
  if (p1) return { shopId: p1[1], itemId: p1[2] };

  // Pattern 2: i.123.456
  const p2 = clean.match(/i\.(\d+)\.(\d+)/i);
  if (p2) return { shopId: p2[1], itemId: p2[2] };

  // Pattern 3: itemid=456&shopid=123
  const itemMatch = clean.match(/[?&]item(?:_?id)?=(\d+)/i);
  const shopMatch = clean.match(/[?&]shop(?:_?id)?=(\d+)/i);
  if (itemMatch && shopMatch) {
    return { shopId: shopMatch[1], itemId: itemMatch[1] };
  }

  // Pattern 4: /123456789/123456789 (two large numbers in path)
  const p4 = clean.match(/\/(\d{6,14})\/(\d{6,14})/);
  if (p4) return { shopId: p4[1], itemId: p4[2] };

  return null;
}

export function isValidShopeeUrl(url: string): boolean {
  try {
    const formatted = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return (
      /(^|\.)shopee\.vn$/i.test(parsed.hostname) ||
      /(^|\.)shp\.ee$/i.test(parsed.hostname) ||
      /(^|\.)s\.shopee\.vn$/i.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}

export async function resolveShopeeProduct(rawUrl: string): Promise<ShopeeProduct> {
  const cleanInputUrl = rawUrl.trim();
  const targetUrl = /^https?:\/\//i.test(cleanInputUrl) ? cleanInputUrl : `https://${cleanInputUrl}`;

  // 1. Follow Redirects step-by-step to capture location headers and final URL
  let currentUrl = targetUrl;
  let bodyText = '';
  const maxHops = 6;

  for (let i = 0; i < maxHops; i++) {
    const ids = extractShopeeIds(currentUrl);
    if (ids) break;

    try {
      const res = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'manual',
      });

      const location = res.headers.get('location');
      if (location) {
        currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).toString();
        continue;
      }

      bodyText = await res.text();
      const bodyIds = extractShopeeIds(bodyText);
      if (bodyIds) break;

      if (res.url && res.url !== currentUrl) {
        currentUrl = res.url;
      }
      break;
    } catch (err) {
      console.error('[Resolver] Redirect hop error:', err);
      break;
    }
  }

  // 2. Extract IDs from all collected sources
  const ids =
    extractShopeeIds(currentUrl) ||
    extractShopeeIds(bodyText) ||
    extractShopeeIds(targetUrl);

  if (!ids) {
    throw new Error('Không thể tìm thấy mã sản phẩm (Shop ID / Item ID) từ link Shopee này.');
  }

  const { shopId, itemId } = ids;
  const cacheKey = `${shopId}_${itemId}`;

  // Check In-Memory Cache
  const cached = productCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // 3. Scrape Product OpenGraph Metadata via Social Crawler Header
  let productName = 'Sản phẩm Shopee';
  let imageUrl = 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5a0de24786de9f846143b5b8050e74.png';
  let price = 0;

  try {
    const metaPageUrl = `https://shopee.vn/product/${shopId}/${itemId}`;
    const metaRes = await fetch(metaPageUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      },
    });

    if (metaRes.ok) {
      const html = await metaRes.text();

      const titleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
      if (titleMatch) {
        productName = titleMatch[1].replace(/\s*\|\s*Shopee\s*Việt\s*Nam/gi, '').trim();
      }

      const imageMatch =
        html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imageMatch) {
        imageUrl = imageMatch[1];
      }

      const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
      if (descMatch) {
        const pMatch = descMatch[1].match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*(?:đ|VND|₫)/i);
        if (pMatch) {
          const parsedPrice = parseInt(pMatch[1].replace(/\./g, ''), 10);
          if (!isNaN(parsedPrice) && parsedPrice > 0) {
            price = parsedPrice;
          }
        }
      }
    }
  } catch (crawlErr) {
    console.error('[Resolver] Metadata crawl error:', crawlErr);
  }

  const result: ShopeeProduct = {
    shopId,
    itemId,
    productName,
    imageUrl,
    price: price || undefined,
    formattedPrice: price > 0 ? `${new Intl.NumberFormat('vi-VN').format(price)}đ` : undefined,
    originalUrl: cleanInputUrl,
    canonicalUrl: `https://shopee.vn/product/${shopId}/${itemId}`,
  };

  productCache.set(cacheKey, {
    data: result,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  });

  return result;
}
