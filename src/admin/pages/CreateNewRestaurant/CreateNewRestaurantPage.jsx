import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { spotOnApi } from "../../../api";
import Swal from "sweetalert2";
import "./CreateNewRestaurantPage.css";

const priceRangeOptions = [
  "$ — budget",
  "$$ — moderate",
  "$$$ — expensive",
  "$$$$ — luxury",
];

const provinceOptions = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
];

const statusOptions = ["ACTIVE", "INACTIVE", "CLOSED"];

export const CreateNewRestaurantPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const isEditing = Boolean(restaurantId);
  const [isLoading, setIsLoading] = useState(isEditing);

  const [formValues, setFormValues] = useState({
    restaurantName: "",
    cuisineType: "",
    priceRange: "$$ — moderate",
    restaurantPhoneNum: "",
    restaurantAddress: {
      street: "",
      city: "",
      province: "ON",
      postalCode: "",
    },
    operatingHours: "",
    maxPartySize: "",
    restaurantDescription: "",
    restaurantStatus: "ACTIVE",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await spotOnApi.get(
          `/restaurants/restaurant/${restaurantId}`,
        );
        const restaurant = data.restaurant;
        setFormValues({
          restaurantName: restaurant.restaurantName,
          cuisineType: restaurant.cuisineType,
          priceRange: restaurant.priceRange,
          restaurantPhoneNum: restaurant.restaurantPhoneNum,
          restaurantAddress: {
            street: restaurant.restaurantAddress?.street || "",
            city: restaurant.restaurantAddress?.city || "",
            province: restaurant.restaurantAddress?.province || "ON",
            postalCode: restaurant.restaurantAddress?.postalCode || "",
          },
          operatingHours: restaurant.operatingHours,
          maxPartySize: restaurant.maxPartySize,
          restaurantDescription: restaurant.restaurantDescription || "",
          restaurantStatus: restaurant.restaurantStatus,
        });
      } catch (error) {
        Swal.fire(
          "Error loading restaurant",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (isEditing) fetchRestaurant();
  }, [restaurantId, isEditing]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onAddressChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      restaurantAddress: {
        ...formValues.restaurantAddress,
        [target.name]: target.value,
      },
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formValues,
      maxPartySize: Number(formValues.maxPartySize),
    };

    try {
      if (isEditing) {
        await spotOnApi.put(
          `/restaurants/update/restaurant/${restaurantId}`,
          payload,
        );
      } else {
        await spotOnApi.post("/restaurants/new/restaurant", payload);
      }
      await Swal.fire({
        title: isEditing ? "Restaurant updated" : "Restaurant created",
        icon: "success",
        confirmButtonText: "Back to restaurants",
      });
      navigate("/admin/restaurants");
    } catch (error) {
      Swal.fire(
        isEditing ? "Error updating restaurant" : "Error creating restaurant",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
    }
  };

  if (isLoading) {
    return <p className="text-muted">Loading restaurant...</p>;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
        onClick={() => navigate("/admin/restaurants")}
      >
        <i className="fa fa-arrow-left me-1"></i> Back to restaurants
      </button>

      <h1 className="fw-bold mb-1">
        {isEditing ? "Edit restaurant" : "Add restaurant"}
      </h1>
      <p className="text-muted mb-4">
        {isEditing
          ? "Update the details guests will see when scheduling a visit."
          : "Add the details guests will see when scheduling a visit."}
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label>Restaurant name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Bella Vita"
            name="restaurantName"
            value={formValues.restaurantName}
            onChange={onInputChanged}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Cuisine type</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Italian"
              name="cuisineType"
              value={formValues.cuisineType}
              onChange={onInputChanged}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Price range</label>
            <select
              className="form-control"
              name="priceRange"
              value={formValues.priceRange}
              onChange={onInputChanged}
            >
              {priceRangeOptions.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group mb-3">
          <label>Phone number</label>
          <input
            type="text"
            className="form-control"
            placeholder="(416) 555-0142"
            name="restaurantPhoneNum"
            value={formValues.restaurantPhoneNum}
            onChange={onInputChanged}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Street address</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="24 Main St"
            name="street"
            value={formValues.restaurantAddress.street}
            onChange={onAddressChanged}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              placeholder="Toronto"
              name="city"
              value={formValues.restaurantAddress.city}
              onChange={onAddressChanged}
              required
            />
          </div>
          <div className="col-md-4">
            <label>Province</label>
            <select
              className="form-control"
              name="province"
              value={formValues.restaurantAddress.province}
              onChange={onAddressChanged}
            >
              {provinceOptions.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label>Postal code</label>
            <input
              type="text"
              className="form-control"
              placeholder="M5V 2T6"
              name="postalCode"
              value={formValues.restaurantAddress.postalCode}
              onChange={onAddressChanged}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Operating hours</label>
            <input
              type="text"
              className="form-control"
              placeholder="Mon-Sun, 11am-10pm"
              name="operatingHours"
              value={formValues.operatingHours}
              onChange={onInputChanged}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Max party size</label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="8"
              name="maxPartySize"
              value={formValues.maxPartySize}
              onChange={onInputChanged}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Status</label>
            <select
              className="form-control"
              name="restaurantStatus"
              value={formValues.restaurantStatus}
              onChange={onInputChanged}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Description</label>
          <textarea
            className="form-control"
            rows="3"
            maxLength="500"
            placeholder="A short description of the restaurant"
            name="restaurantDescription"
            value={formValues.restaurantDescription}
            onChange={onInputChanged}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-danger restaurant-form-cancel-btn"
            onClick={() => navigate("/admin/restaurants")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Save changes" : "Save restaurant"}
          </button>
        </div>
      </form>
    </>
  );
};
