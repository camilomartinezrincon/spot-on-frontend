import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import "./styles/NavbarComponent.css";
import { useEffect, useState } from "react";
import { spotOnApi } from "../../api";

export const NavbarComponent = () => {
  const { startLogout, user } = useAuthStore();
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const { data } = await spotOnApi.get(
          `/restaurants/restaurant/${user.restaurant}`,
        );
        setRestaurantName(data.restaurant.restaurantName);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    if (user?.role === "EMPLOYEE" && user?.restaurant) {
      fetchRestaurantName();
    }
  }, [user?.role, user?.restaurant]);

  const onNewReservation = () => {
    navigate(`/reservations/new/${user.restaurant}`);
  };

  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
      {user?.role === "CLIENT" && (
        <span className="navbar-brand">
          <i className="fas fa-user"></i>
          &nbsp; {user.fullName}
        </span>
      )}

      {user?.role === "EMPLOYEE" && (
        <span className="navbar-brand">
          <i className="fas fa-address-card"></i>
          &nbsp; {user.fullName} - {restaurantName}
        </span>
      )}

      {user?.role === "ADMIN" && (
        <span className="navbar-brand">
          <i className="fas fa-user-tie"></i>
          &nbsp; {user.fullName} - {formatRole(user.role)}
        </span>
      )}

      <div className="d-flex align-items-center">
        {user?.role === "CLIENT" && (
          <Link to="/reservations" className="btn btn-sm my-reservations-btn">
            My reservations
          </Link>
        )}
        {user?.role === "EMPLOYEE" && (
          <button
            className="btn btn-sm my-reservations-btn"
            onClick={onNewReservation}
          >
            New reservation
          </button>
        )}
        <button className="btn btn-outline-danger" onClick={startLogout}>
          <i className="fas fa-sign-out-alt"></i>&nbsp;
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
