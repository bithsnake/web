import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api";
import {
  Billing,
  CreateBillingRequest,
  UpdateBillingRequest,
} from "@/lib/types";

const billingsListTag = { type: "Billings" as const, id: "LIST" };

export const billingsApi = createApi({
  reducerPath: "billingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Billings"],
  endpoints: (builder) => ({
    getBillings: builder.query<Billing[], void>({
      query: () => "/billings",
      providesTags: (result) =>
        result
          ? [
              billingsListTag,
              ...result.map((billing) => ({
                type: "Billings" as const,
                id: billing.id,
              })),
            ]
          : [billingsListTag],
    }),
    getBillingById: builder.query<Billing, number>({
      query: (id) => `/billings/${id}`,
      providesTags: (result, error, id) => [{ type: "Billings", id }],
      keepUnusedDataFor: 5,
    }),
    createBilling: builder.mutation<Billing, CreateBillingRequest>({
      query: (newBilling) => ({
        url: "/billings",
        method: "POST",
        body: newBilling,
      }),
      invalidatesTags: [billingsListTag],
    }),
    updateBilling: builder.mutation<Billing, UpdateBillingRequest>({
      query: ({ id, ...patch }) => ({
        url: `/billings/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        billingsListTag,
        { type: "Billings", id },
      ],
    }),
    softDeleteBilling: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/billings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        billingsListTag,
        { type: "Billings", id },
      ],
    }),
  }),
});

export const {
  useGetBillingsQuery,
  useGetBillingByIdQuery,
  useCreateBillingMutation,
  useUpdateBillingMutation,
  useSoftDeleteBillingMutation,
} = billingsApi;
