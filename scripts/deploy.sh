#!/usr/bin/env bash
# Update the running app on the server. Run from the repo root on the VPS:
#   ./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing dependencies (rebuilds better-sqlite3)"
npm ci

echo "==> Building"
npm run build

echo "==> Restarting service"
sudo systemctl restart rpca-cyber

echo "==> Done. data/ and uploads/ were left untouched."
