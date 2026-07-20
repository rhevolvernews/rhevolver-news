import { NextResponse } from "next/server";
import { getSystemStatus } from "@/lib/features";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getSystemStatus();
  const essentialReady = status.supabase && status.admin;

  return NextResponse.json(
    {
      ok: essentialReady,
      service: "Rhevolver.news",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      integrations: {
        supabase: status.supabase ? "ready" : "missing",
        admin: status.admin ? "ready" : "missing",
        analytics: status.analytics ? "ready" : "pending",
        facebook: status.facebook ? "ready" : "pending",
        ai: status.ai ? "ready" : "pending",
      },
    },
    { status: essentialReady ? 200 : 503 }
  );
}
