import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasSession(request: NextRequest) {
  return Boolean(
    request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("__Secure-better-auth.session_token")?.value,
  );
}

function buyerStoreMatch(pathname: string) {
  // Public URLs: /@slug/...
  const at = pathname.match(/^\/@([^/]+)(\/.*)?$/);
  if (at) return { slug: at[1], rest: at[2] ?? "" };
  // Filesystem URLs after rewrite: /s/slug/...
  const s = pathname.match(/^\/s\/([^/]+)(\/.*)?$/);
  if (s) return { slug: s[1], rest: s[2] ?? "" };
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = hasSession(request);

  const isMerchantProtected =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");
  const isPlatformAuth = pathname === "/login" || pathname === "/register";

  const storeMatch = buyerStoreMatch(pathname);
  const storeRest = storeMatch?.rest ?? "";
  const isBuyerDashboard =
    !!storeMatch && (storeRest === "/dashboard" || storeRest.startsWith("/dashboard/"));
  const isBuyerAuth =
    !!storeMatch && (storeRest === "/login" || storeRest === "/register");

  if (isMerchantProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isBuyerDashboard && !session && storeMatch) {
    const loginUrl = new URL(`/@${storeMatch.slug}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname.startsWith("/@") ? pathname : `/@${storeMatch.slug}${storeRest}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isPlatformAuth && session) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl?.startsWith("/@") || callbackUrl?.startsWith("/s/")) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isBuyerAuth && session && storeMatch) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const fallback = `/@${storeMatch.slug}/dashboard`;
    const target =
      callbackUrl?.startsWith(`/@${storeMatch.slug}`) || callbackUrl?.startsWith(`/s/${storeMatch.slug}`)
        ? callbackUrl
        : fallback;
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/@:path*",
    "/s/:path*",
  ],
};
