"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { AppShell } from "../_components/app-shell";

import { ObjectDetailsTable } from "../_components/object-details-table";
import { useState, useMemo } from "react";
import { Billing, BILLING_OBJ_MAP } from "@/lib/types";
import {
  useGetBillingByIdQuery,
  useGetBillingsQuery,
} from "@/lib/features/billings-api";
import { CreateBillingForm } from "../_components/create-billing-form";
import { useSoftDeleteBillingMutation } from "@/lib/features/billings-api";
import {
  clearSearch,
  setSearch,
  setSelectedBillingId,
  clearSelectedBillingId,
} from "@/lib/features/billings-ui-slice";

import { BILLING_STATUS } from "@/lib/types";
import { ObjectsTable } from "../_components/objects-table";
import { QuickCreatePanel } from "../_components/quick-create-panel";

export default function BillingsPage() {
  const billingObjMap: Record<keyof Billing, string> = Object.entries(
    BILLING_OBJ_MAP,
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {} as Record<keyof Billing, string>,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch } = useGetBillingsQuery();
  const [softDeleteBilling] = useSoftDeleteBillingMutation();
  const [currentlySoftDeletingId, setCurrentlySoftDeletingId] = useState<
    number | null
  >(null);

  // search = useAppSelector((state) => state.appointmentsUi.search); // subscribe to value
  const search = useAppSelector((state) => state.billingsUi.search); // subscribe to value
  const selectedBillingId = useAppSelector(
    (state) => state.billingsUi.selectedBillingId,
  );

  const { currentData: billingById, isFetching: isLoadingById } =
    useGetBillingByIdQuery(selectedBillingId ?? 0, {
      skip: selectedBillingId === null,
      refetchOnMountOrArgChange: true,
    });

  console.log(selectedBillingId, billingById);
  const filteredBillings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data || [];
    if (!data) return [];

    console.log("Filtering billings with query:", query);

    return data.filter((billing) => {
      return (
        billing?.description?.toLowerCase().includes(query) ||
        String(billing.id).includes(query)
      );
    });
  }, [data, search]);

  const totalBillings = data?.length ?? 0;
  const draftCount = (data ?? []).filter(
    (billing) => String(billing.status).toUpperCase() === BILLING_STATUS.DRAFT,
  ).length;
  const paidCount = (data ?? []).filter(
    (billing) => String(billing.status).toUpperCase() === BILLING_STATUS.PAID,
  ).length;
  const canceledCount = (data ?? []).filter(
    (billing) =>
      String(billing.status).toUpperCase() === BILLING_STATUS.CANCELED,
  ).length;
  const deletedCount = (data ?? []).filter(
    (billing) =>
      String(billing.status).toUpperCase() === BILLING_STATUS.DELETED,
  ).length;
  const invoicedCount = (data ?? []).filter(
    (billing) =>
      String(billing.status).toUpperCase() === BILLING_STATUS.INVOICED,
  ).length;

  const handleCreateSuccess = (newBilling: Billing) => {
    void newBilling;
    void refetch();
    setFormError(null);
  };

  const handleCreateError = (error: Error) => {
    setFormError(error.message);
  };

  function isRowSoftDeleting(billingId: number): boolean {
    return currentlySoftDeletingId === billingId;
  }

  async function handleSoftDeleteClick(billingId: number) {
    const confirmed = window.confirm(
      "Delete this billing? This action cannot be undone.",
    );
    if (!confirmed) return;
    setFormError(null);

    try {
      setCurrentlySoftDeletingId(billingId);
      await softDeleteBilling(billingId).unwrap();

      if (selectedBillingId === billingId) {
        dispatch(clearSelectedBillingId());
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? JSON.stringify((error as unknown as { data: unknown }).data)
          : "Failed to delete billing. Please try again.";
      setFormError(message);
    } finally {
      setCurrentlySoftDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Billings</h1>
        <span className="spinner "></span>
        <p className="mt-2 text-sm text-(--muted)">Loading billings...</p>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Billings</h1>
        <p className="mt-2 text-sm text-(--muted)">
          An error occurred while fetching billings:{" "}
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
            Clinic Operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
            Billings
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-(--muted)">
            Manage billings, check live status distribution, and inspect details
            quickly from one surface.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Total
              </p>
              <p className="mt-1 text-xl font-semibold">{totalBillings}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Drafts
              </p>
              <p className="mt-1 text-xl font-semibold">{draftCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Invoiced
              </p>
              <p className="mt-1 text-xl font-semibold">{invoicedCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Paid
              </p>
              <p className="mt-1 text-xl font-semibold">{paidCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Canceled
              </p>
              <p className="mt-1 text-xl font-semibold">{canceledCount}</p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white/70 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-(--muted)">
                Deleted
              </p>
              <p className="mt-1 text-xl font-semibold">{deletedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[auto_minmax(0,1fr)]">
        <QuickCreatePanel>
          <CreateBillingForm
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
            <h2 className="text-lg font-semibold">Billings List</h2>
            {!selectedBillingId ? (
              <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                <input
                  value={search}
                  onChange={(event) => dispatch(setSearch(event.target.value))}
                  placeholder="Search by id or name"
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

          {filteredBillings.length === 0 ? (
            <p className="rounded-xl border border-dashed border-(--line) bg-white/60 p-6 text-center text-sm text-(--muted)">
              No billings found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-(--line) bg-white">
              {selectedBillingId ? (
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Billing Details</h3>
                    <button
                      onClick={() => dispatch(clearSelectedBillingId())}
                      className="rounded-xl border border-(--line) bg-white px-3 py-1 text-sm transition hover:bg-(--line)"
                    >
                      Back to list
                    </button>
                  </div>

                  {isLoadingById ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <span className="spinner "></span>
                      <p className="mt-2 text-sm text-(--muted)">
                        Loading appointment data...
                      </p>
                    </div>
                  ) : billingById ? (
                    <ObjectDetailsTable
                      data={billingById}
                      fieldTranslations={billingObjMap}
                      emptyText="No data available for this billing."
                    />
                  ) : (
                    <p className="mt-2 text-sm text-(--muted)">
                      An error occurred while fetching billing data.
                    </p>
                  )}
                </div>
              ) : (
                <ObjectsTable
                  data={filteredBillings}
                  fieldTranslations={{
                    id: "ID",
                    appointmentId: "Appointment ID",
                    description: "Description",
                    amount: "Amount",
                    createdAt: "Created At",
                    updatedAt: "Updated At",
                    status: "Status",
                  }}
                  onRowClick={(billing) =>
                    dispatch(setSelectedBillingId(billing.id))
                  }
                  onAction={(billing) => void handleSoftDeleteClick(billing.id)}
                  actionLabel={(billing) =>
                    isRowSoftDeleting(billing.id) ? "Deleting..." : "Delete"
                  }
                  isActionDisabled={(billing) => isRowSoftDeleting(billing.id)}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
