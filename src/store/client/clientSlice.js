import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
  name: "client",
  initialState: {
    clients: [],
  },
  reducers: {
    onUpdateClient: (state, { payload }) => {
      state.clients = state.clients.map((client) =>
        client._id === payload._id ? payload : client,
      );
    },
    onDeleteClient: (state, { payload }) => {
      state.clients = state.clients.filter((client) => client._id !== payload);
    },
    onLoadClients: (state, { payload }) => {
      state.clients = payload;
    },
  },
});

export const { onUpdateClient, onDeleteClient, onLoadClients } =
  clientSlice.actions;
