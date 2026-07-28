import { useEffect, useMemo, useState } from "react";
import { NavbarComponent } from "../../calendar";
import { spotOnApi } from "../../api";
import "./LandingPage.css";
import Swal from "sweetalert2";

export const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");

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
    // TODO: hook this up once the scheduling flow is built
    console.log("Schedule visit at:", restaurant.restaurantName);
  };

  return (
    <>
      <NavbarComponent />
      <div className="landing-container">
        <h1 className="landing-title">Find a restaurant to schedule</h1>
        <p className="landing-subtitle">
          Browse available restaurants and pick a time that works for you.
        </p>

        <div className="landing-search-group">
          <input
            type="text"
            className="form-control landing-search-input"
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

        {isLoading && <p className="landing-status">Loading restaurants...</p>}

        {!isLoading && filteredRestaurants.length === 0 && (
          <p className="landing-status">
            No restaurants match your search. Try a different name or filter.
          </p>
        )}

        <div className="landing-grid">
          {filteredRestaurants.map((restaurant) => (
            <div className="restaurant-card" key={restaurant._id}>
              <div className="restaurant-card-header">
                <span className="restaurant-price-badge">
                  {restaurant.priceRange.split(" ")[0]}
                </span>
              </div>

              <div className="restaurant-card-body">
                <div className="restaurant-card-title-row">
                  <h3>{restaurant.restaurantName}</h3>
                  <span className="restaurant-cuisine-badge">
                    {restaurant.cuisineType}
                  </span>
                </div>

                <p className="restaurant-card-detail">
                  <i className="fa fa-map-marker-alt"></i>{" "}
                  {restaurant.restaurantAddress?.city}
                </p>
                <p className="restaurant-card-detail">
                  <i className="fa fa-clock"></i> {restaurant.operatingHours}
                </p>

                <button
                  type="button"
                  className="btn btn-primary restaurant-schedule-btn"
                  onClick={() => onScheduleVisit(restaurant)}
                >
                  Schedule a visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
