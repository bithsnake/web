import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type billingsUiState = {
  search: string;
  selectedBillingId?: number | null;
};

const initialState: billingsUiState = {
  search: "",
  selectedBillingId: null,
};

const billingsUiSlice = createSlice({
  name: "billingsUi",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearSearch(state) {
      state.search = "";
    },
    setSelectedBillingId(state, action: PayloadAction<number | null>) {
      state.selectedBillingId = action.payload;
    },
    clearSelectedBillingId(state) {
      state.selectedBillingId = null;
    },
  },
});

export const {
  setSearch,
  clearSearch,
  setSelectedBillingId,
  clearSelectedBillingId,
} = billingsUiSlice.actions;
export default billingsUiSlice.reducer;
