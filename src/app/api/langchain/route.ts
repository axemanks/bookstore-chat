import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const message = await request.json()
  // check for data
  if (!message) return new NextResponse("No data received")
  
  const res = "Hello Keith!"
  return NextResponse.json(res)
}