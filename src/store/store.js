import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSlice";
import { calendarSlice } from "./calendar/calendarSlice";
import { authSlice } from "./auth/authSlice";
import { restaurantSlice } from "./restaurant/restaurantSlice";
import { staffSlice } from "./staff/staffSlice";
import { clientSlice } from "./client/clientSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    restaurant: restaurantSlice.reducer,
    staff: staffSlice.reducer,
    client: clientSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
