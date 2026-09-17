import { parseSetCookie } from "cookie";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isPrivateRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  if (!accessToken && !refreshToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  if (accessToken) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();
      const response = NextResponse.next();

      const setCookie = session.headers["set-cookie"];

      if (setCookie) {
        const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

        cookies.forEach((cookie) => {
          const parsedCookie = parseSetCookie(cookie);

          if (!parsedCookie?.value) {
            return;
          }

          response.cookies.set({
            name: parsedCookie.name,
            value: parsedCookie.value,
            ...(parsedCookie.domain && { domain: parsedCookie.domain }),
            ...(parsedCookie.expires && { expires: parsedCookie.expires }),
            ...(parsedCookie.httpOnly !== undefined && {
              httpOnly: parsedCookie.httpOnly,
            }),
            ...(parsedCookie.maxAge !== undefined && {
              maxAge: parsedCookie.maxAge,
            }),
            ...(parsedCookie.path && { path: parsedCookie.path }),
            ...(parsedCookie.partitioned !== undefined && {
              partitioned: parsedCookie.partitioned,
            }),
            ...(parsedCookie.priority && { priority: parsedCookie.priority }),
            ...(parsedCookie.sameSite && { sameSite: parsedCookie.sameSite }),
            ...(parsedCookie.secure !== undefined && {
              secure: parsedCookie.secure,
            }),
          });
        });
      }

      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return response;
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
