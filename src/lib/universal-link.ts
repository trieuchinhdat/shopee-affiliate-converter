export interface GenerateLinkParams {
  shopId: string;
  itemId: string;
  affiliateId: string;
  channel: 'fb' | 'ig' | 'ytb' | 'zalo';
  subId?: string;
}

export function generateShopeeUniversalLink({
  shopId,
  itemId,
  affiliateId,
  channel,
  subId = 'web_converter',
}: GenerateLinkParams): string {
  const baseUrl = `https://shopee.vn/universal-link/product/${shopId}/${itemId}`;
  
  const params = new URLSearchParams({
    channel_type: channel,
    mmp_pid: affiliateId,
    utm_source: affiliateId,
    utm_medium: 'affiliates',
    utm_campaign: `app_${channel}`,
    utm_content: subId,
    uls_trackid: Math.random().toString(36).substring(2, 12),
  });

  return `${baseUrl}?${params.toString()}`;
}

export function generateAllUniversalLinks(
  shopId: string,
  itemId: string,
  affiliateId: string,
  subId: string = 'web_converter'
) {
  return {
    facebook: {
      fb22: generateShopeeUniversalLink({ shopId, itemId, affiliateId, channel: 'fb', subId: `${subId}_fb22` }),
      fb20: generateShopeeUniversalLink({ shopId, itemId, affiliateId, channel: 'fb', subId: `${subId}_fb20` }),
    },
    youtube: generateShopeeUniversalLink({ shopId, itemId, affiliateId, channel: 'ytb', subId: `${subId}_ytb` }),
    instagram: generateShopeeUniversalLink({ shopId, itemId, affiliateId, channel: 'ig', subId: `${subId}_ig` }),
    zalo: generateShopeeUniversalLink({ shopId, itemId, affiliateId, channel: 'zalo', subId: `${subId}_zalo` }),
  };
}
