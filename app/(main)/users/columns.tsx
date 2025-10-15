"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, removeUser } from "./actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CustomModal from "@/components/global/custom-modal";
import UserForm from "@/components/forms/UserForm";
import { useModal } from "@/providers/modal-provider";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  is_active: boolean;
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: "Nom / Prénoms",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      let role = "";

      switch (row.getValue("role")) {
        case "ALUMNI":
          role = "Élève";
          break;
        case "TEACHER":
          role = "Professeur";
          break;
        case "MANAGER":
          role = "Gérant";
          break;
        case "ADMIN":
          role = "ADMINISTRATEUR";
          break;
        default:
          role = "Élève";
          break;
      }

      return (
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            <Badge
              className={clsx({
                "bg-emerald-500": row.getValue("role") === "ADMIN",
                "bg-orange-400": row.getValue("role") === "MANAGER",
                "bg-primary": row.getValue("role") === "ALUMNI",
                "bg-muted": row.getValue("role") === "GUEST",
              })}
            >
              {role}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <CellActions rowData={user} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

const CellActions = ({ rowData }: { rowData: User }) => {
  const { setOpen } = useModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!rowData) return;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.replace(`/users/${rowData._id}`);
            }}
          >
            <Eye size={15} />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={async () => {
              const { user } = await getUser(rowData._id);
              setOpen(
                <CustomModal
                  title="Ajouter un utilisateur"
                  subheading="Envoyer une invitation"
                >
                  <UserForm data={user} />
                </CustomModal>
              );
            }}
          >
            <Edit size={15} />
            Modifier
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2">
              <Trash size={15} /> Supprimer
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Êtes-vous absolument sûr ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Cette action ne peut pas être annulée. Cela supprimera
            définitivement l&apos;utilisateur et les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await removeUser(rowData._id);
              toast({
                title: "Utilisateur supprimé",
                description: "L'utilisateur a été supprimé",
              });
              setLoading(false);
              router.refresh();
            }}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
