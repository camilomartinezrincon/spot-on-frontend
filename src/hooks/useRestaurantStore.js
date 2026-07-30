import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewRestaurant,
  onDeleteRestaurant,
  onLoadRestaurants,
  onUpdateRestaurant,
} from "../store";
import { spotOnApi } from "../api";
import Swal from "sweetalert2";
import { useCallback } from "react";

export const useRestaurantStore = () => {
  const dispatch = useDispatch();
  const { restaurants } = useSelector((state) => state.restaurant);

  const startSavingRestaurant = async (restaurantData) => {
    const payload = {
      ...restaurantData,
      maxPartySize: Number(restaurantData.maxPartySize),
    };

    try {
      if (restaurantData._id) {
        const { data } = await spotOnApi.put(
          `/restaurants/update/restaurant/${restaurantData._id}`,
          payload,
        );
        dispatch(onUpdateRestaurant(data.restaurant));
        await Swal.fire({
          title: "Restaurant updated",
          icon: "success",
          confirmButtonText: "Back to restaurants",
        });
      } else {
        const { data } = await spotOnApi.post(
          "/restaurants/new/restaurant",
          payload,
        );
        dispatch(onAddNewRestaurant(data.restaurant));
        await Swal.fire({
          title: "Restaurant created",
          icon: "success",
          confirmButtonText: "Back to restaurants",
        });
      }
    } catch (error) {
      Swal.fire(
        restaurantData._id
          ? "Error updating restaurant"
          : "Error creating restaurant",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startDeletingRestaurant = async (restaurantId) => {
    try {
      await spotOnApi.delete(`/restaurants/delete/restaurant/${restaurantId}`);
      dispatch(onDeleteRestaurant(restaurantId));
    } catch (error) {
      Swal.fire(
        "Error deleting restaurant",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startLoadingRestaurants = useCallback(async () => {
    try {
      const { data } = await spotOnApi.get("/restaurants/restaurants");
      dispatch(onLoadRestaurants(data.restaurant || []));
    } catch (error) {
      Swal.fire(
        "Error loading restaurants",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
    }
  }, [dispatch]);

  const startLoadingRestaurant = useCallback(async (restaurantId) => {
    try {
      const { data } = await spotOnApi.get(
        `/restaurants/restaurant/${restaurantId}`,
      );
      return data.restaurant;
    } catch (error) {
      Swal.fire(
        "Error loading restaurant",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  }, []);

  return {
    restaurants,
    startSavingRestaurant,
    startDeletingRestaurant,
    startLoadingRestaurants,
    startLoadingRestaurant,
  };
};
