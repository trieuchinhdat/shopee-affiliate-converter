import { ShopeeProduct } from './types';

interface CacheEntry {
  data: ShopeeProduct;
  expiresAt: number;
}
const productCache = new Map<string, CacheEntry>();

/**
 * Smart URL Extractor: extracts pure Shopee URL from messy shared text or direct inputs
 */
export function extractShopeeUrl(text: string): string | null {
  if (!text) return null;
  const cleanText = text.trim();

  // Pattern with http/https
  const match = cleanText.match(/(https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:shopee\.[a-z.]+|shp\.ee|shope\.ee)[^\s]*)/i);
  if (match && match[1]) {
    return match[1].replace(/[.,;:!?)\]"'>]+$/, '').trim();
  }

  // Pattern without http/https (e.g. shopee.vn/product/... or s.shopee.vn/...)
  const matchNoProto = cleanText.match(/((?:[a-zA-Z0-9-]+\.)*(?:shopee\.[a-z.]+|shp\.ee|shope\.ee)\/[^\s]*)/i);
  if (matchNoProto && matchNoProto[1]) {
    return `https://${matchNoProto[1].replace(/[.,;:!?)\]"'>]+$/, '').trim()}`;
  }

  return null;
}

/**
 * Decode HTML entities like &amp;, &#39;, &quot;, &lt;, &gt;
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Extracts product title directly from the URL slug if present (instant, 100% accurate)
 */
export function extractTitleFromSlug(urlStr: string): string | null {
  if (!urlStr) return null;
  try {
    const formatted = /^https?:\/\//i.test(urlStr.trim()) ? urlStr.trim() : `https://${urlStr.trim()}`;
    const parsed = new URL(formatted);
    const pathname = parsed.pathname;

    // Pattern 1: /Ten-San-Pham-i.123456.7891011
    const slugMatch1 = pathname.match(/^\/([^\/]+)-i\.\d+\.\d+/i);
    if (slugMatch1 && slugMatch1[1]) {
      const decoded = decodeURIComponent(slugMatch1[1]).replace(/[-_+]/g, ' ').replace(/\s+/g, ' ').trim();
      if (decoded.length > 3) return decoded;
    }

    // Pattern 2: /Ten-San-Pham/123456/7891011
    const slugMatch2 = pathname.match(/^\/([^\/]+)\/\d+\/\d+/i);
    if (slugMatch2 && slugMatch2[1] && !/^(product|opaanlp|item|universal-link)$/i.test(slugMatch2[1])) {
      const decoded = decodeURIComponent(slugMatch2[1]).replace(/[-_+]/g, ' ').replace(/\s+/g, ' ').trim();
      if (decoded.length > 3) return decoded;
    }
  } catch {
    // Ignore URL parse error
  }
  return null;
}

/**
 * Robust extractor for Shop ID and Item ID from any URL, text, HTML snippet, or JSON payload
 */
