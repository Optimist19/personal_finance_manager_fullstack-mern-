import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const res = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || ""
      }
    });

    const data = await res.json();

    // Forward cookie removal to browser
    const setCookie = res.headers.get("set-cookie");
    const headers: Record<string, string> = {};
    if (setCookie) headers["Set-Cookie"] = setCookie;

    return NextResponse.json(data, { status: res.status, headers });
  } catch {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
