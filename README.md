# ShopAI - AI-Powered Shopping Referral Platform

An intelligent shopping assistant that uses AI to help users find products, travel deals, and local services while earning you affiliate commissions.

## 🚀 Features

- **Multi-Modal Search**: Text-based chat and image upload capabilities
- **AI-Powered Intent Detection**: Automatically identifies whether users want products, travel, or services
- **Multi-Vertical Affiliate Support**: Integrated with Amazon, ShareASale, Booking.com, Skyscanner, and more
- **SEO Optimized**: Built with Next.js for excellent search engine visibility
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Recommendations**: Instant AI-powered product suggestions

## 📋 Prerequisites

- Node.js 18+ installed
- An Anthropic API key (for Claude AI)
- Affiliate network accounts (Amazon Associates, etc.)

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file in the root directory:
```env
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Configure affiliate IDs**:
Edit `app/page.tsx` and update the `affiliateNetworks` object with your actual affiliate IDs.

4. **Run development server**:
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app running!

## 🌐 Deployment to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps:

### Quick Deploy

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Add environment variables (ANTHROPIC_API_KEY)
   - Click "Deploy"

Your site will be live in ~2 minutes with a `.vercel.app` domain!

### Custom Domain

After deployment:
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 🔧 Integrating Real AI

To connect Claude API for real AI-powered search:

1. **Get API Key**: Sign up at [console.anthropic.com](https://console.anthropic.com)

2. **Update API Route** (`app/api/search/route.ts`):
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Find products for: ${query}`
    }]
  })
})
```

## 💰 Setting Up Affiliate Programs

### Amazon Associates
1. Sign up at [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
2. Get your tracking ID (format: `yourname-20`)
3. Add to `affiliateNetworks.amazon.id`

### ShareASale
1. Sign up at [shareasale.com](https://shareasale.com)
2. Get your affiliate ID
3. Add to `affiliateNetworks.shareasale.id`

### Booking.com
1. Join at [booking.com/affiliate](https://www.booking.com/affiliate)
2. Get your AID (Affiliate ID)
3. Add to `affiliateNetworks.booking.id`

## 📱 Building Mobile App

To convert this to a React Native mobile app:

1. **Install Expo**:
```bash
npm install -g expo-cli
expo init shopai-mobile
```

2. **Copy component logic** from `app/page.tsx`
3. **Replace with React Native components**:
   - `div` → `View`
   - `input` → `TextInput`
   - CSS classes → StyleSheet

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo in header (`app/page.tsx`)
- Modify metadata in `app/layout.tsx`

### Add New Affiliate Networks
Add to the `affiliateNetworks` object:
```typescript
mynewnetwork: {
  name: 'My Network',
  commission: '10%',
  id: 'YOUR_ID'
}
```

## 📊 Analytics Integration

Add Google Analytics to `app/layout.tsx`:
```typescript
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
```

## 🔒 Environment Variables

Required variables:
- `ANTHROPIC_API_KEY`: Your Claude API key
- `NEXT_PUBLIC_SITE_URL`: Your site URL (for SEO)

Optional:
- `GOOGLE_ANALYTICS_ID`: For tracking
- `SENTRY_DSN`: For error monitoring

## 📈 SEO Best Practices

The site is pre-configured for SEO with:
- Meta tags and Open Graph
- Semantic HTML
- Mobile-responsive design
- Fast loading times
- Clean URLs

To improve further:
1. Add sitemap (`public/sitemap.xml`)
2. Create blog content
3. Build category pages
4. Add schema markup

## 🐛 Troubleshooting

**Build errors**: Make sure all dependencies are installed
```bash
rm -rf node_modules package-lock.json
npm install
```

**API not working**: Check your `.env.local` file exists and has correct keys

**Styling issues**: Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

## 📝 License

This is a starter template. Use it to build your own shopping platform!

## 🤝 Support

For issues or questions:
- Check the Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Claude API docs: [docs.anthropic.com](https://docs.anthropic.com)

## 🎯 Roadmap

- [ ] User accounts and wishlists
- [ ] Price tracking alerts
- [ ] Browser extension
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
 
