import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "../auth";
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";
import { LandingPage } from "../landing";
import { NewReservationPage } from "../reservation";
import {
  AdminPage,
  ClientsPage,
  CreateNewEmployeePage,
  CreateNewRestaurantPage,
  DashboardPage,
  EditClientPage,
  EditPasswordPage,
  RestaurantsPage,
  StaffPage,
} from "../admin";

export const AppRouter = () => {
  const { status, user, checkAuthToken } = useAuthStore();
  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  if (status === "checking") {
    return <h3>Loading...</h3>;
  }
  const isClient = user?.role === "CLIENT";
  const isAdmin = user?.role === "ADMIN";

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
          {isAdmin && (
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<DashboardPage />} />
              <Route path="restaurants" element={<RestaurantsPage />} />
              <Route
                path="restaurants/new"
                element={<CreateNewRestaurantPage />}
              />
              <Route
                path="restaurants/:restaurantId"
                element={<CreateNewRestaurantPage />}
              />
              <Route path="staff" element={<StaffPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/:userId" element={<EditClientPage />} />
              <Route path="staff/new" element={<CreateNewEmployeePage />} />
              <Route path="staff/:userId" element={<CreateNewEmployeePage />} />
              <Route
                path="staff/:userId/change-password"
                element={
                  <EditPasswordPage
                    backPath="/admin/staff"
                    label="staff"
                    singularLabel="staff member"
                  />
                }
              />
              <Route
                path="clients/:userId/change-password"
                element={
                  <EditPasswordPage
                    backPath="/admin/clients"
                    label="clients"
                    singularLabel="client"
                  />
                }
              />
            </Route>
          )}
          <Route
            path="/*"
            element={
              <Navigate
                to={isClient ? "/" : isAdmin ? "/admin" : "/reservations"}
              />
            }
          />
        </>
      )}
    </Routes>
  );
};
