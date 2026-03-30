import { configureStore } from "@reduxjs/toolkit";
import patientsUiReducer from "./features/patients-ui-slice";
import { patientsApi } from "./features/patients-api";
import appointmentsUiReducer from "./features/appointments-ui-slice";
import { appointmentsApi } from "./features/appointments-api";
import billingsUiReducer from "./features/billings-ui-slice";
import { billingsApi } from "./features/billings-api";
import dashboardApi from "./features/dashboard-api";

export const store = configureStore({
  reducer: {
    patientsUi: patientsUiReducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    appointmentsUi: appointmentsUiReducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    billingsUi: billingsUiReducer,
    [billingsApi.reducerPath]: billingsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      patientsApi.middleware,
      appointmentsApi.middleware,
      billingsApi.middleware,
      dashboardApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
