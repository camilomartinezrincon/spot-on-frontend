import { useDispatch, useSelector } from "react-redux";
import { spotOnApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";
import { useCallback } from "react";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await spotOnApi.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);

      dispatch(onLogin({ uid: data.uid, fullName: data.fullName }));
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
      dispatch(onLogin({ uid: data.uid, fullName: data.fullName }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout(error.response.data?.msg || "Expired Token"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  }, [dispatch]);

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };

  return {
    status,
    user,
    errorMessage,
    startLogin,
    startRegister,
    startLogout,
    checkAuthToken,
  };
};
