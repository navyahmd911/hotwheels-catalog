import { NextResponse } from "next/server"

export async function POST(req) {
  const { username, password } = await req.json()

  const ADMIN_USER = process.env.ADMIN_USERNAME
  const ADMIN_PASS = process.env.ADMIN_PASSWORD

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, message: "Username atau password salah" },
    { status: 401 }
  )
}