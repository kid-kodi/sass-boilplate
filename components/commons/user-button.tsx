"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronsUpDown, Loader2, PowerIcon } from "lucide-react";
import Link from "next/link";

import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Définir un type utilisateur local qui correspond aux besoins d'affichage
type UserDisplay = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
  stripeCustomerId: string | null;
  role?: string; // Optionnel, si jamais il est mis à jour plus tard
};

export default function UserButton() {
  const [user, setUser] = useState<UserDisplay>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const getUser = async () => {
    setIsLoading(true);
    const { data, error } = await authClient.getSession();
    if (error) {
      toast(`${error}`);
      setIsLoading(false)
    } else {
      // Correction :forcer les attributs manquants pour éviter les erreurs de type
      if (data?.user) {
        setUser({
          ...data.user,
          image: data.user.image ?? "",
          stripeCustomerId: (data.user as any).stripeCustomerId ?? null,
          role: (data.user as any).role ?? undefined,
        });
      }
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    // TODO : connecter à l'API de déconnexion si disponible
    await authClient.signOut();
    setUser(undefined);
    router.push("/");
  };




  return (
    <>
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {user && !isLoading && (
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-xl">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage
                    // Correction : empêcher le type null, fournir une string vide au pire
                    src={user.image ?? ""}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-full font-bold uppercase">{`${user.name?.charAt(0) ?? ""}${user.name?.charAt(1) ?? ""}`}</AvatarFallback>
                </Avatar>
                <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.name}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Correction : user.role peut être undefined */}
              <DropdownMenuLabel>
                Mon Compte
                {user.role && (
                  <>
                    {" "}(<span>{user.role}</span>)
                  </>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Correction : Vérifier la présence de user.role */}
              {user?.role === "ADMIN" && (
                <DropdownMenuItem asChild>
                  <Link href={"/studio/dashboard"}>Accéder à la console</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={"/profile"}>Mon profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                >
                  <PowerIcon className="w-6" />
                  <div className="hidden md:block">Deconnexion</div>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
