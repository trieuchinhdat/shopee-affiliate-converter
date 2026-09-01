/**
 * Telegram Notification Helper for Shopee Affiliate Converter
 */

export function formatVietnamTime(date = new Date()): string {
  try {
    // Format to HH:mm:ss - DD/MM/YYYY in Asia/Ho_Chi_Minh timezone
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

    return `${hour}:${minute}:${second} - ${day}/${month}/${year}`;
  } catch {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }
}

export function parseDevice(userAgent: string): string {
  if (!userAgent) return 'Không xác định';

  const ua = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/i.test(ua)) {
    return 'Mobile (iOS)';
  }
  if (/android/i.test(ua)) {
    return 'Mobile (Android)';
  }
  if (/macintosh|mac os x/i.test(ua)) {
    return 'Desktop (macOS)';
  }
  if (/windows/i.test(ua)) {
    return 'Desktop (Windows)';
  }
  if (/linux/i.test(ua)) {
    return 'Desktop (Linux)';
  }
  if (/mobile/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

export function parseLocation(headers: Headers): string {
  const city = headers.get('x-vercel-ip-city') || headers.get('cf-ipcity');
  const region = headers.get('x-vercel-ip-country-region') || headers.get('cf-region');
  const country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || 'VN';

  if (city) {
    try {
      const decodedCity = decodeURIComponent(city);
      return `${decodedCity}, ${country}`;
    } catch {
      return `${city}, ${country}`;
    }
  }

  if (region) {
    return `${region}, ${country}`;
  }

  return country === 'VN' ? 'Việt Nam' : country;
}

export function maskIp(ip: string): string {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return '127.0.0.1';

  // IPv4 masking: 113.161.22.45 -> 113.161.x.x
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.x.x`;
  }

  return ip;
}

export function isBotUserAgent(userAgent: string): boolean {
  if (!userAgent) return false;
  const botPattern = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|whatsapp|slackbot|telegrambot|curl|postman|python-requests|headlesschrome/i;
  return botPattern.test(userAgent);
}

export async function sendTelegramMessage(
  token: string,
  chatId: string,
  message: string
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
