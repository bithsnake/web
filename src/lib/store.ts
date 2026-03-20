import { configureStore } from "@reduxjs/toolkit";
import patientsUiReducer from "./features/patients-ui-slice";
import { patientsApi } from "./features/patients-api";

export const store = configureStore({
  reducer: {
    patientsUi: patientsUiReducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(patientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
