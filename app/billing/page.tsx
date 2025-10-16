"use client";

import { authClient } from '@/lib/auth-client';

export default function BillingPage() {

  async function handleSubscribe(plan: string) {
    
    await authClient.subscription.upgrade({
      plan,
      successUrl : "/",
      cancelUrl : "/"
    })
  }
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Choisis ton plan</h1>
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => handleSubscribe("Pro")}>
          Plan Pro
        </button>
        <button onClick={() => handleSubscribe("Premium")}>
          Premium
        </button>
      </div>
    </div>
  )
}
