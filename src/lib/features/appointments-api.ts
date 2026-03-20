import { Appointment, CreateAppointmentRequest } from "@/lib/types";
import { API_BASE_URL } from "../api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type DoctorOption = {
  id: number;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
};

const appointmentsListTag = { type: "Appointments" as const, id: "LIST" };
export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], void>({
      query: () => "/appointments",
      providesTags: (result) =>
        result
          ? [
              appointmentsListTag,
              ...result.map((appointment) => ({
                type: "Appointments" as const,
                id: appointment.id,
              })),
            ]
          : [appointmentsListTag],
    }),
    getAppointmentById: builder.query<Appointment, number>({
      query: (id) => `/appointments/${id}`,
      providesTags: (result, error, id) => [{ type: "Appointments", id }],
      keepUnusedDataFor: 5,
    }),
    getDoctors: builder.query<DoctorOption[], void>({
      query: () => "/users/role/DENTIST",
    }),
    createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: [appointmentsListTag],
    }),
    softDeleteAppointment: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        appointmentsListTag,
        { type: "Appointments", id },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useGetDoctorsQuery,
  useCreateAppointmentMutation,
  useSoftDeleteAppointmentMutation,
} = appointmentsApi;
