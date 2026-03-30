import { Appointment, CreateAppointmentRequest } from "@/lib/types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { DoctorOption, mockDb } from "@/lib/mocks/mock-db";

const appointmentsListTag = { type: "Appointments" as const, id: "LIST" };
export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], void>({
      queryFn: async () => ({ data: mockDb.getAppointments() }),
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
      queryFn: async (id) => {
        const appointment = mockDb.getAppointmentById(id);
        if (!appointment) {
          return {
            error: { message: `Appointment with id ${id} was not found` },
          };
        }

        return { data: appointment };
      },
      providesTags: (result, error, id) => [{ type: "Appointments", id }],
      keepUnusedDataFor: 5,
    }),
    getDoctors: builder.query<DoctorOption[], void>({
      queryFn: async () => ({ data: mockDb.getDoctors() }),
    }),
    createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
      queryFn: async (newAppointment) => ({
        data: mockDb.createAppointment(newAppointment),
      }),
      invalidatesTags: [appointmentsListTag],
    }),
    softDeleteAppointment: builder.mutation<{ success: boolean }, number>({
      queryFn: async (id) => ({ data: mockDb.softDeleteAppointment(id) }),
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
