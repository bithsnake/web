"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Appointment,
  APPOINTMENT_OBJ_MAP,
  APPOINTMENT_TYPE_COLOR_TONE_MAP,
} from "@/lib/types";
import { AppShell } from "../_components/shells/app-shell";
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
import { CreateAppointmentForm } from "../_components/forms/create-appointment-form";
import { useState, useMemo, useEffect, useRef } from "react";
import { ObjectsTable } from "../_components/objects-table";
import { QuickCreatePanel } from "../_components/quick-create-panel";
import { BrandButton } from "../_components/buttons/brand-button";
import { useCreateReminderMutation } from "@/lib/features/reminders-api";
import { useScrollToRef } from "../shared/hooks";

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
  const [ref, scrollTo] = useScrollToRef<HTMLTableRowElement>();

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

  const [
    createReminder,
    {
      isLoading: isCreatingReminder,
      isError: isCreatingReminderError,
      isSuccess: isCreatingReminderSuccess,
    },
  ] = useCreateReminderMutation();

  console.log(selectedAppointmentId, appointmentById);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = data ? [...data] : []; // spread to unfreeze
    const filtered = query
      ? source.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            String(a.id).includes(query),
        )
      : source;
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data, search]);

  const totalAppointments = data?.length ?? 0;
  const scheduledCount = (data ?? []).filter(
    (appointment) => String(appointment.status).toUpperCase() === "SCHEDULED",
  ).length;
  const completedCount = (data ?? []).filter(
    (appointment) => String(appointment.status).toUpperCase() === "COMPLETED",
  ).length;
  const canceledCount = (data ?? []).filter(
    (appointment) => String(appointment.status).toUpperCase() === "CANCELED",
  ).length;

  const prevDataLengthRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const prevLength = prevDataLengthRef.current;
    const newLength = data?.length;
    if (
      prevLength !== undefined &&
      newLength !== undefined &&
      newLength > prevLength
    ) {
      const row = ref.current;
      row?.classList.remove("animate-highlight");
      void row?.offsetHeight; // force reflow
      row?.classList.add("animate-highlight");
      row?.addEventListener(
        "animationend",
        () => row.classList.remove("animate-highlight"),
        { once: true },
      );
    }
    prevDataLengthRef.current = newLength;
  }, [data, filteredAppointments, ref]);

  const handleCreateSuccess = async (newAppointment: Appointment) => {
    void newAppointment;
    await refetch();
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

  async function handleSendReminder(
    appointmentId: number,
    message: string = "MESSAGE",
  ) {
    // open up reminder message modal
    const confirmed = window.confirm(
      "Do you want to send a reminder to the patient in this appointment?",
    );

    if (!confirmed) return;

    console.log(appointmentId);

    try {
      const appointment = data?.find(
        (appointment) => appointment.id === appointmentId,
      );

      if (!appointment) throw new Error("Appointment does not exist");

      const reminderDto = {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        message,
      };

      const response = await createReminder(reminderDto).unwrap();

      if (response) {
        void refetch();
      } else {
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : "Failed to create reminder";
      setFormError(message);
    }
  }

  if (isLoading || isCreatingReminder) {
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

  if (isCreatingReminderError) {
    window.alert("error while trying to create a reminder");
  }

  if (isCreatingReminderSuccess) {
    window.alert("reminder created and sent!");
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl border border-(--line) bg-linear-to-br from-(--panel) via-(--panel) to-(--bg) p-5 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-(--brand)/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-(--brand)/10 blur-2xl" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">
            Clinic Operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
            Appointments
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-(--muted)">
            Manage scheduling, check live status distribution, and inspect
            details quickly from one surface.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Total
              </p>
              <p className="mt-1 text-xl font-semibold">{totalAppointments}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Scheduled
              </p>
              <p className="mt-1 text-xl font-semibold">{scheduledCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Completed
              </p>
              <p className="mt-1 text-xl font-semibold">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Canceled
              </p>
              <p className="mt-1 text-xl font-semibold">{canceledCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[auto_minmax(0,1fr)]">
        <QuickCreatePanel>
          <CreateAppointmentForm
            onSuccess={handleCreateSuccess}
            onError={handleCreateError}
          />
          {formError && (
            <p className="mt-3 rounded-md border border-(--warn)/30 bg-(--warn)/10 px-3 py-2 text-sm text-(--warn)">
              Error: {formError}
            </p>
          )}
        </QuickCreatePanel>

        <section className="rounded-2xl border border-(--line) bg-(--panel) p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Appointments List</h2>
            {!selectedAppointmentId ? (
              <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                <input
                  value={search}
                  onChange={(event) => dispatch(setSearch(event.target.value))}
                  placeholder="Search by id or name"
                  className="min-w-55 flex-1 rounded-xl border border-(--line) bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20"
                />
                <BrandButton
                  onClick={() => dispatch(clearSearch())}
                  variant="alternate"
                  className="px-3 py-2"
                >
                  Clear
                </BrandButton>
                <BrandButton
                  onClick={() => void refetch()}
                  className="px-3 py-2"
                >
                  Refresh
                </BrandButton>
              </div>
            ) : null}
          </div>

          {filteredAppointments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-(--line) bg-white/60 p-6 text-center text-sm text-(--muted)">
              No appointments found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-(--line) bg-white">
              {selectedAppointmentId ? (
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      Appointment Details
                    </h3>
                    <BrandButton
                      onClick={() => dispatch(clearSelectedAppointmentId())}
                      variant="alternate"
                      className="px-3 py-1"
                    >
                      Back to list
                    </BrandButton>
                  </div>

                  {isLoadingById ? (
                    <div className="flex flex-col items-center justify-center py-6">
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
                      typeColorMap={APPOINTMENT_TYPE_COLOR_TONE_MAP}
                    />
                  ) : (
                    <p className="mt-2 text-sm text-(--muted)">
                      An error occurred while fetching appointment data.
                    </p>
                  )}
                </div>
              ) : (
                <ObjectsTable
                  firstElementRef={ref}
                  data={filteredAppointments}
                  fieldTranslations={{
                    id: "ID",
                    name: "Name",
                    patientId: "Patient ID",
                    userId: "Dentist ID",
                    date: "Appointment Date",
                    createdAt: "Created At",
                    updatedAt: "Updated At",
                    type: "Type",
                    status: "Status",
                  }}
                  typeColorMap={APPOINTMENT_TYPE_COLOR_TONE_MAP}
                  onRowClick={(appointment) =>
                    dispatch(setSelectedAppointmentId(appointment.id))
                  }
                  onActions={[
                    {
                      onAction: (appointment) =>
                        void handleSoftDeleteClick(appointment.id),
                      actionLabel: (appointment) =>
                        isRowSoftDeleting(appointment.id)
                          ? "Deleting..."
                          : "Delete",
                      isActionDisabled: (appointment) =>
                        isRowSoftDeleting(appointment.id),
                    },
                    {
                      onAction: (appointment) =>
                        void handleSendReminder(appointment.id),
                      actionLabel: "Send Reminder",
                      isActionDisabled: (appointment) =>
                        isRowSoftDeleting(appointment.id) ||
                        void appointment.status === "CANCELED" ||
                        void appointment.status === "COMPLETED",
                      // we need to get reminders for this apointment to be ablet o to know if we can send a reminder or not, but for now let's just disable the button if the appointment is not scheduled
                    },
                  ]}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
