import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import "./styles/AdminSideMenuBar.css";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: "fa-table-columns" },
  { label: "Restaurants", path: "/admin/restaurants", icon: "fa-store" },
  { label: "Employees", path: "/admin/staff", icon: "fa-users" },
  { label: "Clients", path: "/admin/clients", icon: "fa-user-group" },
];

export const AdminSideMenuBar = () => {
  const { startLogout, user } = useAuthStore();
  const location = useLocation();

  return (
    <div className="d-flex flex-column admin-sidebar p-3">
      <span className="admin-sidebar-user mb-4 px-2">
        <i className="fas fa-user-tie"></i>
        &nbsp; {user.fullName}
      </span>

      <nav className="nav nav-pills flex-column flex-grow-1 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link d-flex align-items-center gap-2 admin-sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <i className={`fas ${item.icon}`}></i>&nbsp;
            {item.label}
          </Link>
        ))}
      </nav>

      <button className="btn btn-outline-danger" onClick={startLogout}>
        <i className="fas fa-sign-out-alt"></i>&nbsp;
        <span>Logout</span>
      </button>
    </div>
  );
};
