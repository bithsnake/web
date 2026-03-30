"use client";

import { useCreateBillingMutation } from "@/lib/features/billings-api";
import { Billing } from "@/lib/types";
import { useState } from "react";
import { SelectField } from "./select-field";
import { useGetAppointmentsQuery } from "@/lib/features/appointments-api";
import { BrandButton } from "./brand-button";

interface CreateBillingFormProps {
  onSuccess: (billing: Billing) => void;
  onError: (error: Error) => void;
}

export function CreateBillingForm({
  onSuccess,
  onError,
}: CreateBillingFormProps) {
  const [description, setDescription] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [dirty, setDirty] = useState({
    description: false,
    appointmentId: false,
    amount: false,
    date: false,
  });

  useGetAppointmentsQuery();
  const { data: appointments = [], isLoading: isAppointmentsLoading } =
    useGetAppointmentsQuery();

  const [createBilling, { isLoading }] = useCreateBillingMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasMissingRequired =
      !description || !appointmentId || !amount || !date;
    if (hasMissingRequired) {
      return;
    }

    try {
      const newBilling = await createBilling({
        description,
        appointmentId: Number(appointmentId),
        amount: Number(amount),
      }).unwrap();

      console.log(newBilling);

      onSuccess(newBilling);
      setDescription("");
      setAppointmentId("");
      setAmount("");
      setDate("");
      setDirty({
        description: false,
        appointmentId: false,
        amount: false,
        date: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error("An unknown error occurred"));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border border-(--line) bg-linear-to-br from-white to-(--panel) p-5"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">
          Quick Create
        </p>
        <h2 className="mt-1 text-lg font-semibold">Add New Billing</h2>
      </div>

      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDirty((current) => ({ ...current, description: true }));
          }}
          onBlur={() =>
            setDirty((current) => ({ ...current, description: true }))
          }
          required
          disabled={isLoading}
          className={[
            "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20",
            dirty.description && !description
              ? "border-(--warn) ring-1 ring-(--warn)/25"
              : "border-(--line)",
          ].join(" ")}
          placeholder="Teeth cleaning"
        />
        {dirty.description && !description ? (
          <p className="rounded-md border border-(--warn)/30 bg-(--warn)/10 px-2 py-1 text-xs text-(--warn)">
            Enter a description to continue.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Appointment"
          value={appointmentId}
          onChange={setAppointmentId}
          onDirtyChange={(isDirty) =>
            setDirty((current) => ({ ...current, appointmentId: isDirty }))
          }
          dirty={dirty.appointmentId}
          sortAlphabetically
          disabled={isLoading || isAppointmentsLoading}
          required
          options={appointments.map((appointment) => {
            const date = new Date(appointment.date).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            });
            return {
              value: String(appointment.id),
              label: `${appointment.name} - ${date}`,
            };
          })}
        />
      </div>

      {isLoading || isAppointmentsLoading ? (
        <p className="text-xs text-(--muted)">Loading dropdown options...</p>
      ) : null}

      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium">Date and time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setDirty((current) => ({ ...current, date: true }));
          }}
          onBlur={() => setDirty((current) => ({ ...current, date: true }))}
          required
          disabled={isLoading}
          className={[
            "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20",
            dirty.date && !date
              ? "border-(--warn) ring-1 ring-(--warn)/25"
              : "border-(--line)",
          ].join(" ")}
        />
        {dirty.date && !date ? (
          <p className="rounded-md border border-(--warn)/30 bg-(--warn)/10 px-2 py-1 text-xs text-(--warn)">
            Choose a date and time to continue.
          </p>
        ) : null}
      </div>

      <BrandButton
        type="submit"
        disabled={isLoading}
        className="w-full px-3 py-2.5"
      >
        {isLoading ? "Adding..." : "Add Billing"}
      </BrandButton>
    </form>
  );
}
