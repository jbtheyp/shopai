# 🚀 QUICK START - Get Your Site Live in 10 Minutes

## Option 1: Automated Setup (Easiest)

### For Mac/Linux:
```bash
cd shopai-nextjs
chmod +x setup.sh
./setup.sh
```

### For Windows:
```
cd shopai-nextjs
setup.bat
```

The script will:
- ✅ Configure Git
- ✅ Install dependencies  
- ✅ Push to GitHub
- ✅ Test your build

**Then just:**
1. Go to vercel.com/new
2. Import your GitHub repo
3. Click Deploy
4. **DONE!** Your site is live! 🎉

---

## Option 2: Manual Setup (5 Steps)

### Step 1: Get Your Tools Ready
- [ ] GitHub account: github.com/signup
- [ ] Vercel account: vercel.com/signup (sign in with GitHub)
- [ ] GitHub token: github.com/settings/tokens (scopes: repo, workflow)

### Step 2: Push to GitHub
```bash
cd shopai-nextjs

# Setup Git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/shopai.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Visit: vercel.com/new
2. Click "Import" on your shopai repository
3. Add environment variables:
   - `ANTHROPIC_API_KEY` = your Claude API key
   - `NEXT_PUBLIC_SITE_URL` = https://your-site.vercel.app
4. Click "Deploy"

### Step 4: Wait 2 Minutes
☕ Vercel is building your site...

### Step 5: Visit Your Site!
Your site is live at: `your-project.vercel.app`

---

## 🎨 Make Changes with Claude

Once deployed, you can ask me (Claude) to make changes:

**Example:**
> "Claude, change the site colors to blue and green, add a FAQ section, and deploy it"

**I'll:**
1. Navigate to your project folder
2. Edit the files
3. Commit changes
4. Push to GitHub
5. Vercel auto-deploys!

Your changes are live in 60 seconds! ⚡

---

## 📁 What You Got

```
shopai-nextjs/
├── 📄 VIBE-CODING-SETUP.md    ← Full deployment guide
├── 📄 CLAUDE-REFERENCE.md     ← Quick reference for changes
├── 📄 DEPLOYMENT.md           ← Detailed deployment options
├── 📄 README.md               ← Complete documentation
├── 🔧 setup.sh                ← Automated setup (Mac/Linux)
├── 🔧 setup.bat               ← Automated setup (Windows)
└── 📁 app/                    ← Your actual site code
```

---

## 🆘 Need Help?

**Can't push to GitHub?**
→ Check your Personal Access Token has `repo` scope

**Build failed?**
→ Check Vercel deployment logs (vercel.com/dashboard)

**Changes not showing?**
→ Wait 60 seconds, then hard refresh (Ctrl+Shift+R)

**Need to rollback?**
→ In Vercel dashboard: Deployments → Previous deployment → Redeploy

---

## 🎯 Your Workflow Going Forward

```
You: "Claude, add a newsletter signup form"
   ↓
Claude: [edits files, commits, pushes]
   ↓
GitHub: [receives changes]
   ↓
Vercel: [auto-deploys in 60 seconds]
   ↓
Your Site: [updated and live!]
```

---

## ✅ Next Steps After Deployment

1. **Get Affiliate IDs**
   - Amazon Associates
   - ShareASale
   - Booking.com
   - Update in `app/page.tsx`

2. **Add Custom Domain**
   - Buy domain (Namecheap, GoDaddy)
   - Add in Vercel: Settings → Domains
   - Update DNS CNAME to `cname.vercel-dns.com`

3. **Set Up Analytics**
   - Google Analytics
   - Vercel Analytics (built-in)

4. **Test Everything**
   - Search works
   - Image upload works
   - Mobile looks good
   - Affiliate links generate

5. **Start Marketing!**
   - Share on social media
   - SEO optimization
   - Content marketing
   - Paid ads

---

**Ready to go live?** Pick Option 1 or 2 above and let's do this! 🚀
