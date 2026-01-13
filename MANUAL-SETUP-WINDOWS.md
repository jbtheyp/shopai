# Manual Setup Guide for Windows

If the automated script fails, follow these steps manually.

## Step 1: Open Command Prompt
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```
   cd C:\path\to\shopai-nextjs
   ```
   (Replace with your actual path)

## Step 2: Initialize Git
```cmd
git init
```

You should see: `Initialized empty Git repository`

## Step 3: Configure Git
Replace with your actual name and email:
```cmd
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 4: Create Environment File
Create a file named `.env.local` with this content:
```
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**How to create it:**
- Option A: Open Notepad, paste content, Save As `.env.local` (select "All Files")
- Option B: Command line:
  ```cmd
  echo ANTHROPIC_API_KEY=your_api_key_here > .env.local
  echo NEXT_PUBLIC_SITE_URL=http://localhost:3000 >> .env.local
  ```

## Step 5: Install Dependencies
```cmd
npm install
```

Wait for it to complete (may take 1-2 minutes).

## Step 6: Test Build
```cmd
npm run build
```

If this succeeds, you're ready to deploy!

## Step 7: Create GitHub Repository

### On GitHub.com:
1. Go to https://github.com/new
2. Repository name: `shopai`
3. Make it Public or Private
4. Don't initialize with README
5. Click "Create repository"

### Get Your Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "ShopAI"
4. Check these boxes:
   - ✅ repo (all)
   - ✅ workflow
5. Click "Generate token"
6. **COPY IT NOW** (you won't see it again!)

## Step 8: Push to GitHub
Replace `YOUR_USERNAME` with your GitHub username:
```cmd
git add .
git commit -m "Initial commit - ShopAI platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shopai.git
```

Now push (you'll be asked for credentials):
```cmd
git push -u origin main
```

**When prompted:**
- Username: Your GitHub username
- Password: **Use the Personal Access Token** (NOT your password)

## Step 9: Deploy to Vercel

### Create Vercel Account:
1. Go to https://vercel.com/signup
2. Sign up with GitHub (click "Continue with GitHub")
3. Authorize Vercel

### Import Your Project:
1. Click "Add New..." → "Project"
2. Find your `shopai` repository
3. Click "Import"

### Configure:
1. Framework Preset: Next.js (should auto-detect)
2. Root Directory: `./` (leave default)
3. Click "Environment Variables" dropdown
4. Add these:
   ```
   Name: ANTHROPIC_API_KEY
   Value: sk-ant-api03-your-key-here
   
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://your-site.vercel.app
   ```
   (You can update the URL after deployment)

5. Click "Deploy"

### Wait for Deployment:
- Takes 1-2 minutes
- You'll see a success screen with your URL
- Example: `shopai-abc123.vercel.app`

### Update Site URL:
1. Go to Project Settings → Environment Variables
2. Edit `NEXT_PUBLIC_SITE_URL`
3. Change to your actual Vercel URL
4. Go to Deployments tab
5. Click "..." on latest → "Redeploy"

## Step 10: Test Your Site!

Visit your Vercel URL and test:
- ✅ Site loads
- ✅ You can type in the search box
- ✅ Try a search query
- ✅ Check mobile view

## 🎉 You're Live!

Your site is now deployed and accessible to the world!

## Making Changes Later

Whenever you want to update your site:

```cmd
cd C:\path\to\shopai-nextjs

REM Make your changes to files, then:

git add .
git commit -m "Description of changes"
git push

REM Vercel automatically deploys in 60 seconds!
```

## Common Issues & Fixes

### "git is not recognized"
**Problem:** Git not installed or not in PATH
**Fix:** 
1. Download Git from https://git-scm.com/download/win
2. Install with default settings
3. Restart Command Prompt
4. Try again

### "npm is not recognized"
**Problem:** Node.js not installed or not in PATH
**Fix:**
1. Download from https://nodejs.org/
2. Install LTS version
3. Restart Command Prompt
4. Try again

### "fatal: not a git repository"
**Problem:** Not in the right directory
**Fix:**
```cmd
cd C:\path\to\shopai-nextjs
git init
```

### Push to GitHub fails with "Authentication failed"
**Problem:** Wrong credentials
**Fix:**
- Use your Personal Access Token as password (NOT your GitHub password)
- Make sure token has `repo` and `workflow` scopes
- Generate a new token if needed

### Build fails with TypeScript errors
**Problem:** Code has syntax errors
**Fix:**
```cmd
npm run build
```
Read the error messages and fix the issues in the code.

### Vercel deployment fails
**Problem:** Build error or missing environment variables
**Fix:**
1. Check deployment logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Test build locally first: `npm run build`

### Changes not showing on site
**Problem:** Deployment not complete or cache
**Fix:**
1. Wait 60 seconds for Vercel to deploy
2. Check Deployments tab in Vercel
3. Hard refresh browser: `Ctrl + Shift + R`
4. Clear browser cache

## Need More Help?

Try the automated script again:
```cmd
setup.bat
```

Or reach out to:
- Vercel Support: https://vercel.com/support  
- GitHub Docs: https://docs.github.com
- Next.js Docs: https://nextjs.org/docs

## Testing Locally Before Deploying

You can test everything works locally:

```cmd
cd C:\path\to\shopai-nextjs

REM Start development server
npm run dev

REM Visit in browser:
REM http://localhost:3000
```

Press `Ctrl+C` to stop the server.

## Updating Your Affiliate IDs

Edit `app\page.tsx` (around line 40):
```typescript
const affiliateNetworks = {
  amazon: { name: 'Amazon Associates', commission: '1-10%', id: 'YOUR_AMAZON_ID' },
  shareasale: { name: 'ShareASale', commission: '5-20%', id: 'YOUR_SHAREASALE_ID' },
  // ... update all IDs here
}
```

Then deploy:
```cmd
git add app\page.tsx
git commit -m "Update affiliate IDs"
git push
```

---

**You've got this!** 🚀 Follow each step carefully and you'll be live soon!
