import { NextResponse } from 'next/server'

// Configuration: Switch between AI providers easily
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini' // Options: 'gemini' or 'claude'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

export async function POST(request: Request) {
  try {
    const { query, imageData } = await request.json()

    // Route to appropriate AI provider
    let results
    if (AI_PROVIDER === 'claude' && ANTHROPIC_API_KEY) {
      results = await searchWithClaude(query, imageData)
    } else if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY) {
      results = await searchWithGemini(query, imageData)
    } else {
      // Fallback to demo mode if no API key
      results = generateDemoResults(query)
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Google Gemini Integration
async function searchWithGemini(query: string, imageData?: string) {
  try {
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
    
    const prompt = `You are a shopping assistant. Analyze this search query: "${query}"

Determine if the user wants:
- "product" - physical items to buy
- "travel" - flights, hotels, vacation packages
- "service" - local services like plumbers, electricians, etc.

Then provide 3-5 specific product recommendations in JSON format ONLY (no markdown, no explanation):

{
  "intent": "product|travel|service",
  "category": "category name",
  "recommendations": [
    {
      "name": "Specific Product Name",
      "description": "Brief description (1-2 sentences)",
      "estimatedPrice": "$XX.XX or price range",
      "retailer": "Amazon|Wayfair|Booking.com|Skyscanner|HomeAdvisor|etc",
      "affiliateNetwork": "amazon|wayfair|booking|skyscanner|shareasale|cj",
      "productId": "sample-product-id",
      "reason": "Why this matches their need (1 sentence)"
    }
  ]
}

Important: Return ONLY the JSON object, no other text.`

    const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Parse JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback if parsing fails
    return generateDemoResults(query)
  } catch (error) {
    console.error('Gemini API Error:', error)
    return generateDemoResults(query)
  }
}

// Claude Integration (for future use)
async function searchWithClaude(query: string, imageData?: string) {
  try {
    const messages: any[] = [
      {
        role: 'user',
        content: imageData 
          ? [
              {
                type: 'image',
                source: { type: 'base64', media_type: 'image/jpeg', data: imageData }
              },
              { 
                type: 'text', 
                text: query || 'What product is shown in this image? Provide specific product recommendations.'
              }
            ]
          : `You are a shopping assistant. The user is looking for: "${query}". 
          
Analyze their intent and provide 3-5 specific product recommendations in JSON format ONLY (no markdown, no preamble):

{
  "intent": "product|travel|service",
  "category": "category name",
  "recommendations": [
    {
      "name": "Product Name",
      "description": "Brief description",
      "estimatedPrice": "$XX.XX",
      "retailer": "Amazon|Wayfair|Home Depot|Booking.com|etc",
      "affiliateNetwork": "amazon|shareasale|booking|etc",
      "productId": "sample-product-id",
      "reason": "Why this matches their need"
    }
  ]
}`
      }
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.content.find((c: any) => c.type === 'text')?.text || ''
    
    // Parse JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return generateDemoResults(query)
  } catch (error) {
    console.error('Claude API Error:', error)
    return generateDemoResults(query)
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
