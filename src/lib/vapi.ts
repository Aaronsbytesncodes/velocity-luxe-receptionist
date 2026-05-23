const VAPI_BASE = "https://api.vapi.ai";

export type VapiAssistantConfig = {
  contractorId: string;
  businessName: string;
  trade: string;
  greeting?: string;
  serviceArea?: string;
  serverUrl: string;
};

export function buildSystemPrompt(config: VapiAssistantConfig) {
  const greeting =
    config.greeting ??
    `Thank you for calling ${config.businessName}. How can I help you today?`;

  return `You are the professional AI receptionist for ${config.businessName}, a ${config.trade} contractor.

Your job:
1. Greet callers warmly. First message: "${greeting}"
2. Find out what service they need and if it is an emergency.
3. Get their full name, callback phone number, and service address.
4. Confirm they are in the service area${config.serviceArea ? ` (${config.serviceArea})` : ""}. If outside area, politely explain you cannot schedule and offer to have someone call back.
5. Offer real appointment times using the check_availability tool — never invent times.
6. Book using book_appointment only after the caller confirms a specific slot.
7. If they will not book, capture lead details and say the team will follow up.

Rules:
- Be concise and friendly. One question at a time.
- For emergencies (flooding, no heat, gas smell): treat as urgent, prioritize earliest slot, and note urgency as emergency.
- Never quote prices unless given in knowledge.
- If unsure, offer to have a human call them back within 2 hours.
- Internal contractor ID for tools: ${config.contractorId} (pass as contractorId when calling tools).`;
}

export async function createVapiAssistant(
  apiKey: string,
  config: VapiAssistantConfig
) {
  const body = {
    name: `${config.businessName} Receptionist`,
    firstMessage: config.greeting ?? `Thanks for calling ${config.businessName}. How can I help?`,
    model: {
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.4,
      messages: [{ role: "system", content: buildSystemPrompt(config) }],
      tools: [
        {
          type: "function",
          function: {
            name: "check_availability",
            description: "Get available appointment slots for a date",
            parameters: {
              type: "object",
              properties: {
                contractorId: { type: "string", description: "Contractor ID" },
                date: { type: "string", description: "YYYY-MM-DD" },
                serviceType: { type: "string" },
              },
              required: ["contractorId", "date"],
            },
          },
            server: {
              url: `${config.serverUrl}/api/tools/check-availability?contractorId=${config.contractorId}`,
            },
        },
        {
          type: "function",
          function: {
            name: "book_appointment",
            description: "Book a confirmed appointment slot",
            parameters: {
              type: "object",
              properties: {
                contractorId: { type: "string" },
                slotStart: { type: "string", description: "ISO datetime" },
                callerName: { type: "string" },
                callerPhone: { type: "string" },
                address: { type: "string" },
                serviceType: { type: "string" },
                urgency: { type: "string", enum: ["routine", "soon", "emergency"] },
                notes: { type: "string" },
              },
              required: ["contractorId", "slotStart", "callerName", "callerPhone"],
            },
          },
            server: {
              url: `${config.serverUrl}/api/tools/book-appointment?contractorId=${config.contractorId}`,
            },
        },
      ],
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel — swap per brand
    },
    serverUrl: config.serverUrl,
    serverMessages: ["end-of-call-report"],
  };

  const res = await fetch(`${VAPI_BASE}/assistant`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi assistant create failed: ${err}`);
  }

  return res.json() as Promise<{ id: string }>;
}

export async function updatePhoneNumberAssistant(
  apiKey: string,
  phoneNumberId: string,
  assistantId: string
) {
  const res = await fetch(`${VAPI_BASE}/phone-number/${phoneNumberId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assistantId }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi phone update failed: ${err}`);
  }

  return res.json();
}
