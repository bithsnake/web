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

  const totalPatients = data?.length ?? 0;
  const withEmailCount = (data ?? []).filter((patient) =>
    Boolean(patient.email),
  ).length;

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
      <section className="relative overflow-hidden rounded-2xl border border-(--line) bg-linear-to-br from-(--panel) via-(--panel) to-(--bg) p-5 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-(--brand)/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-(--brand)/10 blur-2xl" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">
            Patient Registry
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
            Patients
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-(--muted)">
            Keep patient records tidy, searchable, and quick to review from one
            clean workspace.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Total
              </p>
              <p className="mt-1 text-xl font-semibold">{totalPatients}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                With Email
              </p>
              <p className="mt-1 text-xl font-semibold">{withEmailCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Search Results
              </p>
              <p className="mt-1 text-xl font-semibold">
                {filteredPatients.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-(--line) bg-(--panel) p-4 md:p-5">
          <CreatePatientForm
            onSuccess={handleCreateSuccess}
            onError={handleCreateError}
          />
          {formError && (
            <p className="mt-3 rounded-md border border-(--warn)/30 bg-(--warn)/10 px-3 py-2 text-sm text-(--warn)">
              Error: {formError}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-(--line) bg-(--panel) p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Patients List</h2>
            {!selectedPatientId ? (
              <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                <input
                  value={search}
                  onChange={(event) => dispatch(setSearch(event.target.value))}
                  placeholder="Search by id, name, or email"
                  className="min-w-55 flex-1 rounded-xl border border-(--line) bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20"
                />
                <button
                  onClick={() => dispatch(clearSearch())}
                  className="rounded-xl border border-(--line) bg-white px-3 py-2 text-sm shadow-sm transition hover:cursor-pointer hover:bg-(--line)"
                >
                  Clear
                </button>
                <button
                  onClick={() => void refetch()}
                  className="rounded-xl border border-transparent bg-(--brand) px-3 py-2 text-sm text-white shadow-sm transition hover:cursor-pointer hover:bg-(--brand-strong)"
                >
                  Refresh
                </button>
              </div>
            ) : null}
          </div>

          {filteredPatients.length === 0 ? (
            <p className="rounded-xl border border-dashed border-(--line) bg-white/60 p-6 text-center text-sm text-(--muted)">
              No patients found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-(--line) bg-white">
              {selectedPatientId ? (
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Patient Details</h3>
                    <button
                      onClick={() => dispatch(clearSelectedPatientId())}
                      className="rounded-xl border border-(--line) bg-white px-3 py-1 text-sm transition hover:bg-(--line)"
                    >
                      Back to list
                    </button>
                  </div>

                  {isLoadingById ? (
                    <div className="flex flex-col items-center justify-center py-6">
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
        </section>
      </div>
    </AppShell>
  );
}
