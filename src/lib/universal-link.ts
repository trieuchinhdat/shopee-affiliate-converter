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

/**
 * Safely parses any raw Shopee Facebook link to extract its security token & signature payload
 */
export function parseFacebookPayload(rawUrl: string): FacebookTemplatePayload | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  try {
    const formatted = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    const url = new URL(formatted);
    const params = url.searchParams;

    const encryptedPayload = params.get('encrypted_payload');
    const fbContentId = params.get('fb_content_id');

    if (!encryptedPayload || !fbContentId) {
      return null;
    }

    return {
      encryptedPayload,
      fbContentId,
      gadsTSig: params.get('gads_t_sig') || undefined,
      utmCampaign: params.get('utm_campaign') || `id_fb-fbcontent_${encryptedPayload}`,
      expGroup: params.get('exp_group') || 'rollout',
      contentType: params.get('content_type') || 'REELS',
      contentSource: params.get('content_source') || 'fb',
    };
  } catch (err) {
    console.error('[UniversalLink] Error parsing Facebook sample URL:', err);
    return null;
  }
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
      mmp_pid: affiliateId,
      utm_source: affiliateId,
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
    mmp_pid: affiliateId,
    utm_source: affiliateId,
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
