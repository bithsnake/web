import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../api';
import { CreateMessageRequest, Reminder } from '../types';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    createMessage: builder.mutation<Reminder, CreateMessageRequest>({
      query: (newMessage) => ({
        url: '/messages',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const { useCreateMessageMutation } = messagesApi;
