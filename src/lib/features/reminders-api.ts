import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../api";
import { CreateReminderRequest, Reminder } from "../types";

const remindersListTag = { type: "Reminders" as const, id: "LIST" };

export const remindersApi = createApi({
  reducerPath: "remindersApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Reminders"],
  endpoints: (builder) => ({
    getReminders: builder.query<Reminder[], void>({
      query: () => "/reminders",
      providesTags: (result) =>
        result
          ? [
              remindersListTag,
              ...result.map((patient) => ({
                type: "Reminders" as const,
                id: patient.id,
              })),
            ]
          : [remindersListTag],
    }),
    getReminderById: builder.query<Reminder, number>({
      query: (id) => `/reminder/${id}`,
      providesTags: (result, error, id) => [
        {
          type: "Reminders" as const,
          id,
        },
      ],
      keepUnusedDataFor: 5,
    }),
    createReminder: builder.mutation<Reminder, CreateReminderRequest>({
      query: (newReminder) => ({
        url: "/reminders",
        method: "POST",
        body: newReminder,
      }),
      invalidatesTags: [remindersListTag],
    }),
    deleteReminder: builder.mutation<number, void>({
      query: (id) => ({
        url: `reminders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [remindersListTag],
    }),
    getRemindersForAppointment: builder.query<Reminder[], number>({
      query: (appointmentId) => `/reminders/appointment/${appointmentId}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useGetReminderByIdQuery,
  useCreateReminderMutation,
  useDeleteReminderMutation,
  useGetRemindersForAppointmentQuery,
} = remindersApi;
