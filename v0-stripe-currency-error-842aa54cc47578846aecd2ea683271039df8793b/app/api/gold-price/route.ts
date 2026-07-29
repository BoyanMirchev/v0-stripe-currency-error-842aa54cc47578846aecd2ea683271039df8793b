import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.GOLDAPI_KEY
    
    if (!apiKey) {
      // Return mock/fallback data if no API key
      return NextResponse.json({
        success: true,
        source: "fallback",
        timestamp: Date.now(),
        currency: "EUR",
        prices: {
          price_per_ounce: 2650.00,
          price_per_gram: 85.20,
          price_gram_24k: 85.20,
          price_gram_22k: 78.10,
          price_gram_21k: 74.55,
          price_gram_18k: 63.90,
          price_gram_14k: 49.70,
        },
        change: 0,
        change_percent: 0,
      })
    }

    // Fetch from GoldAPI.io
    const response = await fetch("https://www.goldapi.io/api/XAU/EUR", {
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`GoldAPI responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Transform to our format
    return NextResponse.json({
      success: true,
      source: "goldapi.io",
      timestamp: data.timestamp * 1000,
      currency: data.currency,
      prices: {
        price_per_ounce: data.price,
        price_per_gram: data.price / 31.1035, // Troy ounce to gram
        price_gram_24k: data.price_gram_24k || data.price / 31.1035,
        price_gram_22k: data.price_gram_22k || (data.price / 31.1035) * (22 / 24),
        price_gram_21k: data.price_gram_21k || (data.price / 31.1035) * (21 / 24),
        price_gram_18k: data.price_gram_18k || (data.price / 31.1035) * (18 / 24),
        price_gram_14k: data.price_gram_14k || (data.price / 31.1035) * (14 / 24),
      },
      ask: data.ask,
      bid: data.bid,
      change: data.ch,
      change_percent: data.chp,
    })
  } catch (error) {
    console.error("Error fetching gold price:", error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      source: "fallback",
      timestamp: Date.now(),
      currency: "EUR",
      prices: {
        price_per_ounce: 2650.00,
        price_per_gram: 85.20,
        price_gram_24k: 85.20,
        price_gram_22k: 78.10,
        price_gram_21k: 74.55,
        price_gram_18k: 63.90,
        price_gram_14k: 49.70,
      },
      change: 0,
      change_percent: 0,
    })
  }
}
