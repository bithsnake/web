"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearSearch, setSearch } from "@/lib/features/patients-ui-slice";
import { AppShell } from "../_components/app-shell";
import { Patient } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CreatePatientForm } from "../_components/create-patient-form";
import { getAllPatients, getPatientById } from "./patients-api.service";

export default function PatientsPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const search = useAppSelector((state) => state.patientsUi.search); // subscribe to value

  const queryClient = useQueryClient();

  const { data, isPending, error, refetch } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await getAllPatients();
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }
      return (await response.json()) as Patient[];
    },
  });

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data || [];
    if (!data) return [];

    return data.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        String(patient.id).includes(query)
      );
    });
  }, [data, search]);

  const deleteMutation = useMutation({
    mutationFn: async (patientId: number) => {
      setFormError(null);

      const response = await getPatientById(patientId);

      if (!response.ok) {
        const responseBody = await response.text().catch(() => "");
        let backendMessage = "";

        if (responseBody) {
          try {
            const parsedBody = JSON.parse(responseBody) as {
              message?: string | string[];
            };

            if (Array.isArray(parsedBody.message)) {
              backendMessage = parsedBody.message.join(", ");
            } else if (typeof parsedBody.message === "string") {
              backendMessage = parsedBody.message;
            }
          } catch {
            backendMessage = responseBody;
          }
        }

        const fallbackMessage =
          response.status === 409
            ? "Cannot delete patient because they have related appointments."
            : `Failed to delete patient (${response.status})`;

        throw new Error(backendMessage || fallbackMessage);
      }
    },
    onSuccess: () => {
      setFormError(null);
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (mutationError) => {
      setFormError(mutationError.message);
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

  function handleDeleteClick(patientId: number) {
    const confirmed = window.confirm("Delete this patient? This action cannot be undone.");

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(patientId);
  }

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
          An error occurred while fetching patients:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </AppShell>
    );
  }

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
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(event) => dispatch(setSearch(event.target.value))}
              placeholder="Search by id, name, or email"
              className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm"
            />
            <button
              onClick={() => dispatch(clearSearch())}
              className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm hover:cursor-pointer hover:bg-(--line)"
            >
              Clear
            </button>
            <button
              onClick={() => void refetch()}
              className="rounded-lg border border-(--line) bg-white px-3 py-2 text-sm hover:cursor-pointer hover:bg-(--line)"
            >
              Refresh
            </button>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
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
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="border-t border-(--line) hover:bg-(--line)">
                    <td className="px-3 py-2 text-xs text-(--muted)">{p.id}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.email}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteClick(p.id)}
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
