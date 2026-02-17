#!/bin/bash
# Wrapper that sources .env before running observer
source /root/.openclaw/workspace/.env
export MODEL="$OBSERVER_MODEL"
export OPENCLAW_DIR="/root/.openclaw"
export WORKSPACE_DIR="/root/.openclaw/workspace"
bash /root/.openclaw/workspace/scripts/observer.sh "$@"
