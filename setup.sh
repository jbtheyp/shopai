#!/bin/bash

# ShopAI Quick Setup Script
# This script automates the initial setup process

echo "🚀 ShopAI Production Setup"
echo "=========================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install from: https://git-scm.com/downloads"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install from: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ All prerequisites installed!"
echo ""

# Get user information
echo "📝 Setup Configuration"
echo "====================="
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your GitHub repository name (default: shopai): " REPO_NAME
REPO_NAME=${REPO_NAME:-shopai}

read -p "Enter your name for git commits: " GIT_NAME
read -p "Enter your email for git commits: " GIT_EMAIL

read -p "Do you have a GitHub Personal Access Token? (y/n): " HAS_TOKEN

if [ "$HAS_TOKEN" != "y" ]; then
    echo ""
    echo "⚠️  You need a GitHub Personal Access Token to push code."
    echo "Create one at: https://github.com/settings/tokens"
    echo "Required scopes: repo, workflow"
    echo ""
    read -p "Press Enter after you've created your token..."
fi

read -sp "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
echo ""
echo ""

read -p "Do you have an Anthropic API key? (y/n): " HAS_API_KEY

if [ "$HAS_API_KEY" == "y" ]; then
    read -sp "Enter your Anthropic API key: " ANTHROPIC_KEY
    echo ""
else
    echo "⚠️  You can add your API key later in Vercel settings"
    ANTHROPIC_KEY="your_api_key_here"
fi

echo ""
echo "🔧 Setting up project..."
echo ""

# Configure git
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

# Initialize git if not already done
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Create .env.local for local development
cat > .env.local << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

echo "✅ Created .env.local for local development"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Add all files to git
git add .

# Create initial commit if needed
if ! git rev-parse HEAD &> /dev/null; then
    git commit -m "Initial commit - ShopAI platform"
    echo "✅ Initial commit created"
fi

# Set up remote
REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
git remote remove origin 2>/dev/null
git remote add origin $REMOTE_URL

echo "✅ Git remote configured"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub successfully!"
else
    echo "❌ Failed to push to GitHub. Please check your token and repository name."
    exit 1
fi

# Test local build
echo ""
echo "🏗️  Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "⚠️  Build failed. Please check for errors above."
fi

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your code is now on GitHub: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your repository: ${REPO_NAME}"
echo "3. Add environment variable:"
echo "   ANTHROPIC_API_KEY=${ANTHROPIC_KEY}"
echo "   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app"
echo "4. Click Deploy!"
echo ""
echo "To test locally:"
echo "  npm run dev"
echo ""
echo "To deploy changes:"
echo "  git add ."
echo "  git commit -m 'your message'"
echo "  git push"
echo ""
echo "Happy coding! 🚀"
