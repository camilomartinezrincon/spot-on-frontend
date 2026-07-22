import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCalendarModalOpen: false,
  },
  reducers: {
    onOpenCalendarModal: (state) => {
      state.isCalendarModalOpen = true;
    },
    onCloseCalendarModal: (state) => {
      state.isCalendarModalOpen = false;
    },
  },
});

export const { onOpenCalendarModal, onCloseCalendarModal } = uiSlice.actions;
