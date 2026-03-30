import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreatePatientRequest, Patient } from "@/lib/types";
import { mockDb } from "@/lib/mocks/mock-db";

const patientsListTag = { type: "Patients" as const, id: "LIST" };

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Patients"],
  endpoints: (builder) => ({
    getPatients: builder.query<Patient[], void>({
      queryFn: async () => ({ data: mockDb.getPatients() }),
      providesTags: (result) =>
        result
          ? [
              patientsListTag,
              ...result.map((patient) => ({
                type: "Patients" as const,
                id: patient.id,
              })),
            ]
          : [patientsListTag],
    }),
    getPatientById: builder.query<Patient, number>({
      queryFn: async (id) => {
        const patient = mockDb.getPatientById(id);
        if (!patient) {
          return { error: { message: `Patient with id ${id} was not found` } };
        }

        return { data: patient };
      },
      providesTags: (result, error, id) => [{ type: "Patients", id }],
      keepUnusedDataFor: 5,
    }),
    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      queryFn: async (newPatient) => ({
        data: mockDb.createPatient(newPatient),
      }),
      invalidatesTags: [patientsListTag],
    }),
    updatePatient: builder.mutation<
      Patient,
      { id: number; name?: string; email?: string }
    >({
      queryFn: async ({ id, ...patch }) => {
        try {
          const updated = mockDb.updatePatient(id, patch);
          return { data: updated };
        } catch (error) {
          return {
            error: {
              message:
                error instanceof Error
                  ? error.message
                  : `Patient with id ${id} was not found`,
            },
          };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        patientsListTag,
        { type: "Patients", id },
      ],
    }),
    deletePatient: builder.mutation<{ success: boolean }, number>({
      queryFn: async (id) => ({ data: mockDb.deletePatient(id) }),
      invalidatesTags: (result, error, id) => [
        patientsListTag,
        { type: "Patients", id },
      ],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientsApi;
