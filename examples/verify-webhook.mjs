// Receives Knocklog webhooks and checks their signature (Node 18+).
// KNOCKLOG_WEBHOOK_SECRET is the webhookSecret returned once by POST /v1/integrations.
import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";

const secret = process.env.KNOCKLOG_WEBHOOK_SECRET;

function isFromKnocklog(rawBody, signatureHeader) {
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader ?? "");
  return a.length === b.length && timingSafeEqual(a, b);
}

createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const raw = Buffer.concat(chunks);
    if (!isFromKnocklog(raw, req.headers["x-knocklog-signature"])) {
      res.writeHead(401).end();
      return;
    }
    const event = JSON.parse(raw.toString("utf8"));
    if (event.type === "company.visited") console.log(`${event.data.company.name} visited ${event.site}:`, event.data.pages);
    if (event.type === "lead.from_ai") console.log(`Lead from ${event.data.assistant} (${event.data.action}) on ${event.data.page}`);
    res.writeHead(204).end();
  });
}).listen(8787, () => console.log("Listening on http://localhost:8787"));
