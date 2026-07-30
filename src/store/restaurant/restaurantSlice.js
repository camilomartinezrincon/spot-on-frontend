import { createSlice } from "@reduxjs/toolkit";

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: {
    restaurants: [],
    activeRestaurant: null,
  },
  reducers: {
    onAddNewRestaurant: (state, { payload }) => {
      state.restaurants.push(payload);
      state.activeRestaurant = null;
    },
    onUpdateRestaurant: (state, { payload }) => {
      state.restaurants = state.restaurants.map((restaurant) => {
        if (restaurant._id === payload._id) {
          return payload;
        }
        return restaurant;
      });
    },
    onDeleteRestaurant: (state, { payload }) => {
      state.restaurants = state.restaurants.filter(
        (restaurant) => restaurant._id !== payload,
      );
    },
    onLoadRestaurants: (state, { payload }) => {
      state.restaurants = payload;
    },
  },
});

export const {
  onAddNewRestaurant,
  onUpdateRestaurant,
  onDeleteRestaurant,
  onLoadRestaurants,
} = restaurantSlice.actions;
