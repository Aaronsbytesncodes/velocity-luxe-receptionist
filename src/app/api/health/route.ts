import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        error: "DATABASE_URL is not set in Vercel environment variables",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    const count = await prisma.contractor.count();
    return NextResponse.json({
      ok: true,
      database: "connected",
      contractors: count,
      appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database connection failed";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
