"use client";

import { API_BASE_URL } from "@/lib/api";
import { AppShell } from "../_components/app-shell";
import { Patient } from "../../lib/types";
import { useQuery } from "@tanstack/react-query";

export default function PatientsPage() {
  const { data, isPending, error, refetch } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: () => fetch(`${API_BASE_URL}/patients`).then((r) => r.json()),
  });

  if (isPending) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Patients</h1>
        <span className="spinner "></span>
        <p className="mt-2 text-sm text-(--muted)">Loading patients...</p>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Patients</h1>
        <p className="mt-2 text-sm text-(--muted)">
          An error occurred while fetching patients: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </AppShell>
    );
  }

  if (!data || data.length === 0) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Patients</h1>
        <p className="mt-2 text-sm text-(--muted)">No patients found. Start by adding a new patient.</p>
      </AppShell>
    );
  }

  function loadPatients() {
    // trigger a refetch of patients data
    void refetch();
  }
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Patients</h1>

      <div className="mt-5">
        <button
          onClick={() => void loadPatients()}
          className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm hover:bg-(--line) hover:cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-(--line)">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-(--line) text-(--muted) uppercase">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-t border-(--line) hover:bg-(--line)">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
