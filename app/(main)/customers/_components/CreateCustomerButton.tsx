'use client';

import { Button } from "@/components/ui/button";
import CustomModal from "@/components/commons/custom-modal";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import CustomerForm from "@/components/forms/customer-form";

export default function CreateCustomerButton() {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal
            title="Créer un nouveau client"
            subheading="Remplissez les informations sur l'entreprise ci-dessous. Les champs marqués d'un * sont obligatoires."
          >
            <CustomerForm />
          </CustomModal>
        )
      }
    >
      <PlusCircle className="w-4 h-4" />
      Nouvel Utilisateur
    </Button>
  );
}
