"use client";

import {
  getDashboardWidgetsListState,
  saveDashboardWidgetsListState,
  useGetDashboardWidgetsListQuery,
} from "@/lib/features/dashboard-api";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../_components/app-shell";
import { DashboardSidePanel } from "../_components/dashboard-side-panel";
import { WidgetShell } from "../_components/widget-shell";
import {
  AppointMentWidgetItem,
  BillingWidgetItem,
  ReminderWidgetItem,
} from "@/lib/types";
import { CardTable } from "../_components/card-table";
import { BrandButton } from "../_components/brand-button";
import { Grid } from "../_components/grid";
import { LoadingSpinner } from "../_components/loading-spinner";

type DashboardWidgetId =
  | "upcoming-appointments"
  | "billing-status"
  | "recent-reminders"
  | "reminders";

type DashboardWidgetOption = {
  id: DashboardWidgetId;
  label: string;
};

const DASHBOARD_WIDGET_OPTIONS: DashboardWidgetOption[] = [
  { id: "upcoming-appointments", label: "Upcoming Appointments" },
  { id: "billing-status", label: "Billing Status" },
  { id: "recent-reminders", label: "Recent Reminders" },
  { id: "reminders", label: "Reminders" },
];

const DASHBOARD_WIDGET_IDS = DASHBOARD_WIDGET_OPTIONS.map(
  (option) => option.id,
);

function isDashboardWidgetId(value: string): value is DashboardWidgetId {
  return DASHBOARD_WIDGET_IDS.includes(value as DashboardWidgetId);
}

export default function DashBoardPage() {
  const { data, error, refetch, isLoading } = useGetDashboardWidgetsListQuery();
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<DashboardWidgetId[]>(
    () => {
      const saved = getDashboardWidgetsListState().filter(isDashboardWidgetId);
      return saved.length > 0 ? saved : DASHBOARD_WIDGET_IDS;
    },
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    saveDashboardWidgetsListState(visibleWidgetIds);
  }, [visibleWidgetIds]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      // Add a minimum duration for better UX (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsRefreshing(false);
    }
  };

  const visibleWidgetIdSet = useMemo(
    () => new Set(visibleWidgetIds),
    [visibleWidgetIds],
  );

  const handleToggleWidget = (widgetId: DashboardWidgetId) => {
    setVisibleWidgetIds((current) => {
      if (current.includes(widgetId)) {
        return current.filter((id) => id !== widgetId);
      }

      return [...current, widgetId];
    });
  };

  console.log(data, error);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error ? JSON.stringify(error) : "Unknown error"}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const appointMentWidgetItem: AppointMentWidgetItem =
    data?.appointMentWidgetItem;
  const billingWidgetItem: BillingWidgetItem = data?.billingWidgetItem;
  const remindersWidgetItem: ReminderWidgetItem = data?.remindersWidgetItem;
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-(--muted)">
        Snapshot of appointments, reminders, and billing status.
      </p>
      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
        {isRefreshing ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-(--line) bg-(--panel)/90 py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            {visibleWidgetIds.length === 0 ? (
              <div className="rounded-2xl border border-(--line) bg-(--panel)/90 p-6 text-sm text-(--muted)">
                No widgets selected. Choose one or more widgets from the panel.
              </div>
            ) : (
              <Grid columns={2}>
                {visibleWidgetIdSet.has("upcoming-appointments") ? (
                  <WidgetShell label="Upcoming Appointments" width="100%">
                    <CardTable
                      columns={["Name", "Type", "Date"]}
                      data={appointMentWidgetItem.upcoming.map(
                        (appointment) => ({
                          Name: appointment.name,
                          Type: appointment.type,
                          Date: new Date(
                            appointment.createdAt,
                          ).toLocaleDateString(),
                        }),
                      )}
                    />
                  </WidgetShell>
                ) : null}

                {visibleWidgetIdSet.has("billing-status") ? (
                  <WidgetShell label="Billing Status" width="100%">
                    <CardTable
                      columns={[
                        "Created At",
                        "Amount",
                        "Description",
                        "Status",
                      ]}
                      data={billingWidgetItem.paid.map((billing) => ({
                        "Created At": new Date(
                          billing.createdAt,
                        ).toLocaleDateString(),
                        Amount: `$${billing.amount.toFixed(2)}`,
                        Description: billing.description,
                        Status: billing.status,
                      }))}
                    />
                  </WidgetShell>
                ) : null}

                {visibleWidgetIdSet.has("recent-reminders") ? (
                  <WidgetShell label="Recent Reminders" width="100%">
                    <CardTable
                      columns={["Message", "Appointment", "Created At"]}
                      data={remindersWidgetItem.data.map((reminder) => ({
                        Message: reminder.message,
                        Appointment: reminder?.appointment?.name || "N/A",
                        "Created At": new Date(
                          reminder.createdAt,
                        ).toLocaleDateString(),
                      }))}
                    />
                  </WidgetShell>
                ) : null}

                {visibleWidgetIdSet.has("reminders") ? (
                  <WidgetShell label="Reminders" width="100%">
                    <CardTable
                      columns={["Message", "Appointment", "Created At"]}
                      data={remindersWidgetItem.data.map((reminder) => ({
                        Message: reminder.message,
                        Appointment: reminder?.appointment?.name || "N/A",
                        "Created At": new Date(
                          reminder.createdAt,
                        ).toLocaleDateString(),
                      }))}
                    />
                  </WidgetShell>
                ) : null}
              </Grid>
            )}
          </div>
        )}

        {!isRefreshing && (
          <DashboardSidePanel panelTitle="Widgets">
            <h3 className="text-sm font-semibold text-(--ink)">
              Visible Widgets
            </h3>
            <p className="mt-1 text-xs text-(--muted)">
              Choose which dashboard widgets to show.
            </p>
            <div className="mt-3 space-y-2">
              {DASHBOARD_WIDGET_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 rounded-lg border border-(--line) px-2.5 py-2 text-sm text-(--ink)"
                >
                  <input
                    type="checkbox"
                    checked={visibleWidgetIdSet.has(option.id)}
                    onChange={() => handleToggleWidget(option.id)}
                    className="h-4 w-4 accent-(--brand)"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </DashboardSidePanel>
        )}
      </div>

      <BrandButton
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="mt-4 w-fit"
      >
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </BrandButton>
    </AppShell>
  );
}
