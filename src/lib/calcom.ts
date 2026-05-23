const CALCOM_BASE = "https://api.cal.com/v2";

export type CalSlot = {
  start: string;
  end?: string;
};

export async function getAvailableSlots(
  apiKey: string,
  eventTypeId: number,
  dateFrom: string,
  dateTo: string
): Promise<CalSlot[]> {
  const params = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    startTime: dateFrom,
    endTime: dateTo,
  });

  const res = await fetch(`${CALCOM_BASE}/slots?${params}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2024-08-13",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cal.com slots failed: ${err}`);
  }

  const data = (await res.json()) as { data?: { slots?: Record<string, string[]> } };
  const slots: CalSlot[] = [];

  for (const [day, times] of Object.entries(data.data?.slots ?? {})) {
    for (const time of times) {
      slots.push({ start: `${day}T${time}:00` });
    }
  }

  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

export async function createBooking(
  apiKey: string,
  eventTypeId: number,
  start: string,
  attendee: { name: string; email: string; phone?: string },
  notes?: string
) {
  const res = await fetch(`${CALCOM_BASE}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "cal-api-version": "2024-08-13",
    },
    body: JSON.stringify({
      eventTypeId,
      start,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        timeZone: "America/New_York",
        language: "en",
        phoneNumber: attendee.phone,
      },
      metadata: notes ? { notes } : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cal.com booking failed: ${err}`);
  }

  return res.json();
}

export function formatSlotsForVoice(slots: CalSlot[], limit = 4): string[] {
  return slots.slice(0, limit).map((s) => {
    const d = new Date(s.start);
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  });
}
