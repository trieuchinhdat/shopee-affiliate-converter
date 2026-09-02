import { AffipadAccount, AffipadQuotaInfo } from './types';

interface CachedProductLink {
  link: string;
  shortUrl?: string;
  expiresAt: number;
}

// Global In-Memory Cache for converted product links (Key: shopId_itemId)
const productLinkCache = new Map<string, CachedProductLink>();

// Tracks depleted/failed accounts with a cool-down timestamp to skip them in 0ms
const depletedAccounts = new Map<string, number>();

class AffipadService {
  private roundRobinIdx = 0;

  /**
   * Helper: Cache key for a product
   */
  private getCacheKey(shopId: string, itemId: string): string {
    return `${shopId}_${itemId}`;
  }

  /**
   * Cleans expired cache entries periodically
   */
  private cleanExpiredCache() {
    const now = Date.now();
    productLinkCache.forEach((val, key) => {
      if (val.expiresAt <= now) {
        productLinkCache.delete(key);
      }
    });
  }

  /**
   * Converts a Shopee product URL into an official affiliate link using the AffiPad Multi-Account Pool.
   * Features:
   * 1. Smart Product Cache (returns in 0ms, 0 quota used).
   * 2. Round-robin load balancing across active accounts.
   * 3. Automatic failover if an account hits quota limit (429) or errors.
   */
  public async convertProductUrl(
    targetUrl: string,
    shopId: string,
    itemId: string,
    accounts: AffipadAccount[],
    cacheTtlHours: number = 12
  ): Promise<{ link: string; shortUrl?: string; fromCache: boolean } | null> {
    if (!targetUrl || !shopId || !itemId) return null;

    // 1. Check Smart Cache first (Saves Quota!)
    const cacheKey = this.getCacheKey(shopId, itemId);
    const cached = productLinkCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return {
        link: cached.link,
        shortUrl: cached.shortUrl,
        fromCache: true,
      };
    }

    // Filter valid, enabled accounts
    const activeAccounts = (accounts || []).filter(
      (acc) => acc.isActive !== false && acc.apiKey && acc.toolId && acc.apiKey.trim() && acc.toolId.trim()
    );

    if (activeAccounts.length === 0) {
      return null;
    }

    // Filter out accounts currently marked as depleted
    const availableAccounts = activeAccounts.filter((acc) => {
      const depletedUntil = depletedAccounts.get(acc.toolId);
      if (depletedUntil && depletedUntil > now) {
        return false;
      }
      return true;
    });

    // If all accounts are marked as depleted, reset and try all active accounts as fallback
    const candidateAccounts = availableAccounts.length > 0 ? availableAccounts : activeAccounts;

    // 2. Select starting account via Round-Robin
    this.roundRobinIdx = (this.roundRobinIdx + 1) % candidateAccounts.length;
    const orderedAccounts = [
      ...candidateAccounts.slice(this.roundRobinIdx),
      ...candidateAccounts.slice(0, this.roundRobinIdx),
    ];

    // 3. Try conversion with Auto-Failover
    for (const account of orderedAccounts) {
      try {
        const result = await this.callAffipadConvert(targetUrl, account);
        if (result && result.link) {
          // Store in Smart Cache
          const ttlMs = Math.max(1, cacheTtlHours) * 60 * 60 * 1000;
          productLinkCache.set(cacheKey, {
            link: result.link,
            shortUrl: result.shortUrl,
            expiresAt: Date.now() + ttlMs,
          });

          this.cleanExpiredCache();

          return {
            link: result.link,
            shortUrl: result.shortUrl,
            fromCache: false,
          };
        }
      } catch (err: any) {
        console.error(`[AffipadService] Error converting with toolId ${account.toolId} (${account.label || 'acc'}):`, err?.message || err);

        // If Quota Exceeded (429) or Unauthorized (401), mark account as depleted for 4 hours
        if (err?.status === 429 || err?.code === 'QUOTA_EXCEEDED' || err?.status === 401) {
          depletedAccounts.set(account.toolId, Date.now() + 4 * 60 * 60 * 1000);
        }
        // Continue to the next account in the pool
      }
    }

    return null;
  }

  /**
   * Internal API caller to POST https://api.affipad.com/v1/convert
   */
  private async callAffipadConvert(
    url: string,
    account: AffipadAccount
  ): Promise<{ link: string; shortUrl?: string } | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    try {
      const res = await fetch('https://api.affipad.com/v1/convert', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          toolId: account.toolId.trim(),
          useCache: true,
          useShortLink: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errorMsg = json?.error?.message || json?.error?.code || `HTTP ${res.status}`;
        const error: any = new Error(errorMsg);
        error.status = res.status;
        error.code = json?.error?.code;
        throw error;
      }

      const results = json?.data?.results;
      if (Array.isArray(results) && results.length > 0) {
        const firstResult = results[0];
        const link = firstResult.link || firstResult.shortUrl;
        if (link) {
          return {
            link: link,
            shortUrl: firstResult.shortUrl || firstResult.link,
          };
        }
      }

      return null;
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Checks the remaining quota of all configured accounts (for the Admin Dashboard).
   */
  public async checkAllQuotas(accounts: AffipadAccount[]): Promise<AffipadQuotaInfo[]> {
    if (!accounts || accounts.length === 0) return [];

    const quotaPromises = accounts.map(async (acc, index): Promise<AffipadQuotaInfo> => {
      const apiKey = acc.apiKey?.trim() || '';
      const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}` : '••••••••';
      const label = acc.label || `Tài khoản ${index + 1}`;

      if (!acc.isActive) {
        return {
          accountId: acc.toolId || `acc_${index}`,
          label,
          apiKeyMasked: maskedKey,
          plan: 'Tắt',
          limit: 0,
          used: 0,
          remaining: 0,
          isDepleted: true,
          error: 'Tài khoản đang bị Tắt',
        };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const res = await fetch('https://api.affipad.com/v1/quota', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const json = await res.json();

        if (res.ok && json.success && json.data) {
          const quota = json.data.quota || {};
          const limit = quota.limit || 1000;
          const used = quota.used || 0;
          const remaining = quota.remaining ?? Math.max(0, limit - used);

          return {
            accountId: acc.toolId,
            label,
            apiKeyMasked: maskedKey,
            plan: json.data.plan || 'free',
            limit,
            used,
            remaining,
            isDepleted: remaining <= 0,
          };
        }

        return {
          accountId: acc.toolId,
          label,
          apiKeyMasked: maskedKey,
          plan: 'unknown',
          limit: 1000,
          used: 0,
          remaining: 0,
          isDepleted: true,
          error: json?.error?.message || `HTTP ${res.status}`,
        };
      } catch (err: any) {
        return {
          accountId: acc.toolId,
          label,
          apiKeyMasked: maskedKey,
          plan: 'unknown',
          limit: 1000,
          used: 0,
          remaining: 0,
          isDepleted: true,
          error: err?.name === 'AbortError' ? 'Timeout kiểm tra' : err?.message || 'Lỗi kết nối',
        };
      }
    });

    return Promise.all(quotaPromises);
  }
}

export const affipadService = new AffipadService();
