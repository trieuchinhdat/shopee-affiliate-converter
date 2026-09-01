'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'custom' | 'all'>('7days');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const fetchStats = useCallback(
    async (
      targetPeriod = period,
      targetPage = page,
      targetSearch = searchTerm,
      targetStart = startDate,
      targetEnd = endDate
    ) => {
      setIsLoading(true);
      try {
        const authRes = await fetch('/api/auth/check');
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push('/login');
          return;
        }

        const queryParams = new URLSearchParams({
          period: targetPeriod,
          page: targetPage.toString(),
          limit: '15',
          search: targetSearch,
        });

        if (targetPeriod === 'custom') {
          queryParams.set('startDate', targetStart);
          queryParams.set('endDate', targetEnd);
        }

        const res = await fetch(`/api/admin/stats?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [period, page, searchTerm, startDate, endDate, router]
  );

  useEffect(() => {
    fetchStats(period, page, searchTerm, startDate, endDate);
  }, [period, page, searchTerm, fetchStats, startDate, endDate]);

  const handlePeriodChange = (newPeriod: 'today' | '7days' | '30days' | 'custom' | 'all') => {
    setPeriod(newPeriod);
    setPage(1);
  };

  const handleCustomDateApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPeriod('custom');
    setPage(1);
    fetchStats('custom', 1, searchTerm, startDate, endDate);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(1);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleExportCSV = () => {
    if (!stats?.recentConversions || stats.recentConversions.length === 0) {
      alert('Không có dữ liệu để xuất file.');
      return;
    }

    const headers = ['STT', 'Ten San Pham', 'Shop ID', 'Item ID', 'Thiet Bi', 'Thoi Gian', 'Affiliate ID'];
    const rows = stats.recentConversions.map((log: any, index: number) => [
      index + 1,
      `"${(log.productName || 'Sản phẩm Shopee').replace(/"/g, '""')}"`,
      log.shopId || '',
      log.itemId || '',
      log.device || 'Mobile',
      log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '',
      log.affiliateIdUsed || '',
    ]);

    const csvRows = [headers.join(','), ...rows.map((e: any[]) => e.join(','))];
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shopee_affiliate_logs_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = stats?.pagination?.totalPages || 1;
  const totalItems = stats?.pagination?.totalItems || 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-16">
      {/* Top Admin Header (Mobile Optimized) */}
      <header className="border-b border-white/10 bg-[#111827] px-3 sm:px-4 py-2.5 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Top row: Title and status */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="font-bold text-white tracking-wide text-sm sm:text-base">
              QUẢN TRỊ THỐNG KÊ
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full sm:hidden">
              Online
            </span>
          </div>

          {/* Action buttons (Touch-friendly on mobile) */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
            <Link
              href="/"
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Trang Chủ
            </Link>
            <button
              onClick={() => fetchStats(period, page, searchTerm, startDate, endDate)}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isLoading ? '...' : 'Làm mới'}
            </button>
            <Link
              href="/studio"
              className="px-2.5 py-1.5 rounded-lg bg-orange-600 text-xs font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Sanity Studio
            </Link>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-300 hover:bg-rose-500/20 hover:text-white transition-colors"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 pt-4 space-y-4">
        {/* 6 Core Management Modules Quick Links */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 sm:p-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Các Mục Quản Trị Hệ Thống
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Link
              href="/studio/structure/appConfig"
              className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="text-xs font-bold text-white">Cài đặt hệ thống</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Mã Affiliate, Zalo URL</div>
            </Link>

            <Link
              href="/studio/structure/themeConfig"
              className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="text-xs font-bold text-white">Cài đặt giao diện</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Logo, hình nền, màu sắc</div>
            </Link>

            <Link
              href="/studio/structure/voucher"
              className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="text-xs font-bold text-white">Quản lý voucher</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Mã giảm FB, YTB, Zalo</div>
            </Link>

            <Link
              href="/studio/structure/adminUser"
              className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="text-xs font-bold text-white">Quản lý user</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Tài khoản & mật khẩu</div>
            </Link>

            <Link
              href="/studio/structure/conversionLog"
              className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="text-xs font-bold text-white">Lịch sử convert</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{stats?.totalConversions || 0} lượt dán link</div>
            </Link>

            <Link
              href="/studio/structure/clickTrack"
              className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all"
            >
              <div className="text-xs font-bold text-white">Lượt click</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{stats?.totalClicks || 0} click (CTR {stats?.ctr || '0.0%'})</div>
            </Link>
          </div>
        </div>

        {/* Time-Range Filter Tabs with Custom Date Range (Mobile Optimized) */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 mr-0.5">Lọc kỳ:</span>
              <button
                onClick={() => handlePeriodChange('today')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === 'today'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Hôm Nay
              </button>
              <button
                onClick={() => handlePeriodChange('7days')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === '7days'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                7 Ngày
              </button>
              <button
                onClick={() => handlePeriodChange('30days')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === '30days'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                30 Ngày
              </button>
              <button
                onClick={() => handlePeriodChange('custom')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === 'custom'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Tùy Chọn Ngày
              </button>
              <button
                onClick={() => handlePeriodChange('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === 'all'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Tất Cả
              </button>
            </div>

            {stats?.appConfig && (
              <div className="text-xs text-slate-400">
                ID: <span className="font-mono font-bold text-orange-400">{stats.appConfig.affiliateId || 'an_17387060372'}</span>
              </div>
            )}
          </div>

          {/* Custom Date Inputs (Appears when Tùy Chọn Ngày is active) */}
          {period === 'custom' && (
            <form onSubmit={handleCustomDateApply} className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span>Từ:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span>Đến:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Áp Dụng
              </button>
            </form>
          )}
        </div>

        {/* 4 Main Metrics (Updated dynamically by filter) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Lượt Dán Link</div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {stats?.totalConversions || 0}
            </div>
            <div className="text-[10px] text-slate-500">Trong kỳ đã chọn</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Lượt Click Mở App</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">
              {stats?.totalClicks || 0}
            </div>
            <div className="text-[10px] text-slate-500">Tổng số lượt bấm nút</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Tỉ Lệ CTR</div>
            <div className="text-xl sm:text-2xl font-bold text-orange-400">
              {stats?.ctr || '0.0%'}
            </div>
            <div className="text-[10px] text-slate-500">Click / Lượt dán</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111827] p-3 space-y-0.5">
            <div className="text-[11px] text-slate-400 font-medium">Trạng Thái CMS</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400">
              Hoạt Động
            </div>
            <div className="text-[10px] text-slate-500">Sanity Cloud API</div>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 sm:p-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Phân Bổ Lượt Click Theo Kênh
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 space-y-0.5">
              <div className="text-[11px] text-slate-400">Mã FB 22%</div>
              <div className="text-lg font-bold text-white">
                {stats?.channelCounts?.fb_22 || 0}
              </div>
            </div>

            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 space-y-0.5">
              <div className="text-[11px] text-slate-400">Mã FB 20%</div>
              <div className="text-lg font-bold text-white">
                {stats?.channelCounts?.fb_20 || 0}
              </div>
            </div>

            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 space-y-0.5">
              <div className="text-[11px] text-slate-400">Mã YouTube 20%</div>
              <div className="text-lg font-bold text-white">
                {stats?.channelCounts?.ytb || 0}
              </div>
            </div>

            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 space-y-0.5">
              <div className="text-[11px] text-slate-400">Mã IG / Zalo / Khác</div>
              <div className="text-lg font-bold text-white">
                {(stats?.channelCounts?.ig || 0) + (stats?.channelCounts?.zalo || 0) + (stats?.channelCounts?.other || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Trending Products */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              🔥 Top 5 Sản Phẩm Được Quan Tâm Nhất (Trending)
            </div>
            <span className="text-[10px] text-slate-500">
              Theo số lượt dán link
            </span>
          </div>

          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="space-y-1.5">
              {stats.topProducts.map((p: any, idx: number) => (
                <div
                  key={`${p.shopId}_${p.itemId}`}
                  className="flex items-center justify-between gap-2.5 rounded-lg bg-white/[0.03] border border-white/5 p-2 hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-bold text-[10px] ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : idx === 1
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>

                    {p.imageUrl && (
                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded bg-black/30">
                        <Image src={p.imageUrl} alt="" fill className="object-cover" unoptimized />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate" title={p.name}>
                        {p.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        {p.shopId} / {p.itemId}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-[11px] font-bold text-orange-400 border border-orange-500/30">
                      {p.count} lượt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3 text-center text-xs text-slate-500">
              Chưa có dữ liệu sản phẩm trending trong kỳ này.
            </div>
          )}
        </div>

        {/* Paginated Conversion Logs Feed */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-3 sm:p-4 space-y-3">
          {/* Header Controls: Search & CSV Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Nhật Ký Dán Link ({totalItems} lượt)
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm sản phẩm / ID..."
                  className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 w-full sm:w-44"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Tìm
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Xóa
                  </button>
                )}
              </form>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                title="Tải file Excel/CSV danh sách này"
              >
                Xuất File CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[500px] sm:min-w-0">
              <thead className="border-b border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="pb-2">Sản Phẩm</th>
                  <th className="pb-2">Shop ID / Item ID</th>
                  <th className="pb-2">Thiết Bị</th>
                  <th className="pb-2 text-right">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentConversions && stats.recentConversions.length > 0 ? (
                  stats.recentConversions.map((log: any) => (
                    <tr key={log._id} className="hover:bg-white/[0.02]">
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2 max-w-[200px] sm:max-w-sm">
                          {log.imageUrl && (
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded bg-black/20">
                              <Image
                                src={log.imageUrl}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <span className="truncate font-medium text-slate-200" title={log.productName}>
                            {log.productName || 'Sản phẩm Shopee'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 font-mono text-[11px] text-slate-400">
                        {log.shopId} / {log.itemId}
                      </td>
                      <td className="py-2 pr-3">
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                          {log.device || 'Mobile'}
                        </span>
                      </td>
                      <td className="py-2 text-right text-slate-400 font-mono text-[10px] sm:text-[11px]">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                            })
                          : ''}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có lượt dán link nào trong kỳ này.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1 || isLoading}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 font-medium text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              ← Trước
            </button>

            <span className="text-slate-400 font-mono text-xs">
              Trang <b className="text-white">{page}</b> / {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages || isLoading}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 font-medium text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Sau →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
