import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
      headers: { cookie }
    });
    const result = await data.json();
    if (!data.ok) {
      return NextResponse.json(
        { message: result.message || "Failed to fetch transactions" },
        { status: result.status }
      );
    }
    return NextResponse.json(result, { status: data.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookie = request.headers.get("cookie") || "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }

    const setCookie = res.headers.get("set-cookie");
    const headers: Record<string, string> = {};
    if (setCookie) headers["Set-Cookie"] = setCookie;

    return NextResponse.json(data, { status: res.status, headers });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to proxy transactions POST" },
      { status: 500 }
    );
  }
}
