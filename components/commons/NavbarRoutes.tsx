import Link from "next/link";
// import UserButton from "@/components/commons/user-button";
import Logo from "./logo";
import { ModeSwitcher } from "../mode-switcher";
import { OrganizationSwitcher } from "../organization-switcher";
import { Organization } from "@/db/schema";
import { getUser } from "@/lib/auth-server";
import { Button, buttonVariants } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LogOut, User2, User2Icon } from "lucide-react";
import { redirect } from "next/navigation";

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
        <AuthButton />
      </div>
    </>
  );
};


export const AuthButton = async () => {
  const user = await getUser();

  if (!user) {
    return <>
      <Link href="/signup"
        className={buttonVariants({ size: "sm", variant: "outline" })}>
        Enregistrez-vous
      </Link>
      <Link href="/login"
        className={buttonVariants({ size: "sm", variant: "default" })}>
        Connectez-vous
      </Link>
    </>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Avatar className="size-6">
            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p>{user.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User2 className="size-3" />
            Mon Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form>
            <button
              className="flex items-center gap-2 w-full"
              formAction={async () => {
                "use server";
                await auth.api.signOut({
                  headers: await headers(),
                });

                redirect("/login")
              }}
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
