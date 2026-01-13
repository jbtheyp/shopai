import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShopAI - Your AI-Powered Shopping Assistant',
  description: 'Find the best products, travel deals, and local services with AI. Compare prices, get personalized recommendations, and save money on every purchase.',
  keywords: ['shopping assistant', 'AI shopping', 'product search', 'price comparison', 'travel deals', 'affiliate shopping'],
  authors: [{ name: 'ShopAI' }],
  openGraph: {
    title: 'ShopAI - Your AI-Powered Shopping Assistant',
    description: 'Find the best products, travel deals, and local services with AI',
    type: 'website',
    locale: 'en_US',
    siteName: 'ShopAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopAI - Your AI-Powered Shopping Assistant',
    description: 'Find the best products, travel deals, and local services with AI',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
