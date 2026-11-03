// Checks for the logic that guards security and content (audit, 2026-11-04). Run: npm test (in apps/web).
// Node's own test runner, no extra dependency; only modules with no app-alias imports can load here.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.APP_SECRET = "test-secret-at-least-thirty-two-characters-long";
const { seal, unseal } = await import("../lib/server/crypto.ts");
const { toBlocks } = await import("../features/blog/blocks.ts");

test("a signed token opens only for its own purpose", () => {
  const t = seal({ e: "a@b.co" }, 60, "admin-session");
  assert.deepEqual(unseal(t, "admin-session"), { e: "a@b.co" });
  assert.equal(unseal(t, "trial-ticket"), null);
});

test("an expired token is refused", () => {
  assert.equal(unseal(seal({ e: "a@b.co" }, -1, "admin-session"), "admin-session"), null);
});

test("a tampered token is refused", () => {
  const [body, sig] = seal({ e: "a@b.co" }, 60, "admin-session").split(".");
  const forged = Buffer.from(JSON.stringify({ d: { e: "evil@x.co" }, e: Date.now() + 60_000, p: "admin-session" })).toString("base64url");
  assert.equal(unseal(`${forged}.${sig}`, "admin-session"), null);
  assert.equal(unseal(`${body}.x${sig}`, "admin-session"), null);
});

test("a heading or list right under text still splits into its own block", () => {
  assert.deepEqual(toBlocks("## Who we are\nWe edit photos.\n- one\n- two\nAfter the list."), [
    "## Who we are", "We edit photos.", "- one\n- two", "After the list.",
  ]);
});
