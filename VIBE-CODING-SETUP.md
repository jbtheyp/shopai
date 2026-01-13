# Deploy ShopAI with Claude Vibe Coding Control

This guide will set up your production site so Claude can directly edit the source code and deploy changes.

## 🎯 Architecture Overview

You'll have:
1. **GitHub Repository** - Source of truth for your code
2. **Vercel** - Auto-deploys when you push to GitHub
3. **Local Development** - Where Claude can edit files and push changes

## 📋 Step-by-Step Setup

### Step 1: Install Required Tools

First, let's make sure you have everything installed:

```bash
# Check if Git is installed
git --version

# Check if Node.js is installed (need version 18+)
node --version

# Check if npm is installed
npm --version
```

If any are missing:
- **Git**: Download from https://git-scm.com/downloads
- **Node.js**: Download from https://nodejs.org/ (get LTS version)

### Step 2: Set Up GitHub

1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com/signup
   - Follow the signup process

2. **Create Personal Access Token** (for Claude to push code)
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: "ShopAI Claude Access"
   - Select scopes:
     - ✅ `repo` (all repo permissions)
     - ✅ `workflow`
   - Click "Generate token"
   - **COPY THE TOKEN** - you won't see it again!
   - Save it somewhere safe (you'll need it later)

3. **Create New Repository**
   - Go to https://github.com/new
   - Repository name: `shopai`
   - Description: "AI-powered shopping referral platform"
   - Make it **Public** (or Private if you prefer)
   - Don't initialize with README (we have code already)
   - Click "Create repository"

### Step 3: Set Up Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with your GitHub account (easiest)
   - This automatically connects Vercel to GitHub

2. **You're done!** Vercel setup will complete after we push code.

### Step 4: Configure Your Local Project

Open terminal/command prompt and navigate to where you want to work:

```bash
# Navigate to your shopai-nextjs folder
cd path/to/shopai-nextjs

# Initialize git repository
git init

# Configure git with your info
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - ShopAI platform"

# Connect to your GitHub repository (replace with YOUR username)
git remote add origin https://github.com/YOUR_USERNAME/shopai.git

# Push to GitHub
git push -u origin main
```

**If push asks for credentials:**
- Username: Your GitHub username
- Password: Use the **Personal Access Token** you created earlier (NOT your GitHub password)

### Step 5: Deploy to Vercel

1. **Import Project**
   - Go to https://vercel.com/new
   - You should see your `shopai` repository
   - Click "Import"

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   ANTHROPIC_API_KEY=your_claude_api_key_here
   NEXT_PUBLIC_SITE_URL=will_update_after_deploy
   ```
   
   (You can add your API key later if you don't have it yet)

4. **Click "Deploy"**
   - Wait 1-2 minutes for build to complete
   - You'll get a URL like: `shopai-xyz.vercel.app`

5. **Update Site URL**
   - Go to Project Settings → Environment Variables
   - Edit `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL
   - Redeploy (Deployments tab → click "..." → Redeploy)

### Step 6: Enable Claude to Make Changes

Now Claude can edit your code and deploy changes! Here's the workflow:

**Option A: Direct File Editing (Recommended)**
Claude can edit files directly in your local project folder:

```bash
# Claude will navigate to your project
cd /path/to/your/shopai-nextjs

# Edit files using Claude's file tools
# Then commit and push:
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys the changes!
```

**Option B: Using Claude in Terminal**
You can ask Claude to:
1. Navigate to your project directory
2. Edit specific files
3. Test changes locally (`npm run dev`)
4. Commit and push to GitHub
5. Verify deployment on Vercel

### Step 7: Workflow for Making Changes

Here's how you'll work with Claude:

**Example Conversation:**
```
You: "Claude, I want to change the header color to green and add a new 'About' page"

Claude: [Uses file tools to edit app/page.tsx and create app/about/page.tsx]
        [Commits changes]
        [Pushes to GitHub]
        [Vercel automatically deploys]
        "Done! Changes are live at shopai-xyz.vercel.app"
```

## 🔐 Security Best Practices

1. **Never commit sensitive keys to GitHub**
   - All API keys go in Vercel Environment Variables
   - Use `.env.local` for local development (it's in .gitignore)

2. **Keep your GitHub token secure**
   - Don't share it
   - Regenerate if compromised

3. **Use Vercel's Environment Variables**
   - Production keys in Vercel
   - Development keys in `.env.local`

## 🛠️ Common Tasks

### Update Affiliate IDs
```bash
# Claude edits app/page.tsx
# Updates the affiliateNetworks object
# Commits and pushes
git add app/page.tsx
git commit -m "Update affiliate IDs"
git push
```

### Add New Features
```bash
# Claude creates new files/components
# Tests locally with npm run dev
# Commits and pushes when working
git add .
git commit -m "Add new feature: price tracking"
git push
```

### Fix Bugs
```bash
# Claude identifies and fixes the issue
# Tests the fix locally
git add .
git commit -m "Fix: search button not working on mobile"
git push
```

### Rollback Changes
```bash
# If something breaks, rollback:
git log  # Find the commit hash before the issue
git revert <commit-hash>
git push

# Or in Vercel dashboard, go to Deployments and redeploy a previous version
```

## 📊 Monitoring Your Site

### Vercel Dashboard
- **Analytics**: See traffic, performance
- **Deployments**: View all deployments, logs
- **Logs**: Real-time function logs
- **Domains**: Manage custom domains

### View Deployment Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs
```

## 🚀 Advanced: Custom Domain

Once your site is working:

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **In Vercel**:
   - Go to Project Settings → Domains
   - Add your domain (e.g., `shopai.com`)
3. **Update DNS** (in your domain registrar):
   - Add CNAME record pointing to `cname.vercel-dns.com`
4. **Wait** 5-60 minutes for DNS propagation
5. **Update** `NEXT_PUBLIC_SITE_URL` environment variable

## 🐛 Troubleshooting

### Push Failed
```bash
# If git push fails, try:
git pull origin main --rebase
git push
```

### Build Failed on Vercel
- Check the deployment logs in Vercel dashboard
- Usually it's a missing dependency or TypeScript error
- Fix locally, test with `npm run build`, then push

### Changes Not Showing
- Wait 30-60 seconds for Vercel to build
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check Vercel dashboard to see if deployment succeeded

### API Not Working
- Verify ANTHROPIC_API_KEY is set in Vercel Environment Variables
- Check function logs in Vercel dashboard
- Test locally first with `npm run dev`

## 📝 Quick Reference Commands

```bash
# Save and deploy changes
git add .
git commit -m "Your message"
git push

# Test locally before deploying
npm run dev

# Build to check for errors
npm run build

# View project status
git status

# See recent changes
git log --oneline

# Pull latest from GitHub
git pull

# Create new branch for testing
git checkout -b test-feature
# ... make changes ...
git push -u origin test-feature
# Then merge in GitHub if it works
```

## ✅ Post-Setup Checklist

- [ ] Code is on GitHub
- [ ] Site is deployed on Vercel
- [ ] Environment variables are set
- [ ] Site loads at your-site.vercel.app
- [ ] You can make a test change and see it deploy
- [ ] Claude can access your project directory
- [ ] Git is configured with your credentials

## 🎉 You're Ready!

Now you can say to Claude:

> "Go to my ShopAI project and change the main color scheme to blue and purple. Test it, then deploy to production."

And Claude can:
1. Navigate to your project folder
2. Edit the relevant files
3. Test locally
4. Commit changes
5. Push to GitHub
6. Verify deployment on Vercel

Your site will automatically update within 1-2 minutes!

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- GitHub Docs: https://docs.github.com
- Next.js Docs: https://nextjs.org/docs
