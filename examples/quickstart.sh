#!/bin/sh
# Knocklog API quick start: check a site, create a project, see how to connect it, read the report.
set -eu
API=https://api.knocklog.ai
DOMAIN=${1:-example.com}

echo "== Readiness check for $DOMAIN"
curl -s "$API/v1/scan?domain=$DOMAIN" | head -c 600; echo

echo "== Create a project (store both keys: they are shown only once)"
curl -s -X POST "$API/v1/projects" -H "Content-Type: application/json" -d "{\"domain\": \"$DOMAIN\"}" > project.json
INGEST=$(sed -n 's/.*"ingest": *"\([^"]*\)".*/\1/p' project.json | head -1)
ADMIN=$(sed -n 's/.*"admin": *"\([^"]*\)".*/\1/p' project.json | head -1)

echo "== Next: install the collector the API recommends for your hosting"
sed -n 's/.*"recommended": *"\([^"]*\)".*/\1/p' project.json | head -1
echo "(full steps and code are in project.json under install.methods; or send access logs to $API/v1/logs with the ingest key)"
echo "Ingest key starts with: $(echo "$INGEST" | cut -c1-16)…"

echo "== Report"
curl -s "$API/v1/traffic?days=7" -H "Authorization: Bearer $ADMIN" | head -c 800; echo
