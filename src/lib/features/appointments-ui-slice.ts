import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type appointmentsUiState = {
  search: string;
  selectedAppointmentId?: number | null;
};

const initialState: appointmentsUiState = {
  search: "",
  selectedAppointmentId: null,
};

const appointmentsUiSlice = createSlice({
  name: "appointmentsUi",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearSearch(state) {
      state.search = "";
    },
    setSelectedAppointmentId(state, action: PayloadAction<number | null>) {
      state.selectedAppointmentId = action.payload;
    },
    clearSelectedAppointmentId(state) {
      state.selectedAppointmentId = null;
    },
  },
});

export const {
  setSearch,
  clearSearch,
  setSelectedAppointmentId,
  clearSelectedAppointmentId,
} = appointmentsUiSlice.actions;
export default appointmentsUiSlice.reducer;
