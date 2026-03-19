import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PatientsUiState = {
  search: string;
};

const initialState: PatientsUiState = {
  search: "",
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
  },
});

export const { setSearch, clearSearch } = patientsUiSlice.actions;
export default patientsUiSlice.reducer;
