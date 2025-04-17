import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.json("", { status: 200 });
  response.cookies.delete("d-token");
  return response;
}
