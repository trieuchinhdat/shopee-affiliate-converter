import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearSanityCache } from '@/lib/sanityCache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const secret = req.nextUrl.searchParams.get('secret') || body.secret;

    const adminSecret = process.env.ADMIN_REVALIDATE_SECRET || 'shopee_aff_secret_revalidate_2025';

    if (secret && secret !== adminSecret) {
      return NextResponse.json({ success: false, error: 'Invalid secret token' }, { status: 401 });
    }

    // 1. Clear in-memory TTL cache
    clearSanityCache();

    // 2. Revalidate Next.js Static / ISR pages
    revalidatePath('/', 'page');
    revalidatePath('/huong-dan', 'page');
    revalidatePath('/faq', 'page');
    revalidatePath('/an-toan', 'page');
    revalidatePath('/chinh-sach-bao-mat', 'page');

    return NextResponse.json({
      success: true,
      message: 'Đã làm tươi bộ đệm Cache và cập nhật trang chủ thành công!',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API Revalidate] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
