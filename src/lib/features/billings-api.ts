import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Billing,
  CreateBillingRequest,
  UpdateBillingRequest,
} from "@/lib/types";
import { mockDb } from "@/lib/mocks/mock-db";

const billingsListTag = { type: "Billings" as const, id: "LIST" };

export const billingsApi = createApi({
  reducerPath: "billingsApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Billings"],
  endpoints: (builder) => ({
    getBillings: builder.query<Billing[], void>({
      queryFn: async () => ({ data: mockDb.getBillings() }),
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
      queryFn: async (id) => {
        const billing = mockDb.getBillingById(id);
        if (!billing) {
          return { error: { message: `Billing with id ${id} was not found` } };
        }

        return { data: billing };
      },
      providesTags: (result, error, id) => [{ type: "Billings", id }],
      keepUnusedDataFor: 5,
    }),
    createBilling: builder.mutation<Billing, CreateBillingRequest>({
      queryFn: async (newBilling) => ({
        data: mockDb.createBilling(newBilling),
      }),
      invalidatesTags: [billingsListTag],
    }),
    updateBilling: builder.mutation<Billing, UpdateBillingRequest>({
      queryFn: async (payload) => {
        try {
          return { data: mockDb.updateBilling(payload) };
        } catch (error) {
          return {
            error: {
              message:
                error instanceof Error
                  ? error.message
                  : `Billing with id ${payload.id} was not found`,
            },
          };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        billingsListTag,
        { type: "Billings", id },
      ],
    }),
    softDeleteBilling: builder.mutation<{ success: boolean }, number>({
      queryFn: async (id) => ({ data: mockDb.softDeleteBilling(id) }),
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
