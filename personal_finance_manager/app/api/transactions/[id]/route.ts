import { NextRequest, NextResponse } from "next/server";

//This file is for transactions end points with id
export async function PUT(
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const cookie = request.headers.get("cookie") || "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${id}`, {
      method: "PUT",
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
      { message: "Failed to proxy transactions PUT" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  try {
    const cookie = request.headers.get("cookie") || "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${id}`, {
      method: "DELETE",
      headers: { cookie }
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
      { message: "Failed to proxy transactions DELETE" },
      { status: 500 }
    );
  }
}
