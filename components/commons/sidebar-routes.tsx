"use client";

import { BarChart, ContactRound, UserRound } from "lucide-react";
import React from "react";
import SidebarItem from "./sidebar-item";

const Routes = [
  {
    icon: BarChart,
    label: "Tableau de bord",
    href: "/dashboard",
  },
  {
    icon: ContactRound,
    label: "Clients",
    href: "/customers",
  },
  {
    icon: UserRound,
    label: "Utilisateurs",
    href: "/users",
  },
];

export default function SidebarRoutes() {
  return (
    <div className="flex flex-col w-full">
      {Routes.map((route, index) => (
        <SidebarItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
}
