'use client';

import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/custom-modal";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import UserForm from "@/components/forms/UserForm";

export default function CreateUserButton() {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal
            title="Ajouter un utilisateur"
            subheading="Envoyer une invitation"
          >
            <UserForm
              data={null}
            />
          </CustomModal>
        )
      }
    >
      <PlusCircle className="w-4 h-4" />
      Nouvel Utilisateur
    </Button>
  );
}
