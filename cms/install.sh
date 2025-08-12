#!/usr/bin/env bash
set -e

# Move to script directory
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$dir"

# Verify node
if ! command -v node &>/dev/null; then
  echo "Node.js is required. Please install Node.js 18 or newer." >&2
  exit 1
fi
node_major=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$node_major" -lt 18 ]; then
  echo "Node.js 18 or newer is required. Found $(node -v)." >&2
  exit 1
fi

# Verify npm
if ! command -v npm &>/dev/null; then
  echo "npm is required. Please install Node.js which includes npm." >&2
  exit 1
fi

# Install dependencies
npm install

# Setup environment file
if [ ! -f .env ]; then
  cp .env.example .env
fi

read -p "Enter CMS_USER (leave blank to auto-generate): " CMS_USER
if [ -z "$CMS_USER" ]; then
  CMS_USER=$(openssl rand -hex 8)
fi
read -s -p "Enter CMS_PASS (leave blank to auto-generate): " CMS_PASS
echo
if [ -z "$CMS_PASS" ]; then
  CMS_PASS=$(openssl rand -hex 24)
fi

# Write to .env
if grep -q '^CMS_USER=' .env; then
  sed -i "s/^CMS_USER=.*/CMS_USER=$CMS_USER/" .env
else
  echo "CMS_USER=$CMS_USER" >> .env
fi
if grep -q '^CMS_PASS=' .env; then
  sed -i "s/^CMS_PASS=.*/CMS_PASS=$CMS_PASS/" .env
else
  echo "CMS_PASS=$CMS_PASS" >> .env
fi

# Clipboard helper
copy_to_clipboard() {
  content="$1"
  if command -v pbcopy &>/dev/null; then
    printf "%s" "$content" | pbcopy
    echo "Credentials copied to clipboard."
  elif command -v xclip &>/dev/null; then
    printf "%s" "$content" | xclip -selection clipboard
    echo "Credentials copied to clipboard."
  elif command -v clip &>/dev/null; then
    printf "%s" "$content" | clip
    echo "Credentials copied to clipboard."
  else
    echo "Copy these credentials manually; no clipboard tool found."
  fi
}

creds="CMS_USER=$CMS_USER\nCMS_PASS=$CMS_PASS"
copy_to_clipboard "$creds"

echo "CMS_USER: $CMS_USER"
echo "CMS_PASS: $CMS_PASS"
echo "Store these credentials somewhere safe."

# Build and start
npm run build
npm start
