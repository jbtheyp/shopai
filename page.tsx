'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Camera, Send, ShoppingBag, Plane, Wrench, ExternalLink, Loader2, Sparkles } from 'lucide-react'

interface Message {
  type: 'user' | 'ai'
  content: string | SearchResults
  image?: string
  timestamp: Date
}

interface SearchResults {
  intent: 'product' | 'travel' | 'service'
  category: string
  recommendations: Recommendation[]
}

interface Recommendation {
  name: string
  description: string
  estimatedPrice: string
  retailer: string
  affiliateNetwork: string
  productId: string
  reason: string
}

const affiliateNetworks = {
  amazon: { name: 'Amazon Associates', commission: '1-10%', id: 'YOUR_AMAZON_ID' },
  shareasale: { name: 'ShareASale', commission: '5-20%', id: 'YOUR_SHAREASALE_ID' },
  cj: { name: 'CJ Affiliate', commission: '3-15%', id: 'YOUR_CJ_ID' },
  rakuten: { name: 'Rakuten Advertising', commission: '2-10%', id: 'YOUR_RAKUTEN_ID' },
  booking: { name: 'Booking.com', commission: '25-40%', id: 'YOUR_BOOKING_ID' },
  skyscanner: { name: 'Skyscanner', commission: 'CPA', id: 'YOUR_SKYSCANNER_ID' },
  homedepot: { name: 'Home Depot', commission: '3-8%', id: 'YOUR_HOMEDEPOT_ID' },
  wayfair: { name: 'Wayfair', commission: '5-7%', id: 'YOUR_WAYFAIR_ID' },
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const searchProducts = async (query: string, imageData?: string): Promise<SearchResults> => {
    setIsLoading(true)
    
    try {
      // Call your API route
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, imageData }),
      })
      
      const results = await response.json()
      setIsLoading(false)
      return results
    } catch (error) {
      console.error('Search error:', error)
      setIsLoading(false)
      // Return fallback results
      return {
        intent: 'product',
        category: 'Products',
        recommendations: [],
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')

    const results = await searchProducts(currentInput)
    
    const aiMessage: Message = {
      type: 'ai',
      content: results,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string
      
      const userMessage: Message = {
        type: 'user',
        content: 'Uploaded an image',
        image: base64Data,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])

      const results = await searchProducts('Product from image', base64Data.split(',')[1])
      
      const aiMessage: Message = {
        type: 'ai',
        content: results,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }

    reader.readAsDataURL(file)
  }

  const getIntentIcon = (intent: string) => {
    switch(intent) {
      case 'travel': return <Plane className="w-5 h-5" />
      case 'service': return <Wrench className="w-5 h-5" />
      default: return <ShoppingBag className="w-5 h-5" />
    }
  }

  const getIntentColor = (intent: string) => {
    switch(intent) {
      case 'travel': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'service': return 'bg-orange-50 border-orange-200 text-orange-700'
      default: return 'bg-green-50 border-green-200 text-green-700'
    }
  }

  const generateAffiliateLink = (network: string, productId: string) => {
    // This would generate actual affiliate links in production
    return `#affiliate-link-${network}-${productId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ShopAI
              </h1>
              <p className="text-sm text-gray-500">Your AI Shopping Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">What are you looking for?</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Describe what you need or snap a photo. I'll find the best products, services, or travel options for you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <ShoppingBag className="w-8 h-8 text-indigo-500 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-800 mb-2">Products</h3>
                <p className="text-sm text-gray-600">Find anything from electronics to home goods</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <Plane className="w-8 h-8 text-blue-500 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-800 mb-2">Travel</h3>
                <p className="text-sm text-gray-600">Book flights, hotels, and vacation packages</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <Wrench className="w-8 h-8 text-orange-500 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-800 mb-2">Services</h3>
                <p className="text-sm text-gray-600">Connect with local professionals</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-24">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'user' ? (
                  <div className="max-w-sm">
                    {message.image && (
                      <img src={message.image} alt="Uploaded" className="rounded-lg mb-2 max-w-full h-auto shadow-md" />
                    )}
                    <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-md">
                      {typeof message.content === 'string' ? message.content : ''}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      {typeof message.content === 'object' && (
                        <>
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${getIntentColor(message.content.intent)}`}>
                            {getIntentIcon(message.content.intent)}
                            <span className="text-sm font-medium">{message.content.category}</span>
                          </div>
                          
                          <div className="space-y-4">
                            {message.content.recommendations?.map((rec, i) => (
                              <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-gray-900 text-lg">{rec.name}</h3>
                                  <span className="text-lg font-bold text-indigo-600">{rec.estimatedPrice}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                                <p className="text-xs text-gray-500 mb-3 italic">{rec.reason}</p>
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500">
                                    <span className="font-medium">{rec.retailer}</span>
                                    {affiliateNetworks[rec.affiliateNetwork as keyof typeof affiliateNetworks] && (
                                      <span className="ml-2">
                                        • {affiliateNetworks[rec.affiliateNetwork as keyof typeof affiliateNetworks].commission} commission
                                      </span>
                                    )}
                                  </div>
                                  <a
                                    href={generateAffiliateLink(rec.affiliateNetwork, rec.productId)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                                  >
                                    View Product
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-colors"
                disabled={isLoading}
                aria-label="Upload image"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you're looking for..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI • We earn commission on qualifying purchases
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
