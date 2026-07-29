import { Outlet } from "react-router-dom";
import { AdminSideMenuBar } from "../";

export const AdminPage = () => {
  return (
    <div className="d-flex">
      <AdminSideMenuBar />
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};
