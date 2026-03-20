"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  clearSearch,
  setSearch,
  setSelectedPatientId,
  clearSelectedPatientId,
} from "@/lib/features/patients-ui-slice";
import { AppShell } from "../_components/app-shell";
import { Patient } from "../../lib/types";
import { useMemo, useState } from "react";
import { CreatePatientForm } from "../_components/create-patient-form";
import {
  useGetPatientsQuery,
  useDeletePatientMutation,
  useGetPatientByIdQuery,
} from "@/lib/features/patients-api";
import { ObjectDetailsTable } from "../_components/object-details-table";
import { ObjectsTable } from "../_components/objects-table";

export default function PatientsPage() {
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch } = useGetPatientsQuery();
  const [deletePatient] = useDeletePatientMutation();
  const [currentlyDeletingId, setCurrentlyDeletingId] = useState<number | null>(
    null,
  );

  // search = useAppSelector((state) => state.patientsUi.search); // subscribe to value
  const search = useAppSelector((state) => state.patientsUi.search); // subscribe to value
  const selectedPatientId = useAppSelector(
    (state) => state.patientsUi.selectedPatientId,
  );

  const { currentData: patientById, isFetching: isLoadingById } =
    useGetPatientByIdQuery(selectedPatientId ?? 0, {
      skip: selectedPatientId === null,
      refetchOnMountOrArgChange: true,
    });

  console.log(selectedPatientId, patientById);
  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data || [];
    if (!data) return [];

    console.log("Filtering patients with query:", query);

    return data.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        String(patient.id).includes(query)
      );
    });
  }, [data, search]);

  const handleCreateSuccess = (newPatient: Patient) => {
    void newPatient;
    void refetch();
    setFormError(null);
  };

  const handleCreateError = (error: Error) => {
    setFormError(error.message);
  };

  function isRowDeleting(patientId: number): boolean {
    return currentlyDeletingId === patientId;
  }

  async function handleDeleteClick(patientId: number) {
    const confirmed = window.confirm(
      "Delete this patient? This action cannot be undone.",
    );
    if (!confirmed) return;
    setFormError(null);

    try {
      setCurrentlyDeletingId(patientId);
      await deletePatient(patientId).unwrap();

      if (selectedPatientId === patientId) {
        dispatch(clearSelectedPatientId());
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : "Failed to delete patient";
      setFormError(message);
    } finally {
      setCurrentlyDeletingId(null);
    }
  }

  if (isLoading) {
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
        <CreatePatientForm
          onSuccess={handleCreateSuccess}
          onError={handleCreateError}
        />
        {formError && (
          <p className="mt-2 text-sm text-(--warn)">Error: {formError}</p>
        )}
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
            {selectedPatientId ? (
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Patient Details</h3>
                  <button
                    onClick={() => dispatch(clearSelectedPatientId())}
                    className="rounded-lg border border-(--line) bg-white px-3 py-1 text-sm hover:bg-(--line)"
                  >
                    Back to list
                  </button>
                </div>

                {isLoadingById ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="spinner "></span>
                    <p className="mt-2 text-sm text-(--muted)">
                      Loading patient data...
                    </p>
                  </div>
                ) : patientById ? (
                  <ObjectDetailsTable
                    data={patientById}
                    fieldTranslations={{
                      id: "ID",
                      name: "Name",
                      email: "Email",
                      createdAt: "Created At",
                      updatedAt: "Updated At",
                    }}
                  />
                ) : (
                  <p className="mt-2 text-sm text-(--muted)">
                    An error occurred while fetching patient data.
                  </p>
                )}
              </div>
            ) : (
              <ObjectsTable
                data={filteredPatients}
                fieldTranslations={{
                  id: "ID",
                  name: "Name",
                  email: "Email",
                  createdAt: "Created At",
                  updatedAt: "Updated At",
                }}
                onRowClick={(patient) =>
                  dispatch(setSelectedPatientId(patient.id))
                }
                onAction={(patient) => void handleDeleteClick(patient.id)}
                actionLabel={(patient) =>
                  isRowDeleting(patient.id) ? "Deleting..." : "Delete"
                }
                isActionDisabled={(patient) => isRowDeleting(patient.id)}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
