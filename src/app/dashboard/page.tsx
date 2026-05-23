import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { trialDaysRemaining, isTrialActive } from "@/lib/trial";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const contractors = await prisma.contractor.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      leads: { orderBy: { createdAt: "desc" }, take: 20 },
      calls: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  const totalLeads = contractors.reduce((n, c) => n + c.leads.length, 0);

  return (
    <main className="container" style={{ padding: "2rem 0 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "var(--gold)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
            VELOCITY LUXE MEDIA
          </p>
          <h1>Operations dashboard</h1>
          <p style={{ color: "var(--muted)" }}>
            {contractors.length} contractors · {totalLeads} recent leads
          </p>
        </div>
        <Link href="/onboarding" className="btn btn-primary">
          + New trial
        </Link>
      </div>

      {contractors.length === 0 ? (
        <div className="card" style={{ marginTop: "2rem" }}>
          <p>No contractors yet. Add your first trial from onboarding.</p>
          <Link href="/onboarding" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Onboard contractor
          </Link>
        </div>
      ) : (
        contractors.map((c) => (
          <section key={c.id} className="card" style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h2>{c.businessName}</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  {c.trade} · {c.contactName} · {c.phone}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="badge">
                  {isTrialActive(c.trialEndsAt, c.status)
                    ? `Trial · ${trialDaysRemaining(c.trialEndsAt)}d left`
                    : c.status}
                </span>
                {c.phoneNumber && (
                  <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                    Line: {c.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.75rem" }}>
              ID: {c.id}
              {c.vapiAssistantId && ` · Assistant: ${c.vapiAssistantId}`}
            </p>

            <h3 style={{ marginTop: "1.25rem", fontSize: "1rem" }}>Recent leads</h3>
            {c.leads.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No leads yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Appointment</th>
                  </tr>
                </thead>
                <tbody>
                  {c.leads.map((l) => (
                    <tr key={l.id}>
                      <td>{l.createdAt.toLocaleString()}</td>
                      <td>{l.callerName ?? "—"}</td>
                      <td>{l.callerPhone ?? "—"}</td>
                      <td>{l.serviceType ?? "—"}</td>
                      <td>{l.status}</td>
                      <td>
                        {l.appointmentAt
                          ? l.appointmentAt.toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))
      )}
    </main>
  );
}
