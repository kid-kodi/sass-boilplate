"use client";

import Link from "next/link";
import UserButton from "@/components/commons/user-button";
import Logo from "./logo";
import { ModeSwitcher } from "../mode-switcher";
import { OrganizationSwitcher } from "../organization-switcher";
import { Organization } from "@/db/schema";

interface OrganizationSwitcherProps {
  organizations: Organization[];
}

export default function NavbarRoutes({ organizations }: OrganizationSwitcherProps) {

  return (
    <>
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Logo />
          <OrganizationSwitcher organizations={organizations} />
        </Link>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <ModeSwitcher />
        <UserButton />
      </div>
    </>
  );
};
