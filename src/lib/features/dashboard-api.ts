import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardWidgetItems } from "../types";
import { mockDb } from "@/lib/mocks/mock-db";

export const DASHBOARD_WIDGETS_STORAGE_KEY = "dashboard-widgets-list";

export function getDashboardWidgetsListState(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const list = localStorage.getItem(DASHBOARD_WIDGETS_STORAGE_KEY);
  if (!list) {
    return [];
  }

  try {
    const parsed = JSON.parse(list);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return [];
  }

  return [];
}

export function saveDashboardWidgetsListState(widgets: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(DASHBOARD_WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
}

const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  endpoints: (builder) => ({
    getDashboardWidgetsList: builder.query<DashboardWidgetItems, void>({
      queryFn: async () => ({ data: mockDb.getDashboardWidgetsList() }),
    }),
    saveDashboardWidgetsListState: builder.mutation<void, string[]>({
      queryFn: async (widgets) => {
        saveDashboardWidgetsListState(widgets);
        return { data: undefined };
      },
    }),
  }),
});

export const {
  useGetDashboardWidgetsListQuery,
  useSaveDashboardWidgetsListStateMutation,
} = dashboardApi;

export default dashboardApi;
