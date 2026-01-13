import { NextResponse } from 'next/server'

// This is where you'll integrate with Claude API
export async function POST(request: Request) {
  try {
    const { query, imageData } = await request.json()

    // In production, call Claude API here
    // For now, return demo data
    const results = generateDemoResults(query)

    return NextResponse.json(results)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function detectIntent(query: string): 'product' | 'travel' | 'service' {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.match(/\b(flight|fly|airline|ticket|travel|trip|vacation|hotel|book)\b/)) {
    return 'travel'
  }
  if (lowerQuery.match(/\b(plumber|electrician|handyman|repair|install|service|contractor)\b/)) {
    return 'service'
  }
  return 'product'
}

function generateDemoResults(query: string) {
  const intent = detectIntent(query)
  const queryLower = query.toLowerCase()
  
  if (intent === 'travel') {
    return {
      intent: 'travel',
      category: 'Travel & Accommodation',
      recommendations: [
        {
          name: 'Round-trip Economy Flight',
          description: 'Compare prices across major airlines',
          estimatedPrice: '$200-800',
          retailer: 'Skyscanner',
          affiliateNetwork: 'skyscanner',
          productId: 'flight-search',
          reason: 'Best for comparing flight prices'
        },
        {
          name: 'Hotel Booking',
          description: 'Find accommodations at your destination',
          estimatedPrice: '$80-300/night',
          retailer: 'Booking.com',
          affiliateNetwork: 'booking',
          productId: 'hotel-search',
          reason: 'Wide selection with competitive rates'
        }
      ]
    }
  } else if (intent === 'service') {
    return {
      intent: 'service',
      category: 'Local Services',
      recommendations: [
        {
          name: 'HomeAdvisor Pro Matching',
          description: 'Connect with verified local professionals',
          estimatedPrice: 'Free quotes',
          retailer: 'HomeAdvisor',
          affiliateNetwork: 'shareasale',
          productId: 'homeadvisor-service',
          reason: 'Pre-screened professionals with reviews'
        }
      ]
    }
  } else {
    // Product recommendations
    if (queryLower.includes('laptop') || queryLower.includes('computer')) {
      return {
        intent: 'product',
        category: 'Electronics',
        recommendations: [
          {
            name: 'Dell XPS 13 Laptop',
            description: '13.3" FHD, Intel Core i7, 16GB RAM, 512GB SSD',
            estimatedPrice: '$1,199.99',
            retailer: 'Amazon',
            affiliateNetwork: 'amazon',
            productId: 'B09LAPTOP1',
            reason: 'Best balance of performance and portability'
          },
          {
            name: 'MacBook Air M2',
            description: '13.6" Liquid Retina, 8GB RAM, 256GB SSD',
            estimatedPrice: '$1,099.00',
            retailer: 'Amazon',
            affiliateNetwork: 'amazon',
            productId: 'B0MACBOOK1',
            reason: 'Excellent for creative work with long battery life'
          }
        ]
      }
    } else if (queryLower.includes('chair') || queryLower.includes('office')) {
      return {
        intent: 'product',
        category: 'Furniture',
        recommendations: [
          {
            name: 'Herman Miller Aeron Chair',
            description: 'Ergonomic office chair with adjustable lumbar support',
            estimatedPrice: '$1,395.00',
            retailer: 'Wayfair',
            affiliateNetwork: 'wayfair',
            productId: 'W1234AERON',
            reason: 'Industry-leading ergonomics'
          },
          {
            name: 'Branch Ergonomic Chair',
            description: 'Adjustable office chair with breathable mesh',
            estimatedPrice: '$349.00',
            retailer: 'Amazon',
            affiliateNetwork: 'amazon',
            productId: 'B08BRANCH1',
            reason: 'Best value ergonomic chair'
          }
        ]
      }
    } else {
      return {
        intent: 'product',
        category: 'Products',
        recommendations: [
          {
            name: 'Top Rated Product',
            description: 'High-quality option matching your needs',
            estimatedPrice: '$49.99',
            retailer: 'Amazon',
            affiliateNetwork: 'amazon',
            productId: 'B08SAMPLE1',
            reason: 'Highly rated with fast shipping'
          }
        ]
      }
    }
  }
}
