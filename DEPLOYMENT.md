# Quick Deployment Guide for ShopAI

## Option 1: Vercel (Easiest - Recommended)

### Step 1: Prepare Your Code
```bash
# In your shopai-nextjs folder
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub
1. Create a new repository on GitHub.com
2. Run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/shopai.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Claude API key
5. Click "Deploy"

**Done!** Your site is live at `your-project.vercel.app`

### Adding Custom Domain
1. In Vercel dashboard, go to Settings → Domains
2. Add your domain (e.g., `shopai.com`)
3. Update your domain's DNS:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `cname.vercel-dns.com`

---

## Option 2: Netlify

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Import existing project"
3. Connect GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Site settings
6. Click "Deploy"

---

## Option 3: Railway

### Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Next.js
5. Add environment variables
6. Deploy!

---

## Option 4: Your Own Server (VPS)

### Using DigitalOcean/AWS/Linode

1. **Create server** (Ubuntu 22.04 recommended)

2. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2**:
```bash
sudo npm install -g pm2
```

4. **Upload your code**:
```bash
scp -r shopai-nextjs user@your-server-ip:/var/www/
```

5. **Build and start**:
```bash
cd /var/www/shopai-nextjs
npm install
npm run build
pm2 start npm --name "shopai" -- start
pm2 save
pm2 startup
```

6. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Setup SSL** (free with Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Required

All platforms need these variables:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Optional but recommended:
```env
NODE_ENV=production
```

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] AI search works
- [ ] Images upload successfully
- [ ] Affiliate links generate properly
- [ ] Mobile view looks good
- [ ] SSL certificate active (HTTPS)
- [ ] Analytics tracking working
- [ ] Custom domain configured
- [ ] Environment variables set
- [ ] Error monitoring setup

---

## Cost Estimates

### Vercel (Recommended for starters)
- Free: Up to 100GB bandwidth/month
- Pro: $20/month (unlimited bandwidth)

### Netlify
- Free: 100GB bandwidth/month
- Pro: $19/month

### Railway
- $5/month minimum
- Usage-based pricing

### Own Server
- DigitalOcean: $6-12/month
- AWS Lightsail: $3.50-5/month
- Linode: $5/month

---

## Monitoring & Analytics

### Add Google Analytics
In `app/layout.tsx`, add:
```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
```

### Error Monitoring with Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Troubleshooting

**Build fails**: Check Node version (needs 18+)
```bash
node --version
npm --version
```

**Site loads but search doesn't work**: Check API key in environment variables

**502 Bad Gateway**: App isn't running - check logs:
- Vercel: Check deployment logs
- Own server: `pm2 logs shopai`

**CORS errors**: Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ]
}
```

---

## Scaling Tips

1. **Use CDN**: Vercel includes this automatically
2. **Enable caching**: Set cache headers on static assets
3. **Image optimization**: Next.js does this automatically
4. **Database**: Add Redis for session management
5. **Load balancing**: Use when traffic exceeds 10k daily users

---

Need help? Check the README.md for more detailed instructions!
