import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api";
import { CreatePatientRequest, Patient } from "@/lib/types";

const patientsListTag = { type: "Patients" as const, id: "LIST" };

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Patients"],
  endpoints: (builder) => ({
    getPatients: builder.query<Patient[], void>({
      query: () => "/patients",
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
      query: (id) => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: "Patients", id }],
      keepUnusedDataFor: 5,
    }),
    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      query: (newPatient) => ({
        url: "/patients",
        method: "POST",
        body: newPatient,
      }),
      invalidatesTags: [patientsListTag],
    }),
    updatePatient: builder.mutation<
      Patient,
      { id: number; name?: string; email?: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        patientsListTag,
        { type: "Patients", id },
      ],
    }),
    deletePatient: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
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
