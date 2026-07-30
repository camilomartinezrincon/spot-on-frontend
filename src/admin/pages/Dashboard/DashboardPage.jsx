import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAuthStore,
  useRestaurantStore,
  useStaffStore,
} from "../../../hooks";
import "./DashboardPage.css";

const restaurantStatusClass = {
  ACTIVE: "dashboard-badge-active",
  INACTIVE: "dashboard-badge-inactive",
  CLOSED: "dashboard-badge-closed",
};

export const DashboardPage = () => {
  const { startLoadingUsers } = useAuthStore();
  const { restaurants, startLoadingRestaurants } = useRestaurantStore();
  const { staff, startLoadingStaff } = useStaffStore();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [users] = await Promise.all([
          startLoadingUsers(),
          startLoadingRestaurants(),
          startLoadingStaff(),
        ]);
        setClients(users.filter((u) => u.role === "CLIENT"));
      } catch (error) {
        Swal.fire(
          "Error loading dashboard",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [startLoadingUsers, startLoadingRestaurants, startLoadingStaff]);

  const activeRestaurantsCount = useMemo(
    () => restaurants.filter((r) => r.restaurantStatus === "ACTIVE").length,
    [restaurants],
  );

  const restaurantNameById = useMemo(() => {
    const map = {};
    restaurants.forEach((r) => {
      map[r._id] = r.restaurantName;
    });
    return map;
  }, [restaurants]);

  const formatPostalCode = (postalCode) => {
    if (!postalCode) return "";
    const cleaned = postalCode.replace(/\s/g, "").toUpperCase();
    if (cleaned.length < 6) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  };

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.street}, ${address.city}, ${address.province} ${formatPostalCode(address.postalCode)}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "").slice(0, 10);
    if (digits.length < 10) return phone;
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  return (
    <>
      <h1 className="fw-bold mb-1">Dashboard</h1>
      <p className="text-muted mb-4">
        Manage the restaurants, employees and clients on the platform.
      </p>

      {isLoading ? (
        <p className="text-muted">Loading dashboard...</p>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-3">
              <div className="card dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Restaurants</p>
                  <h3 className="fw-bold mb-0">{restaurants.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-3">
              <div className="card dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Employees</p>
                  <h3 className="fw-bold mb-0">{staff.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-3">
              <div className="card dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Clients</p>
                  <h3 className="fw-bold mb-0">{clients.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-3">
              <div className="card dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Active restaurants</p>
                  <h3 className="fw-bold mb-0">{activeRestaurantsCount}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">Restaurants</h5>
            <Link
              to="/admin/restaurants"
              className="small text-decoration-none"
            >
              View All →
            </Link>
          </div>
          <div className="card dashboard-card mb-4">
            <div className="list-group list-group-flush p-2">
              {restaurants.slice(0, 5).map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="list-group-item dashboard-list-item d-flex align-items-center justify-content-between"
                >
                  <div>
                    <p className="mb-0 fw-semibold">
                      {restaurant.restaurantName} ·{" "}
                      <span className="text-muted fw-normal">
                        {restaurant.cuisineType}
                      </span>
                    </p>
                    <p className="text-muted small mb-0">
                      {formatAddress(restaurant.restaurantAddress)}
                    </p>
                    <p className="text-muted small mb-0">
                      {formatPhoneNumber(restaurant.restaurantPhoneNum)}
                    </p>
                  </div>
                  <span
                    className={`dashboard-status-badge ms-auto ${restaurantStatusClass[restaurant.restaurantStatus]}`}
                  >
                    {formatStatus(restaurant.restaurantStatus)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">Employees</h5>
            <Link to="/admin/staff" className="small text-decoration-none">
              View All →
            </Link>
          </div>
          <div className="card dashboard-card mb-4">
            <div className="list-group list-group-flush p-2">
              {staff.slice(0, 5).map((member) => (
                <div
                  key={member._id}
                  className="list-group-item dashboard-list-item d-flex align-items-center justify-content-between"
                >
                  <div>
                    <p className="mb-0 fw-semibold">
                      {member.fullName} ·{" "}
                      <span className="text-muted fw-normal">
                        {formatRole(member.role)}
                      </span>
                    </p>
                    <p className="text-muted small mb-0">
                      {member.email}
                      {restaurantNameById[member.restaurant] &&
                        ` · ${restaurantNameById[member.restaurant]}`}
                    </p>
                  </div>
                  <span className="dashboard-status-badge dashboard-badge-active ms-auto">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">Clients</h5>
            <Link to="/admin/clients" className="small text-decoration-none">
              View All →
            </Link>
          </div>
          <div className="card dashboard-card">
            <div className="list-group list-group-flush p-2">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client._id}
                  className="list-group-item dashboard-list-item d-flex align-items-center justify-content-between"
                >
                  <div>
                    <p className="mb-0 fw-semibold">{client.fullName}</p>
                    <p className="text-muted small mb-0">{client.email}</p>
                  </div>
                  <span className="dashboard-status-badge dashboard-badge-active ms-auto">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
