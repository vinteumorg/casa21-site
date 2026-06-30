#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/exedev/casa21-site"
LOCK_FILE="/tmp/casa21-deploy.lock"
LOG_FILE="/home/exedev/casa21-deploy.log"
REMOTE="${DEPLOY_REMOTE:-origin}"
BRANCH="${DEPLOY_BRANCH:-main}"
SERVICE="${DEPLOY_SERVICE:-casa21.service}"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[$(date -Is)] Deploy already running" | tee -a "$LOG_FILE"
  exit 0
fi

{
  echo "[$(date -Is)] Starting deploy: ${REMOTE}/${BRANCH}"
  cd "$APP_DIR"

  git fetch "$REMOTE" "$BRANCH"
  git reset --hard "${REMOTE}/${BRANCH}"

  pnpm install --frozen-lockfile
  pnpm build

  sudo systemctl restart "$SERVICE"
  echo "[$(date -Is)] Deploy complete: $(git rev-parse --short HEAD)"
} 2>&1 | tee -a "$LOG_FILE"
