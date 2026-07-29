'use server'

import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

interface CheckoutItem {
  name: string
  price: number
  quantity: number
  weight_grams?: number | null
}

interface CreateCheckoutSessionParams {
  items: CheckoutItem[]
  customerEmail: string
  orderId: string
  deliveryCost: number
}

export async function createCheckoutSession({
  items,
  customerEmail,
  orderId,
  deliveryCost,
}: CreateCheckoutSessionParams) {
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('x-forwarded-host') || 'http://localhost:3000'
  const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`

  // Create line items for Stripe (prices are already in EUR)
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        description: item.weight_grams ? `${item.weight_grams}g` : undefined,
      },
      // Stripe expects amounts in smallest currency unit (cents for EUR)
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  // Add delivery cost as a line item if > 0
  if (deliveryCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Доставка',
          description: undefined,
        },
        unit_amount: Math.round(deliveryCost * 100),
      },
      quantity: 1,
    })
  }

  // Create Checkout Session with redirect mode
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: lineItems,
    mode: 'payment',
    success_url: `${baseUrl}/checkout-success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout-guest?canceled=true`,
    metadata: {
      orderId: orderId,
    },
  })

  return { url: session.url }
}

export async function getCheckoutSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_email,
  }
}
