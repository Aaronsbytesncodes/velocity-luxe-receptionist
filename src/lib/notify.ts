export async function notifyContractorNewLead(payload: {
  businessName: string;
  contractorPhone: string;
  contractorEmail: string;
  lead: {
    callerName?: string | null;
    callerPhone?: string | null;
    serviceType?: string | null;
    address?: string | null;
    appointmentAt?: Date | null;
  };
}) {
  const lines = [
    `New lead for ${payload.businessName}`,
    payload.lead.callerName && `Name: ${payload.lead.callerName}`,
    payload.lead.callerPhone && `Phone: ${payload.lead.callerPhone}`,
    payload.lead.serviceType && `Service: ${payload.lead.serviceType}`,
    payload.lead.address && `Address: ${payload.lead.address}`,
    payload.lead.appointmentAt &&
      `Booked: ${payload.lead.appointmentAt.toLocaleString()}`,
  ].filter(Boolean);

  const message = lines.join("\n");

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString("base64");

    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: payload.contractorPhone,
          From: process.env.TWILIO_FROM_NUMBER,
          Body: message,
        }),
      }
    );
  }

  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Velocity Luxe Media <leads@velocityluxemedia.com>",
        to: payload.contractorEmail,
        subject: `New lead — ${payload.businessName}`,
        text: message,
      }),
    });
  }

  return message;
}
