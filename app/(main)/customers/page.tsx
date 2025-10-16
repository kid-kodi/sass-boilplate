import PageHeader from '@/components/commons/page-header';
import React from 'react'
import CreateCustomerButton from './_components/CreateCustomerButton';
import { getCustomers } from '@/server/customers';
import { columns } from './columns';
import { DataTable } from '@/components/commons/table/data-table';
import Pagination from '@/components/commons/table/pagination';


export default async function CustomersPage() {
  const customers = await getCustomers();
  const pages = customers?.length;
  return (
    <div className="h-screen mx-auto w-full">
      <PageHeader
        title="Clients"
        subtitle="gestion des clients"
        actions={<CreateCustomerButton />}
      />

      <div className="max-w-7xl mx-auto px-6 py-1">
        <DataTable columns={columns} data={customers} />
        <div className="mt-5 flex justify-center">
          <Pagination totalPages={pages} />
        </div>
      </div>
    </div>
  )
}
