import { createSlice } from "@reduxjs/toolkit";

export const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
  },
  reducers: {
    onAddNewStaff: (state, { payload }) => {
      state.staff.push(payload);
    },
    onUpdateStaff: (state, { payload }) => {
      state.staff = state.staff.map((member) =>
        member._id === payload._id ? payload : member,
      );
    },
    onDeleteStaff: (state, { payload }) => {
      state.staff = state.staff.filter((member) => member._id !== payload);
    },
    onLoadStaff: (state, { payload }) => {
      state.staff = payload;
    },
  },
});

export const { onAddNewStaff, onUpdateStaff, onDeleteStaff, onLoadStaff } =
  staffSlice.actions;
