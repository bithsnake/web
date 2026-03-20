"use client";

import { useCreatePatientMutation } from "@/lib/features/patients-api";
import { Patient } from "@/lib/types";
import { useState } from "react";

interface CreatePartientFormProps {
  onSuccess: (patient: Patient) => void;
  onError: (error: Error) => void;
}

export function CreatePatientForm({
  onSuccess,
  onError,
}: CreatePartientFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [createPatient, { isLoading }] = useCreatePatientMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newPatient = await createPatient({ name, email }).unwrap();

      console.log(newPatient);

      onSuccess(newPatient);
      setName("");
      setEmail("");
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
      className="space-y-4 rounded-2xl border border-(--line) bg-linear-to-br from-white to-(--panel) p-5"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">
          Quick Create
        </p>
        <h2 className="mt-1 text-lg font-semibold">Add New Patient</h2>
      </div>

      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-(--line) bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-(--line) bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20"
          placeholder="john@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-(--brand) px-3 py-2.5 font-medium text-white shadow-sm transition hover:bg-(--brand-strong) disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Patient"}
      </button>
    </form>
  );
}
