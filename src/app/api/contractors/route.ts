import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { trialEndDate } from "@/lib/trial";
import { createVapiAssistant, updatePhoneNumberAssistant } from "@/lib/vapi";

const signupSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  trade: z.string().min(2),
  serviceArea: z.string().optional(),
  greeting: z.string().optional(),
  calcomApiKey: z.string().optional(),
  calcomEventTypeId: z.coerce.number().optional(),
  calcomUsername: z.string().optional(),
  vapiPhoneNumberId: z.string().optional(),
  adminSecret: z.string(),
});

export async function POST(req: NextRequest) {
  const body = signupSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  if (body.data.adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.contractor.findUnique({
    where: { email: body.data.email },
  });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const vapiKey = process.env.VAPI_API_KEY;

  const contractor = await prisma.contractor.create({
    data: {
      businessName: body.data.businessName,
      contactName: body.data.contactName,
      email: body.data.email,
      phone: body.data.phone,
      trade: body.data.trade,
      serviceArea: body.data.serviceArea,
      greeting: body.data.greeting,
      calcomApiKey: body.data.calcomApiKey,
      calcomEventTypeId: body.data.calcomEventTypeId,
      calcomUsername: body.data.calcomUsername,
      vapiPhoneNumberId: body.data.vapiPhoneNumberId,
      trialEndsAt: trialEndDate(),
      status: "trial",
    },
  });

  let vapiAssistantId: string | undefined;

  if (vapiKey) {
    try {
      const assistant = await createVapiAssistant(vapiKey, {
        contractorId: contractor.id,
        businessName: body.data.businessName,
        trade: body.data.trade,
        greeting: body.data.greeting,
        serviceArea: body.data.serviceArea,
        serverUrl: appUrl.replace(/\/$/, ""),
      });
      vapiAssistantId = assistant.id;

      await prisma.contractor.update({
        where: { id: contractor.id },
        data: { vapiAssistantId },
      });

      if (body.data.vapiPhoneNumberId) {
        await updatePhoneNumberAssistant(
          vapiKey,
          body.data.vapiPhoneNumberId,
          assistant.id
        );
      }
    } catch (e) {
      console.error("Vapi assistant creation failed:", e);
    }
  }

  return NextResponse.json({
    contractor: {
      id: contractor.id,
      businessName: contractor.businessName,
      trialEndsAt: contractor.trialEndsAt,
      vapiAssistantId,
    },
  });
}

export async function GET() {
  const contractors = await prisma.contractor.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      businessName: true,
      trade: true,
      email: true,
      phone: true,
      status: true,
      trialEndsAt: true,
      phoneNumber: true,
      vapiAssistantId: true,
      createdAt: true,
      _count: { select: { leads: true, calls: true } },
    },
  });
  return NextResponse.json({ contractors });
}
