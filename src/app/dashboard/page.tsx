import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { trialDaysRemaining, isTrialActive } from "@/lib/trial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contractors: any[] = [];
  let dbError: string | null = null;

  try {
    contractors = await prisma.contractor.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        leads: { orderBy: { createdAt: "desc" }, take: 20 },
        calls: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Could not connect to database";
  }

  const totalLeads = contractors.reduce((n, c) => n + c.leads.length, 0);

  return (
    <main className="container" style={{ padding: "2rem 0 4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "var(--gold)",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
            }}
          >
            VELOCITY LUXE MEDIA
          </p>
          <h1>Operations dashboard</h1>
          <p style={{ color: "var(--muted)" }}>
            {dbError
              ? "Database not connected"
              : `${contractors.length} contractors · ${totalLeads} recent leads`}
          </p>
        </div>
        <Link href="/onboarding" className="btn btn-primary">
          + New trial
        </Link>
      </div>

      {dbError && (
        <div
          className="card"
          style={{
            marginTop: "1.5rem",
            borderColor: "#7f1d1d",
            color: "#fca5a5",
          }}
        >
          <h2 style={{ fontSize: "1.1rem" }}>Database setup required</h2>
          <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>{dbError}</p>
          <ol
            style={{
              marginTop: "1rem",
              paddingLeft: "1.25rem",
              color: "var(--muted)",
              fontSize: "0.9rem",
            }}
          >
            <li>
              Vercel → Project → <strong>Settings → Environment Variables</strong>
            </li>
            <li>
              Add <code>DATABASE_URL</code> = your Neon connection string (use the{" "}
              <strong>pooled</strong> URL from Neon if available)
            </li>
            <li>
              Add <code>NEXT_PUBLIC_APP_URL</code> ={" "}
              <code>https://velocity-luxe-receptionist.vercel.app</code>
            </li>
            <li>
              Add <code>ADMIN_SECRET</code> = your onboarding password
            </li>
            <li>Redeploy, then check /api/health</li>
          </ol>
        </div>
      )}

      {!dbError && contractors.length === 0 && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <p>No contractors yet. Add your first trial from onboarding.</p>
          <Link
            href="/onboarding"
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Onboard contractor
          </Link>
        </div>
      )}

      {!dbError &&
        contractors.map((c) => (
          <section key={c.id} className="card" style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
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

            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginTop: "0.75rem",
              }}
            >
              ID: {c.id}
              {c.vapiAssistantId && ` · Assistant: ${c.vapiAssistantId}`}
            </p>

            <h3 style={{ marginTop: "1.25rem", fontSize: "1rem" }}>Recent leads</h3>
            {c.leads.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                No leads yet.
              </p>
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
                  {c.leads.map((l: (typeof c.leads)[number]) => (
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
        ))}
    </main>
  );
}
