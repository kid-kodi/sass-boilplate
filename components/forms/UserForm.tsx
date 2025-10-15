"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
import Loading from "@/components/global/loading";
import { createUser, updateUser } from "@/app/(pages)/users/actions";

// Custom schema: password required on create, optional (but validated if present) on update
const formSchema = z.object({
  role: z.string().min(2, {
    message: "Le role est requis !",
  }),
  firstName: z.string().min(2, {
    message: "Le nom est requis !",
  }),
  lastName: z.string().min(2, {
    message: "Le prenoms est requis !",
  }),
  email: z
    .string()
    .min(2, {
      message: "L'adresse email doit etre renseigner",
    })
    .email(),
  password: z.string().optional().or(z.literal("")), // allow empty string
});

type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  is_active: boolean;
  createdAt: string;
};

type Props = {
  data: UserData | null;
};

export default function UserForm({ data }: Props) {
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const [isView, setIsView] = useState(false);
  const { toast } = useToast();
  // const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      formSchema.refine(
        (values) => {
          // On create: password required, min 3
          if (!data) {
            return values.password && values.password.length >= 3;
          }
          // On update: password optional, but if present, min 3
          if (
            values.password &&
            values.password.length > 0 &&
            values.password.length < 3
          ) {
            return false;
          }
          return true;
        },
        {
          message: "Le mot de passe est requis (au moins 3 caractères)",
          path: ["password"],
        }
      )
    ),
    mode: "onChange",
    defaultValues: {
      role: data?.role ?? "",
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      email: data?.email ?? "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let response = null;

      if (data) {
        // Editing an existing user
        response = await updateUser(data._id, {
          _id: data._id,
          profilePicture: "",
          firstName: values.firstName,
          lastName: values.lastName,
          fullName: `${values.firstName} ${values.lastName}`,
          role: values.role,
          email: values.email,
          telephone: "",
          is_active: true,
          // Only send password if user entered a new one
          password:
            values.password && values.password.length > 0
              ? values.password
              : "",
          createdAt: "",
        });
      } else {
        // Creating a new user
        response = await createUser(
          values.role,
          values.firstName,
          values.lastName,
          values.email,
          values.password ?? ""
        );
      }
      if (response && response.success) {
        toast({
          title: data ? "Utilisateur modifié" : "Utilisateur créé",
          description: data
            ? "L'utilisateur a été modifié avec succès"
            : "L'utilisateur a été créé avec succès",
        });

        setIsSafeToReset(true);
      } else {
        toast({
          variant: "destructive",
          title: "Oups !",
          description: response?.message ?? "Erreur inconnue",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oups !",
        description: data
          ? "Impossible de modifier l'utilisateur"
          : "Impossible de créer l'utilisateur",
      });
      console.log(error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (!isSafeToReset) return;

    // Only reset the form if we're adding a user, not editing
    if (!data) {
      form.reset();
    }
    setIsSafeToReset(false);
  }, [form, isSafeToReset, data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALUMNI">Élève</SelectItem>
                    <SelectItem value="TEACHER">Professeur</SelectItem>
                    <SelectItem value="MANAGER">Gérant de programme</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Les rôles sont fonctions des options
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénoms</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center">
                    <div>Mot de passe</div>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isView ? "text" : "password"}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isLoading}
                      placeholder={
                        data
                          ? "Laisser vide pour ne pas changer"
                          : "Entrer un mot de passe"
                      }
                    />
                    {isView ? (
                      <Eye
                        className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                        onClick={() => {
                          setIsView(!isView);
                        }}
                      />
                    ) : (
                      <EyeOff
                        className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                        onClick={() => setIsView(!isView)}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                {data && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Laissez vide pour ne pas modifier le mot de passe.
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loading />
          ) : data ? (
            "Enregistrer les modifications"
          ) : (
            "Créer un compte"
          )}
        </Button>
      </form>
    </Form>
  );
}
