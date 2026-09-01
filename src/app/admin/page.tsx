'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings,
  Palette,
  Ticket,
  Users,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const authRes = await fetch('/api/auth/check');
      const authData = await authRes.json();
      if (!authData.authenticated) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-16">
      {/* Top Admin Header */}
      <header className="border-b border-white/10 bg-[#111827] px-3 sm:px-4 py-2.5 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Top row: Title and status */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="font-bold text-white tracking-wide text-sm sm:text-base flex items-center gap-2">
              <span>QUẢN TRỊ CMS</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Sanity Connected
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
            <Link
              href="/"
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Trang Chủ
            </Link>
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? '...' : 'Làm mới'}</span>
            </button>
            <Link
              href="/studio"
              className="px-2.5 py-1.5 rounded-lg bg-orange-600 text-xs font-semibold text-white hover:bg-orange-500 transition-colors flex items-center gap-1"
            >
              <span>Sanity Studio</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-300 hover:bg-rose-500/20 hover:text-white transition-colors flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 pt-4 space-y-4">
        {/* KPI Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Voucher Hoạt Động</div>
            <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-1.5">
              <span>{stats?.activeVouchersCount || 0}</span>
              <span className="text-xs font-normal text-slate-400">/ {stats?.totalVouchers || 0}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Sẵn sàng áp dụng</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Affiliate ID</div>
            <div className="text-base sm:text-lg font-mono font-bold text-orange-400 truncate">
              {stats?.appConfig?.affiliateId || 'an_17387060372'}
            </div>
            <div className="text-[10px] text-slate-500">Mã tiếp thị liên kết</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Tài Khoản Admin</div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {stats?.adminUsersCount || 1}
            </div>
            <div className="text-[10px] text-slate-500">Người quản trị CMS</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Trạng Thái Studio</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Hoạt Động</span>
            </div>
            <div className="text-[10px] text-slate-500">Đã tối ưu Sanity DB</div>
          </div>
        </div>

        {/* 4 Core Management Modules Quick Links */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 sm:p-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Các Mục Quản Trị Hệ Thống (Sanity Studio)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/studio/structure/appConfig"
              className="rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all flex items-start gap-3 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-105 transition-transform">
                <Settings className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>Cài đặt hệ thống</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Mã Affiliate ID, Zalo URL, Bật/Tắt & Cấu hình Bot Telegram
                </div>
              </div>
            </Link>

            <Link
              href="/studio/structure/themeConfig"
              className="rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all flex items-start gap-3 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Palette className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Cài đặt giao diện & SEO</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Logo, tiêu đề, hình nền, màu sắc, Zalo Card, Floating Widget, SEO Meta tags
                </div>
              </div>
            </Link>

            <Link
              href="/studio/structure/voucher"
              className="rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all flex items-start gap-3 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>Quản lý voucher ({stats?.totalVouchers || 0})</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Tạo mới, chỉnh sửa % giảm, mã code, kênh (FB 22%, FB 20%, YouTube, IG, Zalo)
                </div>
              </div>
            </Link>

            <Link
              href="/studio/structure/adminUser"
              className="rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all flex items-start gap-3 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>Quản lý tài khoản Admin</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Quản lý tài khoản đăng nhập, mật khẩu quản trị hệ thống
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Voucher List Overview */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-orange-400" />
              <span>Danh Sách Voucher Hiện Tại ({stats?.totalVouchers || 0})</span>
            </div>

            <Link
              href="/studio/structure/voucher"
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
            >
              <span>+ Thêm / Sửa trong Studio</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[500px] sm:min-w-0">
              <thead className="border-b border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="pb-2">Tên nút & Mã</th>
                  <th className="pb-2">Kênh</th>
                  <th className="pb-2">Mức giảm</th>
                  <th className="pb-2">Trạng thái</th>
                  <th className="pb-2 text-right">Ưu tiên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.vouchers && stats.vouchers.length > 0 ? (
                  stats.vouchers.map((v: any) => (
                    <tr key={v._id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{v.buttonLabel}</span>
                          {v.voucherCode && (
                            <span className="font-mono bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-orange-300">
                              {v.voucherCode}
                            </span>
                          )}
                          {v.isHighlighted && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-orange-500/20 border border-orange-500/30 px-1 py-0.5 text-[8px] font-bold text-orange-400">
                              <Flame className="h-2 w-2" />
                              HOT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="font-mono text-[11px] uppercase text-slate-400">
                          {v.channel}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 font-semibold text-orange-400">
                        -{v.discountPercent}%
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            v.isActive === false
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : v.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                          }`}
                        >
                          {v.isActive === false
                            ? 'Đã tắt'
                            : v.status === 'active'
                            ? 'Hoạt động'
                            : 'Hết lượt'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-400">
                        #{v.orderPriority || 1}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      Chưa có voucher nào. Hãy mở Sanity Studio để tạo voucher mới!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

