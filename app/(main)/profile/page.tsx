import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser } from '@/lib/auth-server'
import React from 'react'

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) return;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Utilisateur</CardTitle>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  )
}
