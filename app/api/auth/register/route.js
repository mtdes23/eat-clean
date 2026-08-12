import { NextResponse } from "next/server";
const { register } = require("../../../../lib/auth");

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email va mat khau la bat buoc" }, { status: 400 });
    }
    const user = await register(email, password, name);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
