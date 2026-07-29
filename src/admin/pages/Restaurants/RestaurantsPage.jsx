import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { spotOnApi } from "../../../api";
import Swal from "sweetalert2";
import "./RestaurantsPage.css";

const restaurantStatusClass = {
  ACTIVE: "restaurants-badge-active",
  INACTIVE: "restaurants-badge-inactive",
  CLOSED: "restaurants-badge-closed",
};

const formatStatus = (status) => {
  if (!status) return "";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const formatAddress = (address) => {
  if (!address) return "";
  return `${address.street}, ${address.city}, ${address.province} ${address.postalCode}`;
};

export const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await spotOnApi.get("/restaurants/restaurants");
        setRestaurants(data.restaurant || []);
      } catch (error) {
        Swal.fire(
          "Error loading restaurants",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) =>
      restaurant.restaurantName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [restaurants, searchTerm]);

  const onDelete = (restaurant) => {
    Swal.fire({
      title: "Delete restaurant?",
      text: `This will permanently delete ${restaurant.restaurantName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await spotOnApi.delete(
          `/restaurants/delete/restaurant/${restaurant._id}`,
        );
        setRestaurants((prev) => prev.filter((r) => r._id !== restaurant._id));
      } catch (error) {
        Swal.fire(
          "Error deleting restaurant",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <h1 className="fw-bold mb-1">Restaurants</h1>
          <p className="text-muted mb-4">
            Every restaurant guests can schedule with.
          </p>
        </div>
        <Link to="/admin/restaurants/new" className="btn btn-primary">
          <i className="fas fa-plus me-1"></i> Add restaurant
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "400px" }}
          placeholder="Search restaurants"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-muted">Loading restaurants...</p>}

      {!isLoading && filteredRestaurants.length === 0 && (
        <p className="text-muted">No restaurants match your search.</p>
      )}

      <div className="card restaurants-card">
        <div className="list-group list-group-flush p-2">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="list-group-item restaurants-list-item d-flex align-items-center justify-content-between"
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
              </div>
              <div className="d-flex align-items-center">
                <span
                  className={`restaurants-status-badge restaurants-badge-spacing ${restaurantStatusClass[restaurant.restaurantStatus]}`}
                >
                  {formatStatus(restaurant.restaurantStatus)}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger p-0 restaurants-delete-btn"
                  onClick={() => onDelete(restaurant)}
                >
                  Delete
                </button>
                <Link
                  to={`/admin/restaurants/${restaurant._id}`}
                  className="small text-decoration-none"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
