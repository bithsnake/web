'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Appointment, APPOINTMENT_OBJ_MAP, APPOINTMENT_TYPE_COLOR_TONE_MAP } from '@/lib/types';
import { AppShell } from '../_components/shells/app-shell';
import {
  useGetAppointmentByIdQuery,
  useGetAppointmentsQuery,
  useSoftDeleteAppointmentMutation,
} from '@/lib/features/appointments-api';
import {
  clearSearch,
  clearSelectedAppointmentId,
  setSearch,
  setSelectedAppointmentId,
} from '@/lib/features/appointments-ui-slice';
import { ObjectDetailsTable } from '../_components/object-details-table';
import { CreateAppointmentForm } from '../_components/forms/create-appointment-form';
import { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { ObjectsTable } from '../_components/objects-table';
import { QuickCreatePanel } from '../_components/panels/quick-create-panel';
import { BrandButton } from '../_components/buttons/brand-button';
import { useCreateReminderMutation } from '@/lib/features/reminders-api';
import { useScrollToRef } from '../shared/hooks';
import { CardModal } from '../_components/card-modal';
import { CardModalFooter } from '../_components/card-modal-footer';
import SnackBarContext from '../contexts/snackbar-context';

const TEMP_LOGGED_IN_USER = {
  id: 1,
  name: 'Dr. Smith',
};

export default function AppointmentsPage() {
  const snackBarContext = useContext(SnackBarContext);
  const appointmentObjMap: Record<string, string> = Object.entries(APPOINTMENT_OBJ_MAP).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string>(''); // New state for reminder message
  const [sendAsLoggedInUser, setSendAsLoggedInUser] = useState<boolean>(false); // Checkbox state

  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch } = useGetAppointmentsQuery();
  const [softDeleteAppointment] = useSoftDeleteAppointmentMutation();
  const [currentlySoftDeletingId, setCurrentlySoftDeletingId] = useState<number | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<{
    appointmentId: number | null;
    appointMentDoctorName: string | null;
    isOpen: boolean;
    isClosed: boolean;
  }>({ appointmentId: null, appointMentDoctorName: null, isOpen: false, isClosed: true });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{
    appointmentId: number | null;
    appointMentDoctorName: string | null;
    isOpen: boolean;
    isClosed: boolean;
  }>({ appointmentId: null, appointMentDoctorName: null, isOpen: false, isClosed: true });
  const [ref] = useScrollToRef<HTMLTableRowElement>();

  const sendReminderModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // search = useAppSelector((state) => state.appointmentsUi.search); // subscribe to value
  const search = useAppSelector((state) => state.appointmentsUi.search); // subscribe to value
  const selectedAppointmentId = useAppSelector(
    (state) => state.appointmentsUi.selectedAppointmentId,
  );

  const { currentData: appointmentById, isFetching: isLoadingById } = useGetAppointmentByIdQuery(
    selectedAppointmentId ?? 0,
    {
      skip: selectedAppointmentId === null,
      refetchOnMountOrArgChange: true,
    },
  );

  const [
    createReminder,
    {
      isLoading: isCreatingReminder,
      isError: isCreatingReminderError,
      // isSuccess: isCreatingReminderSuccess,
    },
  ] = useCreateReminderMutation();

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = data ? [...data] : []; // spread to unfreeze
    const filtered = query
      ? source.filter((a) => a.name.toLowerCase().includes(query) || String(a.id).includes(query))
      : source;
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data, search]);

  const totalAppointments = data?.length ?? 0;
  const scheduledCount = (data ?? []).filter(
    (appointment) => String(appointment.status).toUpperCase() === 'SCHEDULED',
  ).length;
  const completedCount = (data ?? []).filter(
    (appointment) => String(appointment.status).toUpperCase() === 'COMPLETED',
  ).length;
  const canceledCount = (data ?? []).filter(
    (appointment) => String(appointment.status).toUpperCase() === 'CANCELED',
  ).length;

  const prevDataLengthRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const prevLength = prevDataLengthRef.current;
    const newLength = data?.length;
    if (prevLength !== undefined && newLength !== undefined && newLength > prevLength) {
      const row = ref.current;
      row?.classList.remove('animate-highlight');
      void row?.offsetHeight; // force reflow
      row?.classList.add('animate-highlight');
      row?.addEventListener('animationend', () => row.classList.remove('animate-highlight'), {
        once: true,
      });
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
    setFormError(null);
    let success = false;
    try {
      setCurrentlySoftDeletingId(appointmentId);
      await softDeleteAppointment(appointmentId).unwrap();
      dispatch(clearSelectedAppointmentId());
      success = true;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : 'Failed to delete appointment';
      setFormError(message);
      snackBarContext?.('error', message);
      success = false;
    } finally {
      setCurrentlySoftDeletingId(null);
    }
    return success;
  }

  async function handleSendReminder(appointmentId: number | null, message: string = 'MESSAGE') {
    if (appointmentId === null) return;
    console.log(sendReminderModalRef);

    try {
      const appointment = data?.find((appointment) => appointment.id === appointmentId);

      if (!appointment || ['CANCELED', 'COMPLETED', 'DELETED'].includes(appointment.status)) {
        throw new Error('Cannot send reminder for this appointment');
      }

      const signature = `\n\nMvh, ${sendAsLoggedInUser ? TEMP_LOGGED_IN_USER.name : appointment.userId}\nDentis Team`; // Use logged-in user name if checkbox is checked

      message = reminderMessage || message; // use the state value if available
      message += signature; // append the signature to the message

      const reminderDto = {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        message,
      };

      const response = await createReminder(reminderDto).unwrap();

      if (response) {
        // show success snackbar
        snackBarContext?.('success', 'Reminder created successfully');
        handleCloseSendReminderModal();
        void refetch();
      }
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : 'Failed to create reminder';
      setFormError(message);
      snackBarContext?.('error', message);
    }
  }

  async function handleDeleteAppointment(
    appointmentId: number | null,
    message: string = 'MESSAGE',
  ) {
    if (appointmentId === null) return;

    try {
      const appointment = data?.find((appointment) => appointment.id === appointmentId);

      if (!appointment || ['CANCELED', 'COMPLETED', 'DELETED'].includes(appointment.status)) {
        throw new Error('Cannot delete this appointment');
      }

      const deleteDto = {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        message,
      };

      const response = await handleSoftDeleteClick(deleteDto.appointmentId);

      if (response) {
        // show success snackbar
        snackBarContext?.('success', 'Appointment deleted successfully');
        void refetch();
      }
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : 'Failed to delete appointment';
      setFormError(message);
      snackBarContext?.('error', message);
    }
  }

  function handleCloseSendReminderModal() {
    console.log('closing modal');

    setIsReminderModalOpen({
      ...isReminderModalOpen,
      appointmentId: null,
      appointMentDoctorName: null,
      isOpen: false,
    });
  }
  function handleCloseDeleteModal() {
    setIsDeleteModalOpen({
      ...isDeleteModalOpen,
      appointmentId: null,
      isOpen: false,
    });
  }

  if (isLoading && !isCreatingReminder) {
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
          An error occurred while fetching appointments:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </AppShell>
    );
  }

  if (isCreatingReminderError) {
    window.alert('error while trying to create a reminder');
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl border border-(--line) bg-linear-to-br from-(--panel) via-(--panel) to-(--bg) p-5 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-(--brand)/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-(--brand)/10 blur-2xl" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">Clinic Operations</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">Appointments</h1>
          <p className="mt-2 max-w-2xl text-sm text-(--muted)">
            Manage scheduling, check live status distribution, and inspect details quickly from one
            surface.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">Total</p>
              <p className="mt-1 text-xl font-semibold">{totalAppointments}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">Scheduled</p>
              <p className="mt-1 text-xl font-semibold">{scheduledCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">Completed</p>
              <p className="mt-1 text-xl font-semibold">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">Canceled</p>
              <p className="mt-1 text-xl font-semibold">{canceledCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[auto_minmax(0,1fr)]">
        <QuickCreatePanel>
          <CreateAppointmentForm onSuccess={handleCreateSuccess} onError={handleCreateError} />
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
                <BrandButton onClick={() => void refetch()} className="px-3 py-2">
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
                    <h3 className="text-base font-semibold">Appointment Details</h3>
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
                      <p className="mt-2 text-sm text-(--muted)">Loading appointment data...</p>
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
                  fieldTranslationsInOrder={{
                    id: 'ID',
                    name: 'Name',
                    patientId: 'Patient ID',
                    userName: 'Dentist Name',
                    date: 'Appointment Date',
                    createdAt: 'Created At',
                    updatedAt: 'Updated At',
                    type: 'Type',
                    status: 'Status',
                    lastRemindedAt: 'Last Reminded At',
                  }}
                  typeColorMap={APPOINTMENT_TYPE_COLOR_TONE_MAP}
                  onRowClick={(appointment) => dispatch(setSelectedAppointmentId(appointment.id))}
                  onActions={[
                    {
                      onAction: (appointment) =>
                        void setIsDeleteModalOpen({
                          ...isDeleteModalOpen,
                          appointmentId: appointment.id,
                          isOpen: true,
                          isClosed: false,
                        }),
                      actionLabel: (appointment) =>
                        isRowSoftDeleting(appointment.id) ? 'Deleting...' : 'Delete',
                      isActionDisabled: (appointment) =>
                        isRowSoftDeleting(appointment.id) ||
                        ['CANCELED', 'COMPLETED', 'DELETED'].includes(appointment.status),
                    },
                    {
                      onAction: (appointment) =>
                        void setIsReminderModalOpen({
                          ...isReminderModalOpen,
                          appointmentId: appointment?.id,
                          appointMentDoctorName: appointment.userName,
                          isOpen: true,
                          isClosed: false,
                        }),
                      actionLabel: 'Send Reminder',
                      isActionDisabled: (appointment) =>
                        isRowSoftDeleting(appointment.id) ||
                        void appointment.status === 'CANCELED' ||
                        void appointment.status === 'COMPLETED',
                      // we need to get reminders for this apointment to be ablet o to know if we can send a reminder or not, but for now let's just disable the button if the appointment is not scheduled
                    },
                  ]}
                />
              )}
            </div>
          )}
        </section>
      </div>
      {/* MODALS */}
      <>
        {isDeleteModalOpen.isOpen && !isDeleteModalOpen.isClosed && (
          <CardModal
            modalRef={deleteModalRef ?? null}
            isOpen={isDeleteModalOpen.isOpen}
            modalState={setIsDeleteModalOpen}
            onClose={() => handleCloseDeleteModal()}
            title="Delete Appointment"
          >
            <p className="mb-4 text-sm text-(--muted)">
              Are you sure you want to delete this appointment?
            </p>

            <CardModalFooter>
              <BrandButton
                onClick={() => handleCloseDeleteModal()}
                variant="alternate"
                className="px-3 py-1"
              >
                Cancel
              </BrandButton>
              <BrandButton
                onClick={() => handleDeleteAppointment(isDeleteModalOpen.appointmentId ?? null)}
                variant="primary"
                className="px-3 py-1"
              >
                Delete
              </BrandButton>
            </CardModalFooter>
          </CardModal>
        )}
        ,
        {isReminderModalOpen.isOpen && !isReminderModalOpen.isClosed && (
          <CardModal
            modalRef={sendReminderModalRef ?? null}
            isOpen={isReminderModalOpen.isOpen}
            modalState={setIsReminderModalOpen}
            onClose={() => handleCloseSendReminderModal()}
            title="Send Reminder"
          >
            <div className="flex flex-col items-start gap-3">
              <textarea
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                placeholder="Add reminder text"
                cols={30}
                rows={10}
                className="w-full flex-1 rounded-md border border-(--line) bg-white px-3 py-2  shadow-sm outline-none focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20"
              ></textarea>
              <div className="mt-4 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="sendAsLoggedInUser"
                  checked={sendAsLoggedInUser}
                  onChange={(e) => setSendAsLoggedInUser(e.target.checked)}
                  className="h-4 w-4 rounded border border-(--line) bg-white cursor-pointer"
                />
                <label
                  htmlFor="sendAsLoggedInUser"
                  className="cursor-pointer text-sm text-(--muted)"
                >
                  Send as {TEMP_LOGGED_IN_USER.name} instead of appointment doctor
                  {isReminderModalOpen.appointMentDoctorName
                    ? ` (${isReminderModalOpen.appointMentDoctorName})`
                    : ''}
                </label>
              </div>
            </div>

            <CardModalFooter>
              <BrandButton
                onClick={() => handleCloseSendReminderModal()}
                variant="alternate"
                className="px-3 py-1"
              >
                Cancel
              </BrandButton>
              <BrandButton
                onClick={() => handleSendReminder(isReminderModalOpen.appointmentId ?? null)}
                variant="primary"
                className="px-3 py-1"
              >
                Send Reminder
              </BrandButton>
            </CardModalFooter>
          </CardModal>
        )}
      </>
    </AppShell>
  );
}
