import { useDispatch, useSelector } from "react-redux";
import { spotOnApi } from "../api";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  onLogoutCalendar,
} from "../store";
import { useCallback } from "react";
import Swal from "sweetalert2";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLoadingUsers = async () => {
    try {
      const { data } = await spotOnApi.get("/auth/users");
      return data.usr || [];
    } catch (error) {
      Swal.fire(
        "Error loading users",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await spotOnApi.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);

      dispatch(
        onLogin({
          uid: data.uid,
          fullName: data.fullName,
          role: data.role,
          restaurant: data.restaurant,
        }),
      );
    } catch (error) {
      console.log({ error });
      dispatch(
        onLogout(error.response.data?.msg || "Incorrect Email or Password"),
      );
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ email, password, fullName }) => {
    dispatch(onChecking());
    try {
      await spotOnApi.post("/auth/new/client", {
        email,
        password,
        fullName,
      });

      dispatch(onLogout());
      return { ok: true };
    } catch (error) {
      console.log({ error });
      dispatch(onLogout(error.response.data?.msg || "Register Error"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return { ok: false };
    }
  };

  const checkAuthToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await spotOnApi.get("/auth/renew");
      localStorage.setItem("token", data.token);
      dispatch(
        onLogin({
          uid: data.uid,
          fullName: data.fullName,
          role: data.role,
          restaurant: data.restaurant,
        }),
      );
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout(error.response.data?.msg || "Expired Token"));
      dispatch(onLogoutCalendar());
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  }, [dispatch]);

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
    dispatch(onLogoutCalendar());
  };

  const startChangingPassword = async (userId, password) => {
    try {
      await spotOnApi.put(`/auth/update/user/password/${userId}`, { password });
      await Swal.fire({
        title: "Password updated",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire(
        "Error updating password",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  return {
    status,
    user,
    errorMessage,
    startLogin,
    startRegister,
    startLogout,
    checkAuthToken,
    startLoadingUsers,
    startChangingPassword,
  };
};
