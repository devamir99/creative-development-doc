import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { i18nConfig } from "@/lib/i18n";

const i18nProxy = createI18nMiddleware(i18nConfig);

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = request.nextUrl;

  // Legacy docs always land on English (deterministic, permanent).
  if (pathname === "/docs" || pathname.startsWith("/docs/")) {
    return NextResponse.redirect(
      new URL(`/en${pathname}${search}`, request.url),
      308,
    );
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/en${search}`, request.url), 308);
  }

  return i18nProxy(request, event);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
