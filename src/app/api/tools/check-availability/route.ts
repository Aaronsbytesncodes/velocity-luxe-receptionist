import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots, formatSlotsForVoice } from "@/lib/calcom";
import { isTrialActive } from "@/lib/trial";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const args =
    payload.message?.toolCallList?.[0]?.function?.arguments ??
    payload.toolCall?.parameters ??
    payload;

  const contractorId =
    (args.contractorId as string) ??
    req.nextUrl.searchParams.get("contractorId") ??
    "";
  const dateStr = (args.date as string) ?? format(new Date(), "yyyy-MM-dd");

  const contractor = await prisma.contractor.findUnique({
    where: { id: contractorId },
  });

  if (!contractor) {
    return toolResponse(payload, { error: "Contractor not found", slots: [] });
  }

  if (!isTrialActive(contractor.trialEndsAt, contractor.status)) {
    return toolResponse(payload, {
      error: "Trial expired",
      slots: [],
      message: "Please contact the office directly.",
    });
  }

  if (!contractor.calcomApiKey || !contractor.calcomEventTypeId) {
    return toolResponse(payload, {
      slots: ["Tomorrow at 9:00 AM", "Tomorrow at 2:00 PM", "Day after at 10:00 AM"],
      note: "Demo slots — connect Cal.com in onboarding for live availability.",
    });
  }

  try {
    const day = parseISO(dateStr);
    const from = startOfDay(day).toISOString();
    const to = addDays(startOfDay(day), 1).toISOString();

    const slots = await getAvailableSlots(
      contractor.calcomApiKey,
      contractor.calcomEventTypeId,
      from,
      to
    );

    const formatted = formatSlotsForVoice(slots);

    return toolResponse(payload, {
      slots: formatted.length ? formatted : [],
      message:
        formatted.length === 0
          ? "No openings that day. Ask if another day works."
          : `Available: ${formatted.join(", ")}`,
    });
  } catch (e) {
    console.error(e);
    return toolResponse(payload, {
      error: "Could not load calendar",
      slots: [],
    });
  }
}

function toolResponse(
  payload: { message?: { toolCallList?: { id: string }[] } },
  result: object
) {
  const toolCallId = payload.message?.toolCallList?.[0]?.id;

  if (toolCallId) {
    return NextResponse.json({
      results: [{ toolCallId, result: JSON.stringify(result) }],
    });
  }

  return NextResponse.json(result);
}
