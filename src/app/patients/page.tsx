"use client";

import { API_BASE_URL } from "@/lib/api";
import { AppShell } from "../_components/app-shell";
import { Patient } from "../../lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreatePatientForm } from "../_components/create-patient-form";

export default function PatientsPage() {
  const { data, isPending, error, refetch } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: () => fetch(`${API_BASE_URL}/patients`).then((r) => r.json()),
  });

  const [optimisticPatients, setOptimisticPatients] = useState<Patient[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateSuccess = (newPatient: Patient) => {
    setOptimisticPatients((prev) => [...prev, newPatient]);

    void refetch();
    setFormError(null);
  };

  const handleCreateError = (error: Error) => {
    setFormError(error.message);
  };

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

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Patients</h1>

      {/* Form Section */}
      <div className="mt-6">
        <CreatePatientForm onSuccess={handleCreateSuccess} onError={handleCreateError} />
        {formError && <p className="mt-2 text-sm text-(--warn)">Error: {formError}</p>}
      </div>

      {/* List Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Patients List</h2>
          <button
            onClick={() => void refetch()}
            className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm hover:bg-(--line) hover:cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {data.length === 0 ? (
          <p className="text-sm text-(--muted)">No patients found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-(--line)">
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
                    <td className="px-3 py-2 text-xs text-(--muted)">{p.id}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
