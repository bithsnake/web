import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PatientsUiState = {
  search: string;
  selectedPatientId?: number | null;
};

const initialState: PatientsUiState = {
  search: "",
  selectedPatientId: null,
};

const patientsUiSlice = createSlice({
  name: "patientsUi",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearSearch(state) {
      state.search = "";
    },
    setSelectedPatientId(state, action: PayloadAction<number | null>) {
      state.selectedPatientId = action.payload;
    },
    clearSelectedPatientId(state) {
      state.selectedPatientId = null;
    },
  },
});

export const {
  setSearch,
  clearSearch,
  setSelectedPatientId,
  clearSelectedPatientId,
} = patientsUiSlice.actions;
export default patientsUiSlice.reducer;
