import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const type = payload.message?.type ?? payload.type;

  if (type === "end-of-call-report") {
    const call = payload.message?.call ?? payload.call;
    const artifact = payload.message?.artifact ?? payload.artifact;
    const assistantId = call?.assistantId;

    if (!assistantId) {
      return NextResponse.json({ ok: true });
    }

    const contractor = await prisma.contractor.findFirst({
      where: { vapiAssistantId: assistantId },
    });

    if (!contractor) {
      return NextResponse.json({ ok: true });
    }

    const existing = call?.id
      ? await prisma.call.findUnique({ where: { vapiCallId: call.id } })
      : null;

    if (existing) {
      await prisma.call.update({
        where: { id: existing.id },
        data: {
          durationSec: call?.endedAt
            ? Math.round(
                (new Date(call.endedAt).getTime() -
                  new Date(call.startedAt ?? call.createdAt).getTime()) /
                  1000
              )
            : undefined,
          transcript: artifact?.transcript ?? undefined,
          summary: artifact?.summary ?? payload.message?.summary ?? undefined,
          endedReason: call?.endedReason,
        },
      });
    } else {
      await prisma.call.create({
        data: {
          contractorId: contractor.id,
          vapiCallId: call?.id,
          direction: "inbound",
          durationSec: call?.duration,
          transcript: artifact?.transcript,
          summary: artifact?.summary ?? payload.message?.summary,
          endedReason: call?.endedReason,
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
