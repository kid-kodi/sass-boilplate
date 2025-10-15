import React from 'react'
import MobileSidebar from './MobileSidebar'
import NavbarRoutes from './NavbarRoutes'
import { getOrganizations } from '@/server/organizations';

export default async function Navbar() {
  const organizations = await getOrganizations();
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes organizations={organizations} />
    </div>
  )
}
