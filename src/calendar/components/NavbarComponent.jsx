import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import "./styles/NavbarComponent.css";

export const NavbarComponent = () => {
  const { startLogout, user } = useAuthStore();
  const navigate = useNavigate();

  const onNewReservation = () => {
    navigate(`/reservations/new/${user.restaurant}`);
  };

  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
      <span className="navbar-brand">
        <i className="fas fa-calendar-alt"></i>
        &nbsp; {user.fullName}
      </span>

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
