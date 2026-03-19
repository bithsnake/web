import { configureStore } from "@reduxjs/toolkit";
import patientsUiReducer from "./features/patients-ui-slice";

export const store = configureStore({
  reducer: {
    patientsUi: patientsUiReducer,
    appointmentsUi: patientsUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
