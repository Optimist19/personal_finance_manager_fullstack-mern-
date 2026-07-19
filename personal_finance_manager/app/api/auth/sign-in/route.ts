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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (res?.statusText === "Unauthorized") {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    const data = await res.json();

    const setCookie = res.headers.get("set-cookie");
    const headers: Record<string, string> = {};
    if (setCookie) headers["Set-Cookie"] = setCookie;
    return NextResponse.json(data, { status: res.status, headers });
  } catch (error) {
    // console.log(error, "error")
    // const message =
    //   error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
