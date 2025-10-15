import { DataTable } from "@/components/global/table/data-table";
import PageHeader from "@/components/layout/page-header";
import { columns } from "./columns";
import Pagination from "@/components/global/table/pagination";
import { getUsers } from "./actions";
import { User } from "@/lib/schemas";
import CreateUserButton from "./_components/CreateUserButton";
import GroupManagement from "./_components/GroupManagement";

type Props = {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const response = await getUsers(searchParams);
  const users: User[] = response.success ? response.users : [];
  const pages = response.success ? response.pages : 0;
  const totalUsers = response.success ? response.totalUsers : 0;
  const totalUsersByRole = response.success ? response.totalUsersByRole : null;

  return (
    <div className="h-screen mx-auto w-full">
      <PageHeader
        title="Utilisateurs"
        subtitle="Vue d'ensemble de votre progression"
        actions={<CreateUserButton />}
      />

      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-6">
          {/* Nombre total */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow border">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5"
                />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold">{totalUsers}</div>
              <div className="text-gray-500 text-sm">Total utilisateurs</div>
            </div>
          </div>

          {totalUsersByRole &&
            Object.entries(totalUsersByRole).map(([role, countRaw]) => {
              // Optionally, you can provide a label for each role
              const roleLabels: Record<string, string> = {
                ALUMNI: "Alumni",
                TEACHER: "Enseignants",
                ADMIN: "Admins",
                MANAGER: "Managers",
              };
              // Ensure count is a number
              const count = typeof countRaw === "number" ? countRaw : Number(countRaw);
              return (
                <div
                  key={role}
                  className="flex items-center p-4 bg-white rounded-lg shadow border"
                >
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-gray-500 text-sm">
                      {roleLabels[role] || role}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* <GroupManagement /> */}

      <div className="max-w-7xl mx-auto px-6 py-1">
        <DataTable columns={columns} data={users} />
        <div className="mt-5 flex justify-center">
          <Pagination totalPages={pages} />
        </div>
      </div>
    </div>
  );
}
