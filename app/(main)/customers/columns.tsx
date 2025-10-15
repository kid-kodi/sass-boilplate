"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSingleCustomer, deleteCustomer } from "@/server/customers";
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
import CustomModal from "@/components/commons/custom-modal";
import { useModal } from "@/providers/modal-provider";
import { toast } from "sonner";
import { Customer } from "@/db/schema";
import CustomerForm from "@/components/forms/customer-form";


export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "legalName",
    header: "Raison Sociale",
  },
  {
    accessorKey: "ncc",
    header: "NCC",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, 'dd/MM/yyyy');
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return <div className="flex justify-end">
        <CellActions rowData={customer} />
      </div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

const CellActions = ({ rowData }: { rowData: Customer }) => {
  const { setOpen } = useModal();
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
              router.replace(`/customers/${rowData.id}`);
            }}
          >
            <Eye size={15} />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={async () => {
              const customer = await getSingleCustomer(rowData.id);
              setOpen(
                <CustomModal
                  title="Modifier un client"
                  subheading="Remplissez les informations sur l'entreprise ci-dessous. Les champs marqués d'un * sont obligatoires."
                >
                  <CustomerForm data={customer} />
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
            définitivement le client et les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await deleteCustomer(rowData.id);
              toast("Le client a été supprimé");
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
