"use client";

/* Last resort, when the root layout itself fails (production readiness, 2026-11-03). It replaces the whole document,
   so it carries its own minimal styles in the brand colours instead of relying on the site's stylesheet. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100svh", display: "grid", placeItems: "center", background: "#F4F8FE", color: "#0B1220", font: "17px/1.6 system-ui, -apple-system, Segoe UI, sans-serif", textAlign: "center", padding: 24 }}>
        <main style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, fontWeight: 520, margin: 0 }}>TechX Systems didn&rsquo;t load.</h1>
          <p style={{ color: "#4B5565", margin: "16px 0 28px" }}>It&rsquo;s on our side. Try again, or email support@techxsystems.com.</p>
          <button type="button" onClick={reset} style={{ font: "inherit", fontWeight: 500, color: "#fff", background: "#3074FE", border: 0, borderRadius: 10, padding: "12px 22px", minHeight: 44, cursor: "pointer" }}>Try again</button>
          {error.digest && <p style={{ marginTop: 24, fontSize: 13, color: "#4B5565", fontFamily: "ui-monospace, monospace" }}>Reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
