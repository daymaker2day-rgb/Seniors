# PowerShell deployment script for GitHub Pages
# Run this after setting up the GitHub Actions workflow

Write-Host "🚀 Setting up GitHub deployment..." -ForegroundColor Green

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Add all files
Write-Host "📝 Adding files..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Setup GitHub Pages deployment for Senior Connect app"

# Add remote if not exists
$remoteExists = git remote get-url origin 2>$null
if (!$remoteExists) {
    Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/daymaker2day-rgb/Seniors.git
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Done! Your app will be deployed to:" -ForegroundColor Green
Write-Host "🌐 https://daymaker2day-rgb.github.io/Seniors" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Deployment may take a few minutes..." -ForegroundColor Yellow
Write-Host "📊 Check progress at: https://github.com/daymaker2day-rgb/Seniors/actions" -ForegroundColor Cyan