"use client";

import { api } from "@/lib/api";
import { CreatePatientRequest, Patient } from "@/lib/types";
import { useState } from "react";

interface CreatePartientFormProps {
  onSuccess: (patient: Patient) => void;
  onError: (error: Error) => void;
}

export function CreatePatientForm({ onSuccess, onError }: CreatePartientFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPatient = await api.post<Patient, CreatePatientRequest>("/patients", { name, email });

      onSuccess(newPatient);
      setName("");
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error("An unknown error occurred"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-(--line) p-4 bg-(--panel)">
      <h2 className="text-lg font-semibold">Add New Patient</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full border border-(--line) rounded px-3 py-2 text-sm"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full border border-(--line) rounded px-3 py-2 text-sm"
          placeholder="john@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-(--brand) text-white px-3 py-2 rounded font-medium hover:bg-(--brand-strong) disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Patient"}
      </button>
    </form>
  );
}
