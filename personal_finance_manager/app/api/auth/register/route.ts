import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and Password are required" },
      { status: 400 }
    );
  }

  try {
<<<<<<< HEAD
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
=======
    const res = await fetch("http://localhost:5000/api/register", {
>>>>>>> f8059cb83b79031ce374bda77a5a47ea76f4d828
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    const setCookie = res.headers.get("set-cookie");
    const headers: Record<string, string> = {};
    if (setCookie) headers["Set-Cookie"] = setCookie;
    return NextResponse.json(data, { status: res.status, headers });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
