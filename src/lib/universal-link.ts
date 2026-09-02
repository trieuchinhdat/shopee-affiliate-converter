import { FacebookTemplatePayload } from './types';

export interface GenerateLinkParams {
  shopId: string;
  itemId: string;
  affiliateId: string;
  channel: 'fb' | 'ig' | 'ytb' | 'zalo';
  subId?: string;
  fbPayload?: FacebookTemplatePayload;
}

// Default verified Facebook Token Payload (Link 2) as solid fallback
export const DEFAULT_FB_PAYLOAD: FacebookTemplatePayload = {
  encryptedPayload:
    'vo9Rv2kewEnVAmIpH7xF6YuNcQjITrIzhNWvYVu7k5aa6ml2qkkP3rO3D6o26Grw-CVic7hNmRWRvN8dEvf9laRkMLDitYQ46JwEKj5KQ-phGdYGo0IZQqH4A1g_efgrobqcYR15u6T8I6iS1s95ieSMY5PVIB7-uEhpROgHP3utzkCxRKo-nEJmNNx1AWHq4VnrbHLTDqcMkcRqdSwtWg',
  fbContentId:
    'Q9-wBQHtmIzInQLkJYBelpNGRSRoVHQ7lhjPELkVhR7GUp6RWZ7bAndVYoBgJ27RrkTs',
  gadsTSig:
    'gqRjZGVrxHCFomtpsTE0MjUxOnRzc19zZGtfa2V5omt20QACpGFsZ2_SAAAAZKNkZWvAomN0xEAAAAAMCDZ1QISG3Y9eQ8yPVgAOiad7g2PqyaqkWO_9nGG8rv2GeSvTKVy0YH9Uq_tAMSkaB8ROm0FmD1_y4Fc6qmNpcGhlcnRleHTElQAAAAy5n6nSYzhDakD7_qGJH0uHwUxUINMhZxNoFXabCrnyTB_veahK3qrqzDfxMlk_CQ151BjdBwA9IqtgwrDRILFPt79hUj6qnUkbKLISYVm6z1zZ0IF5JJUiJaKSbBiwEwvUbbaRwTexJWPxnyc1Y9QucqZPYgaF8-3l7pN0DinrflQStUAazQ_857nhR7uP7yUr',
  utmCampaign:
    'id_3TIQUSO6t9x-fbcontent_vo9Rv2kewEnVAmIpH7xF6YuNcQjITrIzhNWvYVu7k5aa6ml2qkkP3rO3D6o26Grw%7ECVic7hNmRWRvN8dEvf9laRkMLDitYQ46JwEKj5KQ%7EphGdYGo0IZQqH4A1g.efgrobqcYR15u6T8I6iS1s95ieSMY5PVIB7%7EuEhpROgHP3utzkCxRKo%7EnEJmNNx1AWHq4VnrbHLTDqcMkcRqdSwtWg',
  expGroup: 'rollout',
  contentType: 'REELS',
  contentSource: 'fb',
};

// In-memory cache for resolved Facebook payloads (TTL: 1 hour)
interface FbPayloadCacheEntry {
  payload: FacebookTemplatePayload;
  expiresAt: number;
}
const fbPayloadCache = new Map<string, FbPayloadCacheEntry>();

/**
 * Safely parses any raw Shopee Facebook link or query string to extract its security token & signature payload
 */
