import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "1rem 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: "0.85rem",
                color: "var(--gold)",
              }}
            >
              VELOCITY LUXE MEDIA
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              AI Receptionist for Contractors
            </div>
          </div>
          <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/onboarding" className="btn btn-primary">
              Start free trial
            </Link>
          </nav>
        </div>
      </header>

      <section className="container" style={{ padding: "4rem 0 3rem" }}>
        <span className="badge">7-day free trial · Plans from $297/mo</span>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            lineHeight: 1.15,
            marginTop: "1rem",
            maxWidth: "18ch",
          }}
        >
          Your phones answered. Leads booked. 24/7.
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1.15rem",
            maxWidth: "52ch",
            marginTop: "1rem",
          }}
        >
          Velocity Luxe Media gives plumbers, HVAC, roofers, and trades an AI
          receptionist that picks up every call, qualifies the job, and books
          real calendar slots — so you stop losing jobs to voicemail.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/onboarding" className="btn btn-primary">
            Get your trial number
          </Link>
          <Link href="/dashboard" className="btn btn-ghost">
            View demo dashboard
          </Link>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              title: "Answers every call",
              body: "Professional greeting with your business name. No hold music, no missed rings.",
            },
            {
              title: "Books real appointments",
              body: "Connects to Cal.com and offers live availability — not fake times.",
            },
            {
              title: "Texts you the lead",
              body: "Name, address, service, and booked time sent to your phone instantly.",
            },
            {
              title: "Built for cold-call close",
              body: "Spin up a contractor in minutes during your sales call. Live demo on the spot.",
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 style={{ marginBottom: "0.5rem" }}>{item.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "4rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Simple pricing</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "48ch" }}>
          Premium service for premium trades. One booked job covers months of service.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { name: "Essentials", price: "$297", note: "Business hours" },
            { name: "Professional", price: "$497", note: "24/7 · Most popular", highlight: true },
            { name: "Elite", price: "$797", note: "Multi-line & volume" },
          ].map((tier) => (
            <div
              key={tier.name}
              className="card"
              style={
                tier.highlight
                  ? { borderColor: "var(--gold)", boxShadow: "0 0 0 1px var(--gold-dim)" }
                  : undefined
              }
            >
              {tier.highlight && <span className="badge">Most popular</span>}
              <h3 style={{ marginTop: tier.highlight ? "0.5rem" : 0 }}>{tier.name}</h3>
              <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--gold)" }}>
                {tier.price}
                <span style={{ fontSize: "1rem", color: "var(--muted)", fontWeight: 400 }}>
                  /mo
                </span>
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{tier.note}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "1rem" }}>
          All plans start with a 7-day free trial. No credit card to start.
        </p>
      </section>

      <footer
        className="container"
        style={{
          padding: "2rem 0",
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
          fontSize: "0.875rem",
        }}
      >
        © {new Date().getFullYear()} Velocity Luxe Media. All rights reserved.
      </footer>
    </main>
  );
}
