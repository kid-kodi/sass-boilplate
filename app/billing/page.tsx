"use client";

import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react'

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

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
        <button onClick={() => handleSubscribe("Pro")} disabled={loading}>
          Plan Pro
        </button>
        <button onClick={() => handleSubscribe("Premium")} disabled={loading}>
          Premium
        </button>
      </div>
    </div>
  )
}
