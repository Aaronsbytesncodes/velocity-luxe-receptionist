"use client";

import { useState } from "react";
import Link from "next/link";

const TRADES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "Roofing",
  "Landscaping",
  "General contractor",
  "Other",
];

export default function OnboardingPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{
    id: string;
    trialEndsAt: string;
    vapiAssistantId?: string;
  } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const res = await fetch("/api/contractors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error?.toString() ?? data.error ?? "Signup failed");
      return;
    }

    setResult(data.contractor);
    setStatus("done");
  }

  return (
    <main className="container" style={{ padding: "2rem 0 4rem" }}>
      <Link href="/" style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        ← Velocity Luxe Media
      </Link>
      <h1 style={{ marginTop: "1.5rem" }}>Start 7-day trial</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Use this during a cold call — fill it in with the contractor on the line,
        then call their demo number live.
      </p>

      {status === "done" && result ? (
        <div className="card">
          <h2 style={{ color: "var(--gold)" }}>Trial active</h2>
          <p style={{ marginTop: "0.75rem" }}>
            Contractor ID: <code>{result.id}</code>
          </p>
          <p>Trial ends: {new Date(result.trialEndsAt).toLocaleDateString()}</p>
          <p style={{ marginTop: "1rem", color: "var(--muted)" }}>
            Next: In Vapi, link their phone number to assistant{" "}
            <code>{result.vapiAssistantId ?? "create in Vapi dashboard"}</code>.
            Set server URL to <code>/api/webhooks/vapi</code> on your deployed app.
          </p>
          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
            Open dashboard
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 520 }}>
          <label className="label">Admin secret (your internal key)</label>
          <input className="input" name="adminSecret" type="password" required />

          <label className="label">Business name</label>
          <input className="input" name="businessName" required placeholder="Mike's Plumbing" />

          <label className="label">Owner / contact name</label>
          <input className="input" name="contactName" required />

          <label className="label">Email</label>
          <input className="input" name="email" type="email" required />

          <label className="label">Mobile (for lead alerts)</label>
          <input className="input" name="phone" required placeholder="+15551234567" />

          <label className="label">Trade</label>
          <select className="input" name="trade" required>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label className="label">Service area (cities or zips)</label>
          <input className="input" name="serviceArea" placeholder="Austin, Round Rock, 78701" />

          <label className="label">Custom greeting (optional)</label>
          <input
            className="input"
            name="greeting"
            placeholder="Thanks for calling Mike's Plumbing, this is Alex. What can I help with?"
          />

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />

          <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1rem" }}>
            Cal.com (for real calendar slots)
          </p>

          <label className="label">Cal.com API key</label>
          <input className="input" name="calcomApiKey" type="password" />

          <label className="label">Event type ID</label>
          <input className="input" name="calcomEventTypeId" type="number" placeholder="123456" />

          <label className="label">Cal.com username</label>
          <input className="input" name="calcomUsername" placeholder="mikes-plumbing" />

          <label className="label">Vapi phone number ID (from dashboard)</label>
          <input className="input" name="vapiPhoneNumberId" placeholder="optional — assign after create" />

          {error && (
            <p style={{ color: "#f87171", marginBottom: "1rem" }}>{error}</p>
          )}

          <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Creating…" : "Activate 7-day trial"}
          </button>
        </form>
      )}
    </main>
  );
}
