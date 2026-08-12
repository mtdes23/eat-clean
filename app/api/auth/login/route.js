import { NextResponse } from "next/server";
const { login } = require("../../lib/auth");

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email va mat khau la bat buoc" }, { status: 400 });
    }
    const user = await login(email, password);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
