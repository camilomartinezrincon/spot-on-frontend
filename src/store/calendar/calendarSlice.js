import { createSlice } from "@reduxjs/toolkit";
import { addHours } from "date-fns";

const tempEvent = {
  _id: new Date().getTime(),
  title: "Reservation Camilo Martinez",
  notes: "Camilo Martinez Birthday",
  start: new Date(),
  end: addHours(new Date(), 2),
  bgColor: "#fafafafa",
  user: {
    _id: "testCode_123",
    name: "Viviana Camargo",
  },
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    events: [tempEvent],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
  },
});

export const { onSetActiveEvent } = calendarSlice.actions;
