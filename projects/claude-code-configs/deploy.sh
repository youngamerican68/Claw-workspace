#!/bin/bash
# Deploy Claude Code Configs landing page to GitHub Pages

echo "🚀 Deploying Claude Code Configs..."

# Create GitHub Actions workflow
mkdir -p .github/workflows

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

echo "✅ Deployment ready!"
echo "Live URL will be: https://<username>.github.io/claude-code-configs"
