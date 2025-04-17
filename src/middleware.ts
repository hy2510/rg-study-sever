import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("d-token");
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(`${request.nextUrl.origin}/signin`);
    }
  } else if (pathname === "/signin") {
    if (!!token) {
      return NextResponse.redirect(`${request.nextUrl.origin}/`);
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/signin"],
};
