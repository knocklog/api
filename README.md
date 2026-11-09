# Knocklog API

The public description of the [Knocklog](https://knocklog.ai) API: analytics for AI agents. See which AI agents visit a website, whether each one is who it claims to be, what they read, and the visitors and leads AI assistants send.

- **Docs:** https://knocklog.ai/docs/api
- **OpenAPI 3.1:** [`openapi.json`](openapi.json), also served live at https://api.knocklog.ai/openapi.json
- **Base URL:** `https://api.knocklog.ai`

## Quick start

```sh
# Check how a site treats AI agents (no key)
curl "https://api.knocklog.ai/v1/scan?domain=example.com"

# Identify one request
curl -X POST "https://api.knocklog.ai/v1/classify" -H "Content-Type: application/json" \
  -d '{"user_agent": "Mozilla/5.0; compatible; GPTBot/1.4; +https://openai.com/gptbot", "ip": "20.171.206.10"}'

# Create a project: returns an ingest key, an admin key and install code
curl -X POST "https://api.knocklog.ai/v1/projects" -H "Content-Type: application/json" -d '{"domain": "example.com"}'

# Read the report
curl "https://api.knocklog.ai/v1/traffic?days=30" -H "Authorization: Bearer $KNOCKLOG_ADMIN_KEY"
```

The ingest key (`kl_ing_…`) only sends traffic and is safe in a collector on the site. The admin key (`kl_adm_…`) reads reports; keep it private. More in [`examples/`](examples).

## Endpoints

| Endpoint | What it does | Key |
|---|---|---|
| `GET /v1/agents` | List known AI agents | none |
| `POST /v1/classify` | Identify and verify one request | none |
| `GET /v1/scan` | Check how a site treats AI agents | none |
| `POST /v1/scan` | Check how a site treats AI agents (JSON body) | none |
| `GET /v1/plans` | List plans | none |
| `POST /v1/projects` | Create a project | none |
| `POST /v1/events` | Send requests from a collector | ingest (optional) |
| `POST /v1/logs` | Import access logs | ingest |
| `GET /v1/plan` | Plan and usage | ingest or admin |
| `GET /v1/traffic` | Traffic report | admin |
| `GET /v1/account` | Account overview | admin |
| `GET /v1/ready-files` | Ready-made robots.txt and llms.txt (Pro) | admin |
| `POST /v1/keys/ingest` | New ingest key | admin |
| `POST /v1/project/summary` | Weekly summary by email | admin |
| `POST /v1/integrations` | Webhook, Slack and company emails | admin |
| `POST /v1/install/cloudflare` | Install the collector on Cloudflare | admin |
| `POST /v1/billing/checkout` | Checkout link for a paid plan | admin |
| `POST /v1/billing/portal` | Link to manage the subscription | admin |
| `GET /v1/badge/{project}.json` | Badge status | none |
| `GET /v1/badge/{project}.svg` | Badge image | none |

Webhooks: `company.visited` and `lead.from_ai`, signed with `x-knocklog-signature` ([example](examples/verify-webhook.mjs)).

## For AI agents

The same features over the Model Context Protocol:

- `https://api.knocklog.ai/mcp/directory`: public tools, no sign-in
- `https://api.knocklog.ai/mcp/account`: one project, OAuth sign-in
- `https://api.knocklog.ai/mcp`: every tool, keys as arguments

Listed in the [official MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.leonlesenechal/knocklog`.

## Also from Knocklog

- [knocklog/ai-agents](https://github.com/knocklog/ai-agents): open directory of AI agents and crawlers (JSON, CSV)

## Support

Questions or a missing endpoint: open an issue or write to contact@knocklog.ai. Using the API is subject to the [terms](https://knocklog.ai/terms). The files in this repository are under the MIT license.
