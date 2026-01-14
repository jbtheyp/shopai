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
    
    const prompt = `You are a product search API. User query: "${query}"

⚠️ CRITICAL: Return ONLY raw JSON. NO markdown. NO code blocks. NO \`\`\`json wrapper. Start with { and end with }

CRITICAL REQUIREMENTS - READ CAREFULLY:

1. IMAGES: Use ONLY these exact Unsplash URLs based on product category:
   - Headphones/Earbuds: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop
   - Laptops/Computers: https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop
   - Phones: https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop
   - Monitors/TVs: https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop
   - Chairs/Furniture: https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop
   - Kitchen/Appliances: https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=400&fit=crop
   - Other products: https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop

2. PRICES: Research and provide REAL current 2026 market prices
   
3. RETAILERS: Pick from: Amazon, Walmart, Target, Best Buy (use different ones)

4. PRODUCT URLs: 
   - Amazon: https://www.amazon.com/s?k=PRODUCT_NAME_HERE
   - Walmart: https://www.walmart.com/search?q=PRODUCT_NAME_HERE
   - Target: https://www.target.com/s?searchTerm=PRODUCT_NAME_HERE
   - Best Buy: https://www.bestbuy.com/site/searchpage.jsp?st=PRODUCT_NAME_HERE
   
5. PRODUCT NAMES: Use real, specific product models that exist (e.g., "Sony WH-1000XM5", "Apple AirPods Pro")

Return ONLY this JSON structure:
{
  "intent": "product",
  "category": "Product Category",
  "recommendations": [
    {
      "name": "Real Brand Name + Model",
      "description": "Brief specs",
      "estimatedPrice": "$XX.XX",
      "retailer": "Amazon",
      "affiliateNetwork": "amazon",
      "productId": "search-query",
      "imageUrl": "USE ONE OF THE UNSPLASH URLS ABOVE",
      "productUrl": "USE ONE OF THE SEARCH URLS ABOVE",
      "reason": "Why relevant"
    },
    {
      "name": "Different Brand + Model",
      "description": "Brief specs",
      "estimatedPrice": "$XX.XX",
      "retailer": "Walmart",
      "affiliateNetwork": "rakuten",
      "productId": "search-query",
      "imageUrl": "USE ONE OF THE UNSPLASH URLS ABOVE",
      "productUrl": "USE ONE OF THE SEARCH URLS ABOVE",
      "reason": "Why relevant"
    },
    {
      "name": "Another Brand + Model",
      "description": "Brief specs", 
      "estimatedPrice": "$XX.XX",
      "retailer": "Target",
      "affiliateNetwork": "rakuten",
      "productId": "search-query",
      "imageUrl": "USE ONE OF THE UNSPLASH URLS ABOVE",
      "productUrl": "USE ONE OF THE SEARCH URLS ABOVE",
      "reason": "Why relevant"
    }
  ]
}

CRITICAL: NO trailing commas. Return ONLY valid JSON. Use the EXACT Unsplash URLs provided above.`

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
          maxOutputTokens: 4000,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    console.log('=== GEMINI RAW RESPONSE ===')
    console.log(aiResponse)
    console.log('=== END RAW RESPONSE ===')
    
    // Strip markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // Parse JSON from response with error handling
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      console.log('Found JSON match, attempting to parse...')
      try {
        const results = JSON.parse(jsonMatch[0])
        console.log('✅ Successfully parsed JSON')
        console.log('Results:', JSON.stringify(results, null, 2))
        console.log('Product URLs:', results.recommendations?.map((r: any) => r.productUrl))
        console.log('Product IDs (ASINs):', results.recommendations?.map((r: any) => r.productId))
        console.log('Image URLs:', results.recommendations?.map((r: any) => r.imageUrl))
        
        // Fix/validate image URLs - simplified version
        if (results.recommendations && Array.isArray(results.recommendations)) {
          results.recommendations.forEach((rec: any, idx: number) => {
            console.log(`Processing product ${idx + 1}: ${rec.name}`)
            
            // If imageUrl is missing or invalid, provide one based on product name
            if (!rec.imageUrl || !rec.imageUrl.startsWith('http')) {
              const productName = (rec.name || '').toLowerCase()
              console.log(`  No valid imageUrl, product name: ${productName}`)
              
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
              console.log(`  Assigned fallback imageUrl: ${rec.imageUrl}`)
            } else {
              console.log(`  Has valid imageUrl: ${rec.imageUrl}`)
            }
            
            // Validate productUrl
            if (rec.productUrl) {
              console.log(`  Has productUrl: ${rec.productUrl}`)
            } else {
              console.log(`  Missing productUrl, will generate from ASIN: ${rec.productId}`)
            }
          })
        }
        
        console.log('Final image URLs:', results.recommendations?.map((r: any) => r.imageUrl))
        console.log('Returning results to frontend')
        return results
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError)
        console.error('Problematic JSON (first 2000 chars):', jsonMatch[0].substring(0, 2000))
        
        // Try to fix common JSON errors
        try {
          console.log('Attempting to fix JSON...')
          let fixedJson = jsonMatch[0]
          // Remove trailing commas
          fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1')
          // Try parsing again
          const results = JSON.parse(fixedJson)
          console.log('✅ Fixed and parsed JSON successfully')
          
          // Apply image URL fixes (same logic as above)
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
          console.log('Returning fixed results')
          return results
        } catch (fixError) {
          console.error('❌ Could not fix JSON, using demo results')
          console.error('Fix error:', fixError)
          return generateDemoResults(query)
        }
      }
    } else {
      console.log('❌ No JSON found in Gemini response')
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