export function parseFacebookPayload(rawUrl: string): FacebookTemplatePayload | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  try {
    const formatted = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    let params: URLSearchParams | null = null;
    try {
      const url = new URL(formatted);
      params = url.searchParams;
    } catch {
      // Ignore URL constructor error and fallback to regex
    }

    let encryptedPayload = params?.get('encrypted_payload');
    let fbContentId = params?.get('fb_content_id');

    // Fallback regex matching in case parameters are in HTML, JSON, or escaped string
    if (!encryptedPayload) {
      const match = rawUrl.match(/[?&]encrypted_payload=([^&"'\s]+)/i);
      if (match && match[1]) {
        try {
          encryptedPayload = decodeURIComponent(match[1]);
        } catch {
          encryptedPayload = match[1];
        }
      }
    }

    if (!fbContentId) {
      const match = rawUrl.match(/[?&]fb_content_id=([^&"'\s]+)/i);
      if (match && match[1]) {
        try {
          fbContentId = decodeURIComponent(match[1]);
        } catch {
          fbContentId = match[1];
        }
      }
    }

    if (!encryptedPayload || !fbContentId) {
      return null;
    }

    let gadsTSig = params?.get('gads_t_sig') || undefined;
    if (!gadsTSig) {
      const matchSig = rawUrl.match(/[?&]gads_t_sig=([^&"'\s]+)/i);
      if (matchSig && matchSig[1]) {
        try {
          gadsTSig = decodeURIComponent(matchSig[1]);
        } catch {
          gadsTSig = matchSig[1];
        }
      }
    }

    const utmCampaign = params?.get('utm_campaign') || `id_fb-fbcontent_${encryptedPayload}`;
    const expGroup = params?.get('exp_group') || 'rollout';
    const contentType = params?.get('content_type') || 'REELS';
    const contentSource = params?.get('content_source') || 'fb';

    return {
      encryptedPayload,
      fbContentId,
      gadsTSig,
      utmCampaign,
      expGroup,
      contentType,
      contentSource,
    };
  } catch (err) {
    console.error('[UniversalLink] Error parsing Facebook sample URL:', err);
    return null;
  }
}

/**
 * Resolves any Facebook sample link (supporting short links like s.shopee.vn, vn.shp.ee, shope.ee)
 * to extract its live Facebook security token & signature payload.
 */
export async function resolveAndExtractFacebookPayload(rawUrl: string): Promise<FacebookTemplatePayload | null> {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return null;

  const trimmed = rawUrl.trim();
  const cacheKey = trimmed;
  const cached = fbPayloadCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  // 1. Check if direct URL already contains the payload
  const directPayload = parseFacebookPayload(trimmed);
  if (directPayload) {
    fbPayloadCache.set(cacheKey, {
      payload: directPayload,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour cache
    });
    return directPayload;
  }

  // 2. Short link resolution: Follow redirects to retrieve the real destination URL
  let currentUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const maxHops = 6;

  for (let i = 0; i < maxHops; i++) {
    try {
      const res = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/460.0.0.0;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBCR/Viettel;FBID/phone;FBLC/vi_VN;FBOP/5]',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        },
        redirect: 'manual',
      });

      const location = res.headers.get('location');
      if (location) {
        const locFull = location.startsWith('http') ? location : new URL(location, currentUrl).toString();
        const parsedFromLoc = parseFacebookPayload(locFull);
        if (parsedFromLoc) {
          fbPayloadCache.set(cacheKey, {
            payload: parsedFromLoc,
            expiresAt: Date.now() + 60 * 60 * 1000,
          });
          return parsedFromLoc;
        }
        currentUrl = locFull;
        continue;
      }

      // If no location header, inspect response body
      const bodyHtml = await res.text();
      const parsedFromBody = parseFacebookPayload(bodyHtml);
      if (parsedFromBody) {
        fbPayloadCache.set(cacheKey, {
          payload: parsedFromBody,
          expiresAt: Date.now() + 60 * 60 * 1000,
        });
        return parsedFromBody;
      }

      if (res.url && res.url !== currentUrl) {
        const parsedFromResUrl = parseFacebookPayload(res.url);
        if (parsedFromResUrl) {
          fbPayloadCache.set(cacheKey, {
            payload: parsedFromResUrl,
            expiresAt: Date.now() + 60 * 60 * 1000,
          });
          return parsedFromResUrl;
        }
        currentUrl = res.url;
      }
      break;
    } catch (hopErr) {
      console.error('[UniversalLink] Error resolving FB sample hop:', hopErr);
      break;
    }
  }

  // Fallback with Facebook external hit bot UA
  try {
    const botRes = await fetch(currentUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (botRes.url) {
      const parsedUrl = parseFacebookPayload(botRes.url);
      if (parsedUrl) {
        fbPayloadCache.set(cacheKey, {
          payload: parsedUrl,
          expiresAt: Date.now() + 60 * 60 * 1000,
        });
        return parsedUrl;
      }
    }

    const botHtml = await botRes.text();
    const parsedHtml = parseFacebookPayload(botHtml);
    if (parsedHtml) {
      fbPayloadCache.set(cacheKey, {
        payload: parsedHtml,
        expiresAt: Date.now() + 60 * 60 * 1000,
      });
      return parsedHtml;
    }
  } catch (botErr) {
    console.error('[UniversalLink] Bot redirect fetch error for FB sample:', botErr);
  }

  return null;
}

export function generateShopeeUniversalLink({
  shopId,
  itemId,
  affiliateId,
  channel,
  subId = 'web_converter',
  fbPayload,
}: GenerateLinkParams): string {
  const baseUrl = `https://shopee.vn/universal-link/product/${shopId}/${itemId}`;

  // Generate dynamic unique session tokens for anti-duplicate click filter
  const randomUls = `56hf${Math.random().toString(36).substring(2, 8)}`;
  const randomTerm = Math.random().toString(36).substring(2, 14);
  const randomFbclid = `IwY2xjawUD${Math.random().toString(36).substring(2, 18)}AAEe${Math.random().toString(36).substring(2, 22)}`;

  if (channel === 'fb') {
    const activePayload = fbPayload || DEFAULT_FB_PAYLOAD;

    const params = new URLSearchParams({
      channel_type: 'fb',
      content_source: activePayload.contentSource || 'fb',
      content_type: activePayload.contentType || 'REELS',
      exp_group: activePayload.expGroup || 'rollout',
      lang: 'vi',
      encrypted_payload: activePayload.encryptedPayload,
      fb_content_id: activePayload.fbContentId,
      ...(activePayload.gadsTSig ? { gads_t_sig: activePayload.gadsTSig } : {}),
      utm_campaign: activePayload.utmCampaign,
      ...(affiliateId ? { mmp_pid: affiliateId, utm_source: affiliateId } : {}),
      utm_medium: 'affiliates',
      utm_content: subId,
      fbclid: randomFbclid,
      uls_trackid: randomUls,
      utm_term: randomTerm,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  // Standard universal link for other social channels
  const params = new URLSearchParams({
    channel_type: channel,
    ...(affiliateId ? { mmp_pid: affiliateId, utm_source: affiliateId } : {}),
    utm_medium: 'affiliates',
    utm_campaign: `app_${channel}`,
    utm_content: subId,
    uls_trackid: randomUls,
  });

  return `${baseUrl}?${params.toString()}`;
}

export function generateAllUniversalLinks(
  shopId: string,
  itemId: string,
  affiliateId: string,
  subId: string = 'web_converter',
  fbPayload?: FacebookTemplatePayload
) {
  return {
    facebook: {
      fb25: generateShopeeUniversalLink({
        shopId,
        itemId,
        affiliateId,
        channel: 'fb',
        subId: `${subId}_fb25`,
        fbPayload,
      }),
      fb22: generateShopeeUniversalLink({
        shopId,
        itemId,
        affiliateId,
        channel: 'fb',
        subId: `${subId}_fb22`,
        fbPayload,
      }),
      fb20: generateShopeeUniversalLink({
        shopId,
        itemId,
        affiliateId,
        channel: 'fb',
        subId: `${subId}_fb20`,
        fbPayload,
      }),
    },
    youtube: generateShopeeUniversalLink({
      shopId,
      itemId,
      affiliateId,
      channel: 'ytb',
      subId: `${subId}_ytb`,
    }),
    instagram: generateShopeeUniversalLink({
      shopId,
      itemId,
      affiliateId,
      channel: 'ig',
      subId: `${subId}_ig`,
    }),
    zalo: generateShopeeUniversalLink({
      shopId,
      itemId,
      affiliateId,
      channel: 'zalo',
      subId: `${subId}_zalo`,
    }),
  };
}
