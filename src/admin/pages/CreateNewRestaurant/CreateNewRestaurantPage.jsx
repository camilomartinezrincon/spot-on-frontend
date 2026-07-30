import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./CreateNewRestaurantPage.css";
import { useRestaurantStore } from "../../../hooks";

const priceRangeOptions = [
  "$ — budget",
  "$$ — moderate",
  "$$$ — expensive",
  "$$$$ — luxury",
];

const provinceOptions = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

const statusOptions = ["ACTIVE", "INACTIVE", "CLOSED"];

export const CreateNewRestaurantPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const isEditing = Boolean(restaurantId);
  const { startSavingRestaurant, startLoadingRestaurant } =
    useRestaurantStore();
  const [isLoading, setIsLoading] = useState(isEditing);

  const [formValues, setFormValues] = useState({
    restaurantName: "",
    cuisineType: "",
    priceRange: "",
    restaurantPhoneNum: "",
    restaurantAddress: {
      street: "",
      city: "",
      province: "",
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
        const restaurant = await startLoadingRestaurant(restaurantId);
        setFormValues({ ...restaurant });
      } catch (error) {
        console.error({ error });
      } finally {
        setIsLoading(false);
      }
    };
    if (isEditing) fetchRestaurant();
  }, [restaurantId, isEditing, startLoadingRestaurant]);

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

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length < 10) return value;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const formatPostalCode = (value) => {
    const cleaned = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    if (cleaned.length < 6) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await startSavingRestaurant(formValues);
      navigate("/admin/restaurants");
    } catch (error) {
      console.error({ error });
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
              required
            >
              <option value="">Select a price range</option>
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
            placeholder="e.g. (416) 555-0142"
            name="restaurantPhoneNum"
            value={formValues.restaurantPhoneNum}
            onChange={onInputChanged}
            onBlur={() =>
              setFormValues({
                ...formValues,
                restaurantPhoneNum: formatPhoneNumber(
                  formValues.restaurantPhoneNum,
                ),
              })
            }
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Street address</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="e.g. 24 Main St"
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
              placeholder="e.g. Toronto"
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
              required
            >
              <option value="">Select a province</option>
              {provinceOptions.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label>Postal code</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. M5V 2T6"
              name="postalCode"
              value={formValues.restaurantAddress.postalCode}
              onChange={onAddressChanged}
              onBlur={() =>
                setFormValues({
                  ...formValues,
                  restaurantAddress: {
                    ...formValues.restaurantAddress,
                    postalCode: formatPostalCode(
                      formValues.restaurantAddress.postalCode,
                    ),
                  },
                })
              }
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
              placeholder="e.g. Mon-Sun, 11am-10pm"
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
              placeholder="e.g. 8"
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
            {isEditing ? "Save Changes" : "Save Restaurant"}
          </button>
        </div>
      </form>
    </>
  );
};
