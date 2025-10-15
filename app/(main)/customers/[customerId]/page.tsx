import DynamicForm from '@/components/dynamic-form';
import { Button } from '@/components/ui/button';
import { getSingleCustomer, updateCourseField } from '@/server/customers';
import { Activity, BellElectric, FileUser } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

// Définition des options sans as const
const legalFormOptions: { title: string; value: string }[] = [
  { title: "SARL", value: "sarl" },
  { title: "SA", value: "sa" },
  { title: "SASU", value: "sasu" },
  { title: "SAS", value: "sas" },
  { title: "EURL", value: "eurl" },
  { title: "Entreprise Individuelle", value: "individual" },
  { title: "Auto-Entrepreneur", value: "sole_proprietorship" },
  { title: "Autre", value: "other" },
];

const salaryRegimeOptions: { title: string; value: string }[] = [
  { title: "Général", value: "general" },
  { title: "Agricole", value: "agricultural" }
];

const taxRegimeOptions: { title: string; value: string }[] = [
  { title: "Réel Normal", value: "simplified_real" },
  { title: "Micro", value: "normal_real" }
];


export default async function SingleCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {

  const customerId = (await params).customerId;

  const customer = await getSingleCustomer(customerId);

  return (
    <div className='p-6'>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">{customer.legalName}</h1>
          <span className="text-sm text-slate-700">
            {customer.email} {customer.phone}
          </span>
        </div>
        
        <div className='flex items-center gap-2'>
          <Button variant={`outline`} size={`lg`}>Creer un employee</Button>
        </div>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-16">
          <div>
            <div className="flex items-center gap-x-2">
              <FileUser />
              <div className="text-xl lowercase font-bold">Informations Générales</div>
            </div>
            <DynamicForm
              label='legalName'
              fieldName='legalName'
              initialData={customer.legalName}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label='Sigle'
              fieldName='acronym'
              initialData={customer.acronym || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label='Forme juridique'
              fieldName='legalForm'
              inputType='select'
              options={legalFormOptions}
              initialData={customer.legalForm || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Date de début d'activité"
              fieldName='activityStartDate'
              initialData={customer.activityStartDate || ""}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='date'
            />

            <DynamicForm
              label="Dirigeant/Responsable"
              fieldName='manager'
              initialData={customer.manager || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <BellElectric />
              <div className="text-xl lowercase font-bold">Informations d'Adresse</div>
            </div>

            <DynamicForm
              label="Ville *"
              fieldName='city'
              initialData={customer.city || ""}
              id={customerId}
              updateFunction={updateCourseField}

            />

            <DynamicForm
              label="Commune *"
              fieldName='municipality'
              initialData={customer.municipality || ""}
              id={customerId}
              updateFunction={updateCourseField}

            />

            <DynamicForm
              label="Quartier"
              fieldName='district'
              initialData={customer.district || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Rue"
              fieldName='street'
              initialData={customer.street || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Parcelle"
              fieldName='plot'
              initialData={customer.plot || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Section"
              fieldName='section'
              initialData={customer.section || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Ilot"
              fieldName='block'
              initialData={customer.block || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Lot"
              fieldName='lot'
              initialData={customer.lot || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

          </div>

          <div>
            <div className="flex items-center gap-x-2 font-bold">
              <BellElectric />
              <div className="text-xl lowercase font-bold">Adresse Administrative</div>
            </div>

            <DynamicForm
              label="Direction Régionale"
              fieldName='regionalDirectorate'
              initialData={customer.regionalDirectorate || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="Boîte Postale"
              fieldName='postalBox'
              initialData={customer.postalBox || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label="CDI"
              fieldName='cdi'
              initialData={customer.cdi || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />
          </div>
        </div>


        <div className="space-y-16">
          <div>
            <div className="flex items-center gap-x-2">
              <Activity />
              <div className="text-xl lowercase font-bold">Informations de Contact</div>
            </div>

            <DynamicForm
              label='Téléphone *'
              fieldName='phone'
              initialData={customer.phone}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='tel'
            />

            <DynamicForm
              label='Email'
              fieldName='email'
              initialData={customer.email || ""}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='email'
            />
          </div>


          <div>
            <div className="flex items-center gap-x-2">
              <Activity />
              <div className="text-xl lowercase font-bold">Activités</div>
            </div>
            <DynamicForm
              label='Activité Principale *'
              fieldName='mainActivity'
              initialData={customer.mainActivity}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='textarea'
            />

            <DynamicForm
              label='Activité Secondaire'
              fieldName='secondaryActivity'
              initialData={customer.secondaryActivity || ""}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='textarea'
            />

          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <BellElectric />
              <div className="text-xl lowercase font-bold">Période Comptable</div>
            </div>

            <DynamicForm
              label="Début d'Exercice *"
              fieldName='fiscalYearStart'
              initialData={customer.fiscalYearStart}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='date'
            />

            <DynamicForm
              label="Fin d'Exercice *"
              fieldName='fiscalYearEnd'
              initialData={customer.fiscalYearEnd}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='date'
            />

          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <Activity />
              <div className="text-xl lowercase font-bold">Régimes</div>
            </div>

            <DynamicForm
              label='Régime Salarial *'
              fieldName='salaryRegime'
              initialData={customer.salaryRegime}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='select'
              options={salaryRegimeOptions}
            />

            <DynamicForm
              label='Régime Fiscal *'
              fieldName='taxRegime'
              initialData={customer.taxRegime || ""}
              id={customerId}
              updateFunction={updateCourseField}
              inputType='select'
              options={taxRegimeOptions}
            />

          </div>


          <div>
            <div className="flex items-center gap-x-2">
              <Activity />
              <div className="text-xl lowercase font-bold">Informations Bancaires</div>
            </div>

            <DynamicForm
              label='Banque'
              fieldName='bank'
              initialData={customer.bank || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label='Agence'
              fieldName='bankBranch'
              initialData={customer.bankBranch || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />

            <DynamicForm
              label='Numéro de Compte'
              fieldName='accountNumber'
              initialData={customer.accountNumber || ""}
              id={customerId}
              updateFunction={updateCourseField}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
