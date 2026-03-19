"use client";

import { API_BASE_URL } from "@/lib/api";
import { AppShell } from "../_components/app-shell";
import { Patient } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CreatePatientForm } from "../_components/create-patient-form";

export default function PatientsPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/patients`);
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }
      return (await response.json()) as Patient[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const handleCreateSuccess = (newPatient: Patient) => {
    void newPatient;
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

  const patients = data ?? [];

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Patients</h1>

      <div className="mt-6">
        <CreatePatientForm onSuccess={handleCreateSuccess} onError={handleCreateError} />
        {formError && <p className="mt-2 text-sm text-(--warn)">Error: {formError}</p>}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Patients List</h2>
          <button
            onClick={() => void refetch()}
            className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm hover:cursor-pointer hover:bg-(--line)"
          >
            Refresh
          </button>
        </div>

        {patients.length === 0 ? (
          <p className="text-sm text-(--muted)">No patients found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-(--line)">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-(--line) text-(--muted) uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-t border-(--line) hover:bg-(--line)">
                    <td className="px-3 py-2 text-xs text-(--muted)">{p.id}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.email}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => deleteMutation.mutate(p.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </td>
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
