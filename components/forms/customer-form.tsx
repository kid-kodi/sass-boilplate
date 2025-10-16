'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreateCustomerSchema } from '@/lib/validations/customer';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Customer } from '@/db/schema';
import { createCustomer, updateCustomer } from '@/server/customers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

type CreateCustomerFormData = z.infer<typeof CreateCustomerSchema>;

export default function CustomerForm({ data }: { data?: Customer }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: activeOrganization } = authClient.useActiveOrganization();

  console.log(activeOrganization?.id)

  const form = useForm<CreateCustomerFormData>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      ncc: data?.ncc || "",
      commercialRegister: data?.commercialRegister || "",
      taxIdentificationNumber: data?.taxIdentificationNumber || "",
      legalName: data?.legalName || "",
      acronym: data?.acronym || "",
      legalForm: data?.legalForm || "sarl",
      activityStartDate: data?.activityStartDate || new Date().toISOString().split('T')[0],
      manager: data?.manager || "",
      mainActivity: data?.mainActivity || "",
      secondaryActivity: data?.secondaryActivity || "",
      salaryRegime: data?.salaryRegime || "general",
      taxRegime: data?.taxRegime || "simplified_real",
      fiscalYearStart: data?.fiscalYearStart || new Date().toISOString().split('T')[0],
      fiscalYearEnd: data?.fiscalYearEnd || new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
      city: data?.city || "",
      municipality: data?.municipality || "",
      district: data?.district || "",
      street: data?.street || "",
      plot: data?.plot || "",
      section: data?.section || "",
      block: data?.block || "",
      lot: data?.lot || "",
      regionalDirectorate: data?.regionalDirectorate || "",
      cdi: data?.cdi || "",
      postalBox: data?.postalBox || "",
      phone: data?.phone || "",
      email: data?.email || "",
      bank: data?.bank || "",
      bankBranch: data?.bankBranch || "",
      accountNumber: data?.accountNumber || "",
      organizationId: data?.organizationId || activeOrganization?.id || "",
    },
  });

  const onSubmit = async (values: CreateCustomerFormData) => {
    setIsLoading(true);
    try {
      console.log('Données du formulaire:', values);

      const response = data ? await updateCustomer(data.id, values) : await createCustomer(values);

      form.reset();

      toast.success(`${response?.message}`);
      router.refresh();
      setIsLoading(false);

    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Section Identifiants Uniques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identifiants Uniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ncc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NCC *</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commercialRegister"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registre de Commerce</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxIdentificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro d&apos;Identification Fiscale</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Informations Générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Raison Sociale *</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez la raison sociale de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acronym"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sigle</FormLabel>
                    <FormControl>
                      <Input placeholder="ENT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legalForm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forme Juridique *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la forme juridique" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sarl">SARL</SelectItem>
                        <SelectItem value="sa">SA</SelectItem>
                        <SelectItem value="sasu">SASU</SelectItem>
                        <SelectItem value="sas">SAS</SelectItem>
                        <SelectItem value="eurl">EURL</SelectItem>
                        <SelectItem value="individual">Entreprise Individuelle</SelectItem>
                        <SelectItem value="sole_proprietorship">Auto-Entrepreneur</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de Début d&apos;Activité *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirigeant *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet du dirigeant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Activités */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Activités</h3>
            <FormField
              control={form.control}
              name="mainActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activité Principale *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'activité principale de l'entreprise"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activité Secondaire</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les activités secondaires (optionnel)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section Régimes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Régimes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salaryRegime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régime Salarial *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le régime salarial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">Général</SelectItem>
                        <SelectItem value="agricultural">Agricole</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRegime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régime Fiscal *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le régime fiscal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simplified_real">Réel Simplifié</SelectItem>
                        <SelectItem value="normal_real">Réel Normal</SelectItem>
                        <SelectItem value="micro">Micro</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Période Comptable */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Période Comptable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fiscalYearStart"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Début d&apos;Exercice *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiscalYearEnd"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fin d&apos;Exercice *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Adresse Complète */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations d&apos;Adresse Complète</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commune *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartier</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rue</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ilot</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Adresse Administrative */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adresse Administrative</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="regionalDirectorate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction Régionale</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cdi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CDI</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalBox"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boîte Postale</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Informations de Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations de Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Informations Bancaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations Bancaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banque</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agence</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Compte</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Actions du Formulaire */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Création..." : "Créer le Client"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}