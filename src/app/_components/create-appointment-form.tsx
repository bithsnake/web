"use client";

import { useCreateAppointmentMutation } from "@/lib/features/appointments-api";
import { Appointment } from "@/lib/types";
import { useState } from "react";

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

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      className="space-y-4 rounded-lg border border-(--line) p-4 bg-(--panel)"
    >
      <h2 className="text-lg font-semibold">Add New Appointment</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="w-full border border-(--line) rounded px-3 py-2 text-sm"
          placeholder="Teeth cleaning"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Patient ID</label>
        <input
          type="number"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
          disabled={isLoading}
          className="w-full border border-(--line) rounded px-3 py-2 text-sm"
          placeholder="1"
          min={1}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Doctor/User ID</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          disabled={isLoading}
          className="w-full border border-(--line) rounded px-3 py-2 text-sm"
          placeholder="1"
          min={1}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Date and time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isLoading}
          className="w-full border border-(--line) rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-(--brand) text-white px-3 py-2 rounded font-medium hover:bg-(--brand-strong) disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Appointment"}
      </button>
    </form>
  );
}
