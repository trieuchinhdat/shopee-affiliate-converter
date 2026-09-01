import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient } from '@/sanity/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const trimmedUsername = (username || 'admin').trim();
    const trimmedPassword = (password || '').trim();

    if (!trimmedPassword) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mật khẩu.' },
        { status: 400 }
      );
    }

    // 1. Check in Sanity adminUser collection
    let matchedUser: any = null;
    try {
      matchedUser = await sanityClient.fetch<any>(
        `*[_type == "adminUser" && (username == $u || username == $u_lower) && password == $p && status == "active"][0]`,
        { u: trimmedUsername, u_lower: trimmedUsername.toLowerCase(), p: trimmedPassword }
      );
    } catch (dbErr) {
      console.error('[Auth API] Sanity user query error:', dbErr);
    }

    // 2. Fallback check with environment password (for bootstrap/initial setup)
    const fallbackPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const isFallbackMatch =
      (trimmedUsername === 'admin' || !username) && trimmedPassword === fallbackPassword;

    if (matchedUser || isFallbackMatch) {
      if (matchedUser?._id && process.env.SANITY_API_WRITE_TOKEN) {
        sanityWriteClient
          .patch(matchedUser._id)
          .set({ lastLogin: new Date().toISOString() })
          .commit()
          .catch((err) => console.error('Error updating lastLogin:', err));
      }

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: {
          username: matchedUser?.username || 'admin',
          fullName: matchedUser?.fullName || 'Quản Trị Viên',
          role: matchedUser?.role || 'admin',
        },
      });

      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
      { status: 401 }
    );
  } catch (err: any) {
    console.error('[Auth API] Login error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
