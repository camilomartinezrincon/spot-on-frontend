import { useEffect, useMemo, useState } from "react";
import { NavbarComponent } from "../../calendar";
import { spotOnApi } from "../../api";
import "./LandingPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const navigate = useNavigate();

  const statusDotClass = {
    ACTIVE: "status-dot--active",
    INACTIVE: "status-dot--inactive",
    CLOSED: "status-dot--closed",
  };

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.street}, ${address.city}, ${address.province}`;
  };

  const formatPriceRange = (priceRange) => {
    if (!priceRange) return "";
    const [symbol, label] = priceRange
      .split(/[—–-]/)
      .map((part) => part.trim());
    if (!label) return symbol || "";
    const formattedLabel =
      label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    return `${symbol} - ${formattedLabel}`;
  };

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

  const cuisines = useMemo(() => {
    const unique = [...new Set(restaurants.map((r) => r.cuisineType))];
    return ["All", ...unique];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesCuisine =
        activeCuisine === "All" || restaurant.cuisineType === activeCuisine;
      const matchesSearch = restaurant.restaurantName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCuisine && matchesSearch;
    });
  }, [restaurants, activeCuisine, searchTerm]);

  const onScheduleVisit = (restaurant) => {
    navigate(`/reservations/new/${restaurant._id}`);
    console.log(`Restaurant ID: ${restaurant._id}`);
  };

  return (
    <>
      <NavbarComponent />
      <div className="container py-4">
        <h1 className="fw-bold mb-1">Find a restaurant to schedule</h1>
        <p className="text-muted mb-4">
          Browse available restaurants and pick a time that works for you.
        </p>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search restaurants"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="landing-filters">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              className={`landing-filter-chip ${
                activeCuisine === cuisine ? "active" : ""
              }`}
              onClick={() => setActiveCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-muted">Loading restaurants...</p>}

        {!isLoading && filteredRestaurants.length === 0 && (
          <p className="text-muted">
            No restaurants match your search. Try a different name or filter.
          </p>
        )}

        <div className="row g-10">
          {filteredRestaurants.map((restaurant) => (
            <div className="col-12 col-sm-6 col-lg-4" key={restaurant._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body restaurant-card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">
                      {restaurant.restaurantName}
                    </h5>
                    <span className="badge bg-light text-dark border">
                      {formatPriceRange(restaurant.priceRange)}
                    </span>
                  </div>
                  <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill mb-2">
                    {restaurant.cuisineType}
                  </span>
                  <p className="small mb-2 d-flex align-items-center">
                    <span className="icon-slot">
                      <span
                        className={`status-dot ${statusDotClass[restaurant.restaurantStatus]}`}
                      ></span>
                    </span>
                    {formatStatus(restaurant.restaurantStatus)}
                  </p>

                  <p className="text-muted small mb-2 d-flex align-items-center">
                    <span className="icon-slot">
                      <i className="fa fa-clock"></i>
                    </span>
                    {restaurant.operatingHours}
                  </p>

                  <p className="text-muted small mb-1 d-flex align-items-center">
                    <span className="icon-slot">
                      <i className="fa fa-map-marker-alt"></i>
                    </span>
                    {formatAddress(restaurant.restaurantAddress)}
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => onScheduleVisit(restaurant)}
                  >
                    Schedule a visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
