/**
 * Telegram Notification Helper for Shopee Affiliate Converter
 */

// Vietnamese City Map for standardizing GeoIP names from Edge CDN (Vercel / Cloudflare)
const VN_CITIES_MAP: Record<string, string> = {
  hanoi: 'Hà Nội',
  'ha noi': 'Hà Nội',
  'ho chi minh': 'TP. Hồ Chí Minh',
  'ho chi minh city': 'TP. Hồ Chí Minh',
  saigon: 'TP. Hồ Chí Minh',
  'da nang': 'Đà Nẵng',
  danang: 'Đà Nẵng',
  'hai phong': 'Hải Phòng',
  haiphong: 'Hải Phòng',
  'can tho': 'Cần Thơ',
  cantho: 'Cần Thơ',
  'binh duong': 'Bình Dương',
  'dong nai': 'Đồng Nai',
  'bac ninh': 'Bắc Ninh',
  'quang ninh': 'Quảng Ninh',
  'nghe an': 'Nghệ An',
  'thanh hoa': 'Thanh Hóa',
  'thua thien hue': 'Huế',
  hue: 'Huế',
  'khanh hoa': 'Khánh Hòa',
  'nha trang': 'Nha Trang',
  'vung tau': 'Vũng Tàu',
  'ba ria - vung tau': 'Vũng Tàu',
  'lam dong': 'Lâm Đồng',
  'da lat': 'Đà Lạt',
  dalat: 'Đà Lạt',
};

export function formatVietnamTime(date = new Date()): string {
  try {
    // Format to HH:mm:ss · DD/MM/YYYY in Asia/Ho_Chi_Minh timezone
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');
    const day = getPart('day');
    const month = getPart('month');
    const year = getPart('year');

    return `${hour}:${minute}:${second} · ${day}/${month}/${year}`;
  } catch {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }
}

export function parseDevice(userAgent: string): string {
  if (!userAgent) return 'Không xác định';

  const ua = userAgent.toLowerCase();

  // Check In-App Browser context (critical for affiliate channel analytics)
  const isZalo = ua.includes('zalo');
  const isFb = /fbav|fban|fb_iab|facebook/i.test(ua);
  const isTikTok = ua.includes('tiktok');

  const appTag = isZalo ? ' (Zalo)' : isFb ? ' (FB App)' : isTikTok ? ' (TikTok)' : '';

  if (/iphone|ipad|ipod/i.test(ua)) {
    return `iOS${appTag}`;
  }
  if (/android/i.test(ua)) {
    return `Android${appTag}`;
  }
  if (/macintosh|mac os x/i.test(ua)) {
    return 'macOS';
  }
  if (/windows/i.test(ua)) {
    return 'Windows';
  }
  if (/linux/i.test(ua)) {
    return 'Linux';
  }
  if (/mobile/i.test(ua)) {
    return `Mobile${appTag}`;
  }
  return 'Desktop';
}

export function parseLocation(headers: Headers): string {
  const rawCity = headers.get('x-vercel-ip-city') || headers.get('cf-ipcity');
  const region = headers.get('x-vercel-ip-country-region') || headers.get('cf-region');
  const country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || 'VN';

  if (rawCity) {
    try {
      const decodedCity = decodeURIComponent(rawCity).trim();
      const lookupKey = decodedCity.toLowerCase();
      const prettyCity = VN_CITIES_MAP[lookupKey] || decodedCity;
      return `${prettyCity}, ${country}`;
    } catch {
      const lookupKey = rawCity.toLowerCase().trim();
      const prettyCity = VN_CITIES_MAP[lookupKey] || rawCity;
      return `${prettyCity}, ${country}`;
    }
  }

  if (region) {
    const lookupKey = region.toLowerCase().trim();
    const prettyRegion = VN_CITIES_MAP[lookupKey] || region;
    return `${prettyRegion}, ${country}`;
  }

  return country === 'VN' ? 'Việt Nam' : country;
}

export function maskIp(ip: string): string {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return '127.0.0.1';

  // IPv4 masking: 113.161.22.45 -> 113.161.x.x
  const ipv4Parts = ip.split('.');
  if (ipv4Parts.length === 4) {
    return `${ipv4Parts[0]}.${ipv4Parts[1]}.x.x`;
  }

  // IPv6 masking: 2402:800:61cd:1234:... -> 2402:800:xxxx:xxxx::
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length >= 4) {
    return `${ipv6Parts[0]}:${ipv6Parts[1]}:xxxx:xxxx::`;
  }

  return ip;
}

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function truncateProductName(name: string, maxLength = 50): string {
  if (!name) return 'Sản phẩm Shopee';
  const clean = name.trim().replace(/\s+/g, ' ');
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '...';
}

export function isBotUserAgent(userAgent: string): boolean {
  if (!userAgent) return false;
  const botPattern = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|whatsapp|slackbot|telegrambot|curl|postman|python-requests|headlesschrome/i;
  return botPattern.test(userAgent);
}

export async function sendTelegramMessage(
  token: string,
  chatId: string,
  message: string,
  parseMode: 'HTML' | 'MarkdownV2' = 'HTML'
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token || !chatId) {
      return { success: false, error: 'Thiếu Token hoặc Chat ID' };
    }

    const cleanToken = token.trim();
    const cleanChatId = chatId.trim();

    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
      // Set 4 second timeout so it never hangs
      signal: AbortSignal.timeout(4000),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      console.error('[Telegram API] Failed to send message:', data);
      return { success: false, error: data.description || 'Lỗi Telegram API' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Telegram API] Error dispatching message:', err);
    return { success: false, error: err.message || 'Lỗi kết nối Telegram' };
  }
}