export function extractShopeeIds(text: string): { shopId: string; itemId: string } | null {
  if (!text) return null;

  // Unescape slashes and decode URI components
  let clean = text;
  try {
    clean = decodeURIComponent(text.split('\\/').join('/'));
  } catch {
    clean = text.split('\\/').join('/');
  }

  // Pattern 1: product/123/456 or opaanlp/123/456 or item/123/456 or universal-link/product/123/456
  const p1 = clean.match(/(?:product|opaanlp|item)\/(\d+)\/(\d+)/i);
  if (p1) return { shopId: p1[1], itemId: p1[2] };

  // Pattern 2: i.123.456 (common in web product slugs)
  const p2 = clean.match(/i\.(\d+)\.(\d+)/i);
  if (p2) return { shopId: p2[1], itemId: p2[2] };

  // Pattern 3: URL params in any order: itemid & shopid OR item_id & shop_id OR itemId & shopId
  const itemMatch = clean.match(/(?:[?&"'_]item(?:_?id)?|itemId)["']?\s*[:=]\s*["']?(\d+)["']?/i);
  const shopMatch = clean.match(/(?:[?&"'_]shop(?:_?id)?|shopId)["']?\s*[:=]\s*["']?(\d+)["']?/i);
  if (itemMatch && shopMatch) {
    return { shopId: shopMatch[1], itemId: itemMatch[1] };
  }

  // Pattern 4: shopee app deep links (shopee://product/123/456 or shopeevn://product/123/456)
  const p4App = clean.match(/shopee(?:vn)?:\/\/(?:product|item)\/(\d+)\/(\d+)/i);
  if (p4App) return { shopId: p4App[1], itemId: p4App[2] };

  // Pattern 5: OpenGraph / Canonical / Share links inside HTML
  const pCanonical = clean.match(/https?:\/\/(?:[a-zA-Z0-9-]+\.)*shopee\.[a-z.]+\/(?:[^\s"'>]+-)?i\.(\d+)\.(\d+)/i);
  if (pCanonical) return { shopId: pCanonical[1], itemId: pCanonical[2] };

  const pProductUrl = clean.match(/https?:\/\/(?:[a-zA-Z0-9-]+\.)*shopee\.[a-z.]+\/product\/(\d+)\/(\d+)/i);
  if (pProductUrl) return { shopId: pProductUrl[1], itemId: pProductUrl[2] };

  // Pattern 6: Two consecutive numeric path segments (e.g., /88217088/24169724032)
  const p6 = clean.match(/\/(\d{5,14})\/(\d{5,14})/);
  if (p6) return { shopId: p6[1], itemId: p6[2] };

  return null;
}

/**
 * Validates whether the given string belongs to a Shopee domain or shortlink
 */
export function isValidShopeeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const formatted = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    const parsed = new URL(formatted);
    return (
      /(^|\.)shopee\.[a-z.]+$/i.test(parsed.hostname) ||
      /(^|\.)shp\.ee$/i.test(parsed.hostname) ||
      /(^|\.)shope\.ee$/i.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Resolves any Shopee link (direct, shortlink, universal link, or shared message) to full product info
 */
export async function resolveShopeeProduct(rawUrl: string): Promise<ShopeeProduct> {
  const cleanInputUrl = rawUrl.trim();
  const targetUrl = /^https?:\/\//i.test(cleanInputUrl) ? cleanInputUrl : `https://${cleanInputUrl}`;

  // Check if title is in slug of initial URL
  let slugTitle = extractTitleFromSlug(targetUrl);

  // 1. Fast path: Check if IDs are already in the input URL
  let ids = extractShopeeIds(targetUrl);
  let resolvedUrl = targetUrl;

  // 2. Shortlink resolution: Follow redirects and inspect responses
  if (!ids) {
    let currentUrl = targetUrl;
    const maxHops = 6;

    // Strategy A: Step-by-step manual redirect hop inspection with browser UA
    for (let i = 0; i < maxHops; i++) {
      ids = extractShopeeIds(currentUrl);
      if (ids) {
        resolvedUrl = currentUrl;
        break;
      }

      try {
        const res = await fetch(currentUrl, {
          method: 'GET',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          },
          redirect: 'manual',
        });

        const location = res.headers.get('location');
        if (location) {
          const locFull = location.startsWith('http') ? location : new URL(location, currentUrl).toString();

          // Check if location contains slug title
          const locSlugTitle = extractTitleFromSlug(locFull);
          if (locSlugTitle) slugTitle = locSlugTitle;

          // Check if location header directly contains Shopee IDs
          const locIds = extractShopeeIds(locFull);
          if (locIds) {
            ids = locIds;
            resolvedUrl = locFull;
            break;
          }

          currentUrl = locFull;
          continue;
        }

        const bodyHtml = await res.text();
        const bodyIds = extractShopeeIds(bodyHtml);
        if (bodyIds) {
          ids = bodyIds;
          resolvedUrl = currentUrl;
          break;
        }

        if (res.url && res.url !== currentUrl) {
          currentUrl = res.url;
        }
        break;
      } catch (hopErr) {
        console.error('[Resolver] Manual redirect hop error:', hopErr);
        break;
      }
    }

    // Strategy B: Fallback with Social Bot User-Agent (Shopee serves full OpenGraph tags to bots)
    if (!ids) {
      try {
        const botRes = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'follow',
        });

        if (botRes.url) {
          const uSlug = extractTitleFromSlug(botRes.url);
          if (uSlug) slugTitle = uSlug;

          const uIds = extractShopeeIds(botRes.url);
          if (uIds) {
            ids = uIds;
            resolvedUrl = botRes.url;
          }
        }

        if (!ids) {
          const botHtml = await botRes.text();
          const htmlIds = extractShopeeIds(botHtml);
          if (htmlIds) {
            ids = htmlIds;
          }
        }
      } catch (botErr) {
        console.error('[Resolver] Bot redirect fetch error:', botErr);
      }
    }
  }

  if (!ids) {
    throw new Error('Không thể tìm thấy mã sản phẩm (Shop ID / Item ID) từ link Shopee này. Vui lòng kiểm tra lại link sản phẩm!');
  }

  const { shopId, itemId } = ids;
  const cacheKey = `${shopId}_${itemId}`;

  // Check In-Memory Cache
  const cached = productCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // 3. Scrape Product OpenGraph Metadata & Details
  let productName = slugTitle || `Sản phẩm Shopee`;
  let imageUrl = 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5a0de24786de9f846143b5b8050e74.png';
  let price: number | undefined = undefined;

  // Fetch OpenGraph HTML from canonical product page
  try {
    const metaPageUrl = `https://shopee.vn/product/${shopId}/${itemId}`;
    const metaRes = await fetch(metaPageUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8',
      },
    });

    if (metaRes.ok) {
      const html = await metaRes.text();

      // Extract title
      const titleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i) ||
        html.match(/<title>([^<]+)<\/title>/i);

      if (titleMatch && titleMatch[1]) {
        const rawTitle = decodeHtmlEntities(titleMatch[1]);
        const cleanedTitle = rawTitle
          .replace(/\s*\|\s*Shopee\s*Việt\s*Nam/gi, '')
          .replace(/\s*\|\s*Shopee\s*VN/gi, '')
          .replace(/\s*\|\s*Shopee/gi, '')
          .trim();

        if (cleanedTitle.length > 2 && !/^(Shopee|Trang chủ)$/i.test(cleanedTitle)) {
          productName = cleanedTitle;
        }
      }

      // Extract image
      const imageMatch =
        html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

      if (imageMatch && imageMatch[1] && imageMatch[1].startsWith('http')) {
        imageUrl = imageMatch[1];
      }

      // Extract price from description
      const descMatch =
        html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

      if (descMatch && descMatch[1]) {
        const pMatch = descMatch[1].match(/(?:Mua|Giá|Đang bán|chỉ|₫|đ)?\s*(\d{1,3}(?:\.\d{3})*|\d+)\s*(?:đ|VND|₫)/i);
        if (pMatch) {
          const parsedPrice = parseInt(pMatch[1].replace(/\./g, ''), 10);
          if (!isNaN(parsedPrice) && parsedPrice > 1000) {
            price = parsedPrice;
          }
        }
      }
    }
  } catch (crawlErr) {
    console.error('[Resolver] Metadata crawl error:', crawlErr);
  }

  // Fallback product name with item ID if generic
  if (productName === 'Sản phẩm Shopee') {
    productName = `Sản phẩm Shopee #${itemId}`;
  }

  const result: ShopeeProduct = {
    shopId,
    itemId,
    productName,
    imageUrl,
    price,
    formattedPrice: price ? `${new Intl.NumberFormat('vi-VN').format(price)}đ` : undefined,
    originalUrl: cleanInputUrl,
    canonicalUrl: `https://shopee.vn/product/${shopId}/${itemId}`,
  };

  // Cache result for 12 hours
  productCache.set(cacheKey, {
    data: result,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  });

  return result;
}
