---
name: integrating-payments
description: Use when implementing Stripe payments in Next.js. Covers Checkout Sessions, webhook verification, Elements, subscriptions, and security best practices.
---

# Integrating Payments

## The Rule

**Secret key server-only. Verify webhook signatures. Process idempotently. Never hardcode prices.**

---

## Stripe Checkout Session (Server-Side)

```tsx
// ✅ app/api/checkout/route.ts — secret key never leaves server
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { priceId } = await req.json()
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  })
  return Response.json({ url: session.url })
}

// ❌ WRONG: Stripe secret key in client code → total compromise
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) // in 'use client'
```

---

## Webhook Handling (Signature + Idempotency)

```tsx
// ✅ app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotent: check event.id before processing
  const processed = await db.webhookEvents.findUnique({ where: { eventId: event.id } })
  if (processed) return Response.json({ received: true })

  if (event.type === 'payment_intent.succeeded') {
    await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
    await db.webhookEvents.create({ data: { eventId: event.id } })
  }
  return Response.json({ received: true })
}

// ❌ WRONG: JSON.parse(body) without signature verification → accept forged webhooks
```

---

## Stripe Elements (Embedded Form)

```tsx
// ✅ Client-side with publishable key only
'use client'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const stripe = useStripe(), elements = useElements()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: elements.getElement(CardElement)! })
    if (error) { toast.error(error.message); return }
    await fetch('/api/pay', { method: 'POST', body: JSON.stringify({ id: paymentMethod.id }) })
  }
  return <form onSubmit={handleSubmit}><CardElement /><button>Pay</button></form>
}
export default function Payment() { return <Elements stripe={stripePromise}><CheckoutForm /></Elements> }
```

---

## Subscriptions + Environment

```tsx
// ✅ Server-side subscription creation
const sub = await stripe.subscriptions.create({
  customer: customerId, items: [{ price: priceId }],
  payment_behavior: 'default_incomplete', payment_settings: { save_default_payment_method: 'on_subscription' },
})
```

```bash
# ✅ .env.local — swap sk_test_ → sk_live_ for production
STRIPE_SECRET_KEY=sk_test_...                  # Server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Secret key in client | `STRIPE_SECRET_KEY` in API routes only |
| No webhook signature check | Always `constructEvent()` with signature |
| No idempotency | Store `event.id`, skip if already processed |
| Hardcoded prices | Fetch from Stripe API or database |
| Ignoring failed payments | Handle `payment_intent.payment_failed` webhook |
