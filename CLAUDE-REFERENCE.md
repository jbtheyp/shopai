# Claude Vibe Coding Quick Reference

This is a quick guide for Claude (or you) to make changes to the ShopAI production site.

## 🎯 Making Changes Workflow

### Step 1: Navigate to Project
```bash
cd /path/to/shopai-nextjs
```

### Step 2: Make Changes
Use file editing tools to modify files:
- `app/page.tsx` - Main page component
- `app/layout.tsx` - Site metadata and global layout
- `app/globals.css` - Global styles
- `app/api/search/route.ts` - API endpoint for search
- `tailwind.config.js` - Theme and design tokens

### Step 3: Test Locally (Optional but Recommended)
```bash
npm run dev
# Visit http://localhost:3000 to test
# Press Ctrl+C to stop
```

### Step 4: Deploy Changes
```bash
git add .
git commit -m "Brief description of changes"
git push
```

Vercel will automatically deploy in 1-2 minutes!

## 📝 Common Tasks

### Change Color Scheme
**File**: `app/page.tsx` and `tailwind.config.js`
```typescript
// In app/page.tsx, replace:
from-indigo-500 to-purple-600  // with your colors
text-indigo-600  // with your color
bg-indigo-600  // with your color
```

### Update Affiliate IDs
**File**: `app/page.tsx`
```typescript
const affiliateNetworks = {
  amazon: { name: 'Amazon Associates', commission: '1-10%', id: 'YOUR_ID_HERE' },
  // ... update all IDs
}
```

### Change Site Title/Description (SEO)
**File**: `app/layout.tsx`
```typescript
export const metadata: Metadata = {
  title: 'Your New Title',
  description: 'Your new description',
  // ... update other fields
}
```

### Add New Page
```bash
# Create new directory and file
mkdir -p app/about
# Create app/about/page.tsx with page content
```

### Modify API Search Logic
**File**: `app/api/search/route.ts`
```typescript
// Update the generateDemoResults function
// Or integrate real Claude API calls
```

### Update Styling
**File**: `app/globals.css` or inline in components
```css
/* Add custom CSS in globals.css */
.your-custom-class {
  /* styles */
}
```

## 🚀 Deployment Commands

### Quick Deploy (all changes)
```bash
git add .
git commit -m "Update: description"
git push
```

### Deploy Specific Files
```bash
git add app/page.tsx
git commit -m "Update: change header color"
git push
```

### Check Status Before Commit
```bash
git status  # See what changed
git diff    # See exact changes
```

### Undo Last Commit (before push)
```bash
git reset HEAD~1  # Undo last commit, keep changes
git reset --hard HEAD~1  # Undo last commit, discard changes
```

## 🔍 Debugging

### View Deployment Logs
Visit: https://vercel.com/dashboard → Your Project → Deployments → Latest → Logs

### Test Build Locally
```bash
npm run build  # Check for build errors
npm start      # Test production build locally
```

### Common Errors

**TypeScript Error**
- Check file syntax
- Make sure imports are correct
- Run `npm run build` to see exact error

**Build Failed**
- Check Vercel deployment logs
- Usually missing dependency or syntax error
- Fix locally, test with `npm run build`, then push

**Changes Not Showing**
- Wait 60 seconds for Vercel to build
- Hard refresh browser (Ctrl+Shift+R)
- Check if deployment succeeded in Vercel

## 📂 File Structure Reference

```
shopai-nextjs/
├── app/
│   ├── layout.tsx          # Global layout + SEO
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/
│       └── search/
│           └── route.ts    # Search API endpoint
├── public/                 # Static assets
├── package.json           # Dependencies
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config
└── tsconfig.json          # TypeScript config
```

## 💡 Pro Tips

1. **Always test locally before pushing** (if making big changes)
   ```bash
   npm run dev
   ```

2. **Use descriptive commit messages**
   ```bash
   git commit -m "Fix: mobile menu not closing on click"
   git commit -m "Feature: add price comparison table"
   git commit -m "Update: affiliate IDs for new networks"
   ```

3. **Create branches for experiments**
   ```bash
   git checkout -b test-new-feature
   # make changes
   git push -u origin test-new-feature
   # Merge in GitHub if it works
   ```

4. **Roll back if something breaks**
   ```bash
   git log --oneline  # Find previous commit
   git revert <commit-hash>
   git push
   ```

5. **Keep dependencies updated**
   ```bash
   npm update
   git add package.json package-lock.json
   git commit -m "Update dependencies"
   git push
   ```

## 🤖 Claude-Specific Instructions

When Claude needs to make changes:

1. Use `view` tool to check current code
2. Use `str_replace` or `create_file` to make changes
3. Use `bash_tool` to commit and push:
   ```bash
   cd /path/to/shopai-nextjs
   git add .
   git commit -m "Claude: description of changes"
   git push
   ```
4. Confirm deployment in Vercel dashboard

## 🎨 Design System Reference

### Colors (from Tailwind)
- Primary: `indigo-600`, `purple-600`
- Accent: `blue-500`, `orange-500`
- Success: `green-600`
- Gray scale: `gray-50` to `gray-900`

### Spacing
- Small: `p-2`, `m-2` (8px)
- Medium: `p-4`, `m-4` (16px)
- Large: `p-6`, `m-6` (24px)

### Rounded Corners
- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)
- Full: `rounded-full`

## 📊 Analytics & Monitoring

### View Site Analytics
Vercel Dashboard → Your Project → Analytics

### Monitor API Usage
Check function logs in Vercel Dashboard

### Track Affiliate Clicks
Implement tracking in affiliate link generation

## 🔐 Security Reminders

- Never commit API keys (use .env.local locally)
- All secrets go in Vercel Environment Variables
- Keep GitHub token secure
- Use environment variables for all sensitive data

## ✅ Pre-Deploy Checklist

Before pushing major changes:
- [ ] Code tested locally
- [ ] No console errors
- [ ] Mobile responsive
- [ ] TypeScript compiles (`npm run build`)
- [ ] Affiliate links work
- [ ] Images load properly
- [ ] SEO metadata updated if needed

---

## 🎯 Quick Deploy Template

```bash
cd /path/to/shopai-nextjs
# ... make your changes ...
git add .
git commit -m "Brief description"
git push
# Done! Check https://your-site.vercel.app in 60 seconds
```
