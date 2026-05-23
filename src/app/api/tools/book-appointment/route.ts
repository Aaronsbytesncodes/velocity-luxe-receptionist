import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { createBooking } from "@/lib/calcom";
import { notifyContractorNewLead } from "@/lib/notify";
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
  const slotStart = args.slotStart as string;
  const callerName = args.callerName as string;
  const callerPhone = args.callerPhone as string;
  const address = (args.address as string) ?? undefined;
  const serviceType = (args.serviceType as string) ?? undefined;
  const urgency = (args.urgency as string) ?? "routine";
  const notes = (args.notes as string) ?? undefined;

  const contractor = await prisma.contractor.findUnique({
    where: { id: contractorId },
  });

  if (!contractor) {
    return toolResponse(payload, { success: false, message: "Contractor not found" });
  }

  if (!isTrialActive(contractor.trialEndsAt, contractor.status)) {
    return toolResponse(payload, {
      success: false,
      message: "Trial ended. We'll have someone call you back.",
    });
  }

  let appointmentAt = new Date(slotStart);

  if (contractor.calcomApiKey && contractor.calcomEventTypeId) {
    try {
      await createBooking(
        contractor.calcomApiKey,
        contractor.calcomEventTypeId,
        slotStart,
        {
          name: callerName,
          email: `lead+${Date.now()}@velocityluxemedia.com`,
          phone: callerPhone,
        },
        [serviceType, address, urgency, notes].filter(Boolean).join(" | ")
      );
    } catch (e) {
      console.error("Cal.com booking:", e);
    }
  }

  const call = await prisma.call.create({
    data: {
      contractorId,
      vapiCallId: payload.message?.call?.id,
      direction: "inbound",
    },
  });

  const lead = await prisma.lead.create({
    data: {
      contractorId,
      callerName,
      callerPhone,
      address,
      serviceType,
      urgency,
      notes,
      status: "booked",
      appointmentAt,
      callId: call.id,
    },
  });

  await notifyContractorNewLead({
    businessName: contractor.businessName,
    contractorPhone: contractor.phone,
    contractorEmail: contractor.email,
    lead,
  });

  return toolResponse(payload, {
    success: true,
    message: `You're booked for ${appointmentAt.toLocaleString()}. We'll see you then.`,
    leadId: lead.id,
  });
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
