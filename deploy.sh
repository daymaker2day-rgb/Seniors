#!/bin/bash
# Git setup and deployment script

echo "🚀 Setting up GitHub deployment..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git branch -M main
fi

# Add all files
git add .

# Commit changes
echo "📝 Committing changes..."
git commit -m "Setup GitHub Pages deployment for Senior Connect app"

# Add remote if not exists
git remote get-url origin 2>/dev/null || git remote add origin https://github.com/daymaker2day-rgb/Seniors.git

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Your app will be deployed to:"
echo "🌐 https://daymaker2day-rgb.github.io/Seniors"
echo ""
echo "⏳ Deployment may take a few minutes..."
echo "📊 Check progress at: https://github.com/daymaker2day-rgb/Seniors/actions"