#!/bin/bash
# Deploy Agent Fleet Dashboard landing page to GitHub Pages

echo "🚀 Deploying Agent Fleet Dashboard..."

# Create GitHub repo structure
mkdir -p .github/workflows

# GitHub Actions workflow for GitHub Pages
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
EOF

# Initialize git repo if not exists
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit: Agent Fleet Dashboard MVP"
fi

echo "✅ Deployment ready!"
echo "Next steps:"
echo "1. Create GitHub repo: https://github.com/new"
echo "2. Push: git remote add origin <repo-url> && git push -u origin main"
echo "3. Enable GitHub Pages in repo settings"
echo "4. Landing page will be live at: https://<username>.github.io/agent-fleet-dashboard"
