"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Appointment, APPOINTMENT_OBJ_MAP } from "@/lib/types";
import { AppShell } from "../_components/app-shell";
import {
  useGetAppointmentByIdQuery,
  useGetAppointmentsQuery,
  useSoftDeleteAppointmentMutation,
} from "@/lib/features/appointments-api";
import {
  clearSearch,
  clearSelectedAppointmentId,
  setSearch,
  setSelectedAppointmentId,
} from "@/lib/features/appointments-ui-slice";
import { ObjectDetailsTable } from "../_components/object-details-table";
import { ObjectsTable } from "../_components/objects-table";
import { CreateAppointmentForm } from "../_components/create-appointment-form";
import { useState, useMemo } from "react";

export default function AppointmentsPage() {
  const appointmentObjMap: Record<string, string> = Object.entries(
    APPOINTMENT_OBJ_MAP,
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch } = useGetAppointmentsQuery();
  const [softDeleteAppointment] = useSoftDeleteAppointmentMutation();
  const [currentlySoftDeletingId, setCurrentlySoftDeletingId] = useState<
    number | null
  >(null);

  // search = useAppSelector((state) => state.appointmentsUi.search); // subscribe to value
  const search = useAppSelector((state) => state.appointmentsUi.search); // subscribe to value
  const selectedAppointmentId = useAppSelector(
    (state) => state.appointmentsUi.selectedAppointmentId,
  );

  const { currentData: appointmentById, isFetching: isLoadingById } =
    useGetAppointmentByIdQuery(selectedAppointmentId ?? 0, {
      skip: selectedAppointmentId === null,
      refetchOnMountOrArgChange: true,
    });

  console.log(selectedAppointmentId, appointmentById);
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data || [];
    if (!data) return [];

    console.log("Filtering appointments with query:", query);

    return data.filter((appointment) => {
      return (
        appointment.name.toLowerCase().includes(query) ||
        String(appointment.id).includes(query)
      );
    });
  }, [data, search]);

  const handleCreateSuccess = (newAppointment: Appointment) => {
    void newAppointment;
    void refetch();
    setFormError(null);
  };

  const handleCreateError = (error: Error) => {
    setFormError(error.message);
  };

  function isRowSoftDeleting(appointmentId: number): boolean {
    return currentlySoftDeletingId === appointmentId;
  }

  async function handleSoftDeleteClick(appointmentId: number) {
    const confirmed = window.confirm(
      "Delete this appointment? This action cannot be undone.",
    );
    if (!confirmed) return;
    setFormError(null);

    try {
      setCurrentlySoftDeletingId(appointmentId);
      await softDeleteAppointment(appointmentId).unwrap();

      if (selectedAppointmentId === appointmentId) {
        dispatch(clearSelectedAppointmentId());
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : "Failed to delete appointment";
      setFormError(message);
    } finally {
      setCurrentlySoftDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <span className="spinner "></span>
        <p className="mt-2 text-sm text-(--muted)">Loading appointments...</p>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="mt-2 text-sm text-(--muted)">
          An error occurred while fetching appointments:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Appointments</h1>

      <div className="mt-6">
        <CreateAppointmentForm
          onSuccess={handleCreateSuccess}
          onError={handleCreateError}
        />
        {formError && (
          <p className="mt-2 text-sm text-(--warn)">Error: {formError}</p>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Appointments List</h2>
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

        {filteredAppointments.length === 0 ? (
          <p className="text-sm text-(--muted)">No appointments found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-(--line)">
            {selectedAppointmentId ? (
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">
                    Appointment Details
                  </h3>
                  <button
                    onClick={() => dispatch(clearSelectedAppointmentId())}
                    className="rounded-lg border border-(--line) bg-white px-3 py-1 text-sm hover:bg-(--line)"
                  >
                    Back to list
                  </button>
                </div>

                {isLoadingById ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="spinner "></span>
                    <p className="mt-2 text-sm text-(--muted)">
                      Loading appointment data...
                    </p>
                  </div>
                ) : appointmentById ? (
                  <ObjectDetailsTable
                    data={appointmentById}
                    fieldTranslations={appointmentObjMap}
                    emptyText="No data available for this appointment."
                  />
                ) : (
                  <p className="mt-2 text-sm text-(--muted)">
                    An error occurred while fetching appointment data.
                  </p>
                )}
              </div>
            ) : (
              <ObjectsTable
                data={filteredAppointments}
                fieldTranslations={{
                  id: "ID",
                  name: "Name",
                  email: "Email",
                  createdAt: "Created At",
                  updatedAt: "Updated At",
                }}
                onRowClick={(appointment) =>
                  dispatch(setSelectedAppointmentId(appointment.id))
                }
                onAction={(appointment) =>
                  void handleSoftDeleteClick(appointment.id)
                }
                actionLabel={(appointment) =>
                  isRowSoftDeleting(appointment.id) ? "Deleting..." : "Delete"
                }
                isActionDisabled={(appointment) =>
                  isRowSoftDeleting(appointment.id)
                }
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
