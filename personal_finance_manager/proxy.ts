import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get("connect.sid");
  if (!isLoggedIn && request.nextUrl.pathname !== "/register") {
    return NextResponse.redirect(new URL("/register", request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/"] };

//Correct too
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export function proxy(request: NextRequest) {
//   const isLoggedIn = request.cookies.get("connect.sid")
//   const { pathname } = request.nextUrl

//   const publicRoutes = ["/register", "/sign-in"]

//   if (!isLoggedIn && !publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/sign-in", request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next|static|favicon.ico).*)",
//   ],
// }
