import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "../auth";
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";
import { LandingPage } from "../landing";
import { NewReservationPage } from "../reservation";

export const AppRouter = () => {
  const { status, user, checkAuthToken } = useAuthStore();
  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  if (status === "checking") {
    return <h3>Loading...</h3>;
  }
  const isClient = user?.role === "CLIENT";
  console.log({ user, isClient });

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/*" element={<Navigate to={"/auth/login"} />} />
        </>
      ) : (
        <>
          <Route path="/reservations" element={<CalendarPage />} />
          <Route
            path="/reservations/new/:restaurantId"
            element={<NewReservationPage />}
          />
          {isClient && <Route path="/" element={<LandingPage />} />}
          <Route
            path="/*"
            element={<Navigate to={isClient ? "/" : "/reservations"} />}
          />
        </>
      )}
    </Routes>
  );
};
