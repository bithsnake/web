"use client";

import {
  useCreateAppointmentMutation,
  useGetDoctorsQuery,
} from "@/lib/features/appointments-api";
import { useGetPatientsQuery } from "@/lib/features/patients-api";
import { Appointment } from "@/lib/types";
import { useState } from "react";
import { SelectField } from "./select-field";

interface CreateAppointmentFormProps {
  onSuccess: (appointment: Appointment) => void;
  onError: (error: Error) => void;
}

export function CreateAppointmentForm({
  onSuccess,
  onError,
}: CreateAppointmentFormProps) {
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [dirty, setDirty] = useState({
    name: false,
    patientId: false,
    userId: false,
    date: false,
  });

  const { data: patients = [], isLoading: isPatientsLoading } =
    useGetPatientsQuery();
  const { data: doctors = [], isLoading: isDoctorsLoading } =
    useGetDoctorsQuery();

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasMissingRequired = !name || !patientId || !userId || !date;
    if (hasMissingRequired) {
      return;
    }

    try {
      const newAppointment = await createAppointment({
        name,
        patientId: Number(patientId),
        userId: Number(userId),
        date: new Date(date).toISOString(),
      }).unwrap();

      console.log(newAppointment);

      onSuccess(newAppointment);
      setName("");
      setPatientId("");
      setUserId("");
      setDate("");
      setDirty({
        name: false,
        patientId: false,
        userId: false,
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
        <h2 className="mt-1 text-lg font-semibold">Add New Appointment</h2>
      </div>

      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setDirty((current) => ({ ...current, name: true }));
          }}
          onBlur={() => setDirty((current) => ({ ...current, name: true }))}
          required
          disabled={isLoading}
          className={[
            "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20",
            dirty.name && !name
              ? "border-(--warn) ring-1 ring-(--warn)/25"
              : "border-(--line)",
          ].join(" ")}
          placeholder="Teeth cleaning"
        />
        {dirty.name && !name ? (
          <p className="rounded-md border border-(--warn)/30 bg-(--warn)/10 px-2 py-1 text-xs text-(--warn)">
            Enter a name to continue.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Patient"
          value={patientId}
          onChange={setPatientId}
          onDirtyChange={(isDirty) =>
            setDirty((current) => ({ ...current, patientId: isDirty }))
          }
          dirty={dirty.patientId}
          sortAlphabetically
          disabled={isLoading || isPatientsLoading}
          required
          options={patients.map((patient) => ({
            value: String(patient.id),
            label: `${patient.name} (${patient.email})`,
          }))}
        />

        <SelectField
          label="Doctor"
          value={userId}
          onChange={setUserId}
          onDirtyChange={(isDirty) =>
            setDirty((current) => ({ ...current, userId: isDirty }))
          }
          dirty={dirty.userId}
          sortAlphabetically
          disabled={isLoading || isDoctorsLoading}
          required
          options={doctors.map((doctor) => {
            const fullName =
              `${doctor.firstName ?? ""} ${doctor.lastName ?? ""}`.trim();
            const fallbackName = doctor.name?.trim() || doctor.email;
            const label = fullName || fallbackName;

            return {
              value: String(doctor.id),
              label: `${label} (${doctor.email})`,
            };
          })}
        />
      </div>

      {isPatientsLoading || isDoctorsLoading ? (
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-(--brand) px-3 py-2.5 font-medium text-white shadow-sm transition hover:bg-(--brand-strong) disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Appointment"}
      </button>
    </form>
  );
}
