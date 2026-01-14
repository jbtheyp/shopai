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
    
    const prompt = `You are a shopping assistant. Analyze: "${query}"

Return VALID JSON ONLY - no markdown, no explanation, no code blocks.

Format:
{
  "intent": "product",
  "category": "category name",
  "recommendations": [
    {
      "name": "Product Name",
      "description": "Brief description",
      "estimatedPrice": "$XX.XX",
      "retailer": "Amazon",
      "affiliateNetwork": "amazon",
      "productId": "B08SAMPLE",
      "imageUrl": "https://images.unsplash.com/photo-xxx",
      "reason": "Why it matches"
    }
  ]
}

CRITICAL RULES:
1. Return ONLY valid JSON - no text before or after
2. Use double quotes for all strings
3. NO trailing commas before closing brackets
4. Keep descriptions short (under 100 characters)
5. Provide 3 specific products
6. Image URLs are optional - omit if uncertain

Return the JSON now:`

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
    
    // Parse JSON from response with error handling
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const results = JSON.parse(jsonMatch[0])
        console.log('✅ Successfully parsed JSON')
        console.log('Image URLs from Gemini:', results.recommendations?.map((r: any) => r.imageUrl))
        
        // Fix/validate image URLs - simplified version
        if (results.recommendations && Array.isArray(results.recommendations)) {
          results.recommendations.forEach((rec: any) => {
            // If imageUrl is missing or invalid, provide one based on product name
            if (!rec.imageUrl || !rec.imageUrl.startsWith('http')) {
              const productName = (rec.name || '').toLowerCase()
              
              // Smart image matching
              if (productName.includes('headphone') || productName.includes('earbud')) {
                rec.imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
              } else if (productName.includes('laptop') || productName.includes('computer')) {
                rec.imageUrl = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
              } else if (productName.includes('phone')) {
                rec.imageUrl = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
              } else if (productName.includes('chair')) {
                rec.imageUrl = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop'
              } else {
                // Generic product
                rec.imageUrl = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop'
              }
            }
          })
        }
        
        console.log('Final image URLs:', results.recommendations?.map((r: any) => r.imageUrl))
        return results
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError)
        console.error('Problematic JSON (first 1000 chars):', jsonMatch[0].substring(0, 1000))
        
        // Try to fix common JSON errors
        try {
          let fixedJson = jsonMatch[0]
          // Remove trailing commas
          fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1')
          // Try parsing again
          const results = JSON.parse(fixedJson)
          console.log('✅ Fixed and parsed JSON successfully')
          
          // Apply image URL fixes
          if (results.recommendations && Array.isArray(results.recommendations)) {
            results.recommendations.forEach((rec: any) => {
              if (!rec.imageUrl || !rec.imageUrl.startsWith('http')) {
                const productName = (rec.name || '').toLowerCase()
                if (productName.includes('headphone') || productName.includes('earbud')) {
                  rec.imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
                } else if (productName.includes('laptop')) {
                  rec.imageUrl = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
                } else {
                  rec.imageUrl = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop'
                }
              }
            })
          }
          return results
        } catch (fixError) {
          console.error('❌ Could not fix JSON, using demo results')
          return generateDemoResults(query)
        }
      }
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
      "imageUrl": "https://example.com/product-image.jpg",
      "reason": "Why this matches their need"
    }
  ]
}

IMPORTANT: Include a working "imageUrl" for each product. Use placeholder images if needed.`
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
          imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=400&fit=crop',
          reason: 'Best for comparing flight prices'
        },
        {
          name: 'Hotel Booking',
          description: 'Find accommodations at your destination',
          estimatedPrice: '$80-300/night',
          retailer: 'Booking.com',
          affiliateNetwork: 'booking',
          productId: 'hotel-search',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
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
          imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
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
            imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
            reason: 'Best balance of performance and portability'
          },
          {
            name: 'MacBook Air M2',
            description: '13.6" Liquid Retina, 8GB RAM, 256GB SSD',
            estimatedPrice: '$1,099.00',
            retailer: 'Amazon',
            affiliateNetwork: 'amazon',
            productId: 'B0MACBOOK1',
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
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
            imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop',
            reason: 'Industry-leading ergonomics'
          },
          {
            name: 'Branch Ergonomic Chair',
            description: 'Adjustable office chair with breathable mesh',
            estimatedPrice: '$349.00',
            retailer: 'Amazon',
            affiliateNetwork: 'amazon',
            productId: 'B08BRANCH1',
            imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
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
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            reason: 'Highly rated with fast shipping'
          }
        ]
      }
    }
  }
}
