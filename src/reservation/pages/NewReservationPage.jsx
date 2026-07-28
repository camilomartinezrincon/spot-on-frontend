import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCalendarStore } from "../../hooks";
import { NavbarComponent } from "../../calendar";
import { spotOnApi } from "../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2";
import "./NewReservationPage.css";

export const NewReservationPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { activeEvent, startSavingEvent } = useCalendarStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

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

  //TODO: change this is just for testing
  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: null,
    numberOfGuests: "",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await spotOnApi.get(
          `/restaurants/restaurant/${restaurantId}`,
        );
        setRestaurant(data.restaurant);
      } catch (error) {
        console.log({ error });
        Swal.fire(
          "Error loading restaurant",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      }
    };
    if (restaurantId) fetchRestaurant();
  }, [restaurantId]);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.title.length > 0 ? "is-valid" : "is-invalid";
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent !== null) {
      setTimeout(() => {
        setFormValues({ ...activeEvent });
      }, 0);
    }
  }, [activeEvent]);

  const guestsClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.numberOfGuests > 0 ? "is-valid" : "is-invalid";
  }, [formValues.numberOfGuests, formSubmitted]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formValues.start) {
      Swal.fire("Incorrect date", "Select a start date & time", "error");
      return;
    }

    if (formValues.title.length <= 0) return;

    if (
      formValues.numberOfGuests === "" ||
      isNaN(formValues.numberOfGuests) ||
      Number(formValues.numberOfGuests) <= 0
    ) {
      Swal.fire(
        "Incorrect number of guests",
        "Check the number of guests",
        "error",
      );
      return;
    }

    console.log(formValues);

    //TODO:
    await startSavingEvent({ ...formValues, restaurant: restaurantId });
    setFormSubmitted(false);
  };

  return (
    <>
      <NavbarComponent />
      <div className="container py-4" style={{ maxWidth: "700px" }}>
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
          onClick={() => navigate("/")}
        >
          <i className="fa fa-arrow-left me-1"></i> Back to restaurants
        </button>

        <h1 className="fw-bold mb-1">Schedule your visit</h1>
        <p className="text-muted mb-4">
          Pick a date and time, then share a few details for your reservation.
        </p>

        {restaurant && (
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="card-title mb-0">{restaurant.restaurantName}</h5>
                <span className="small d-flex align-items-center status-inline">
                  <span
                    className={`new-reservation-status-dot ${statusDotClass[restaurant.restaurantStatus]}`}
                  ></span>
                  {formatStatus(restaurant.restaurantStatus)}
                </span>
              </div>
              <p className="text-muted small mb-1 d-flex align-items-center">
                <span className="icon-slot">
                  <i className="fa fa-map-marker-alt"></i>
                </span>
                {formatAddress(restaurant.restaurantAddress)}
              </p>
              <p className="text-muted small mb-1">
                {restaurant.cuisineType} ·{" "}
                {formatPriceRange(restaurant.priceRange)}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Title</label>
            <input
              type="text"
              className={`form-control ${titleClass}`}
              placeholder="Event title"
              name="title"
              autoComplete="off"
              value={formValues.title}
              onChange={onInputChanged}
              aria-describedby="titleHelp"
            />
            <small id="titleHelp" className="form-text text-muted">
              A short description
            </small>
          </div>

          <div className="form-group mb-2">
            <label>Start date & time</label>
            <DatePicker
              minDate={new Date()}
              minTime={
                new Date(new Date(formValues.start).setHours(10, 0, 0, 0))
              }
              maxTime={
                new Date(new Date(formValues.start).setHours(18, 0, 0, 0))
              }
              selected={formValues.start}
              className="form-control"
              onChange={(event) => onDateChanged(event, "start")}
              dateFormat="Pp"
              wrapperClassName="w-50 d-block"
              showTimeSelect
              placeholderText="Select a date & time"
              popperPlacement="bottom-start"
              popperProps={{
                strategy: "fixed",
              }}
            />
          </div>

          <div className="form-group mb-2">
            <label>Number of guests</label>
            <input
              type="number"
              min="1"
              className={`form-control ${guestsClass}`}
              placeholder="Number of guests"
              name="numberOfGuests"
              autoComplete="off"
              value={formValues.numberOfGuests}
              onChange={onInputChanged}
              aria-describedby="guestsHelp"
            />
            <small id="guestsHelp" className="form-text text-muted">
              How many people is this reservation for
            </small>
          </div>

          <div className="form-group mb-2">
            <textarea
              type="text"
              className="form-control"
              placeholder="Notes"
              rows="5"
              name="notes"
              value={formValues.notes}
              onChange={onInputChanged}
              aria-describedby="notesHelp"
            ></textarea>
            <small id="notesHelp" className="form-text text-muted">
              Additional information
            </small>
          </div>
          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-outline-primary">
              <i className="far fa-save"></i>
              <span> Save</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
