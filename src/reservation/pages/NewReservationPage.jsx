import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore, useCalendarStore } from "../../hooks";
import { NavbarComponent } from "../../calendar";
import { spotOnApi } from "../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2";
import "./NewReservationPage.css";

export const NewReservationPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { user } = useAuthStore();
  const {
    events,
    activeEvent,
    startSavingEvent,
    startLoadingEvents,
    setActiveEvent,
  } = useCalendarStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const isEmployee = user?.role === "EMPLOYEE";

  const tableOptions = Array.from({ length: 15 }, (_, i) => i + 1);
  const statusOptions = [
    "New Reservation",
    "Confirmed Reservation",
    "Cancelled Reservation",
  ];

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

  const parseOperatingHours = (operatingHours) => {
    if (!operatingHours) return null;

    const timeMatch = operatingHours.match(
      /(\d{1,2}:\d{2}\s?[APap][Mm])\s*-\s*(\d{1,2}:\d{2}\s?[APap][Mm])/,
    );
    if (!timeMatch) return null;

    const parseTime = (timeStr) => {
      const [, hours, minutes, meridiem] = timeStr.match(
        /(\d{1,2}):(\d{2})\s?([APap][Mm])/,
      );
      let h = parseInt(hours, 10);
      if (meridiem.toUpperCase() === "PM" && h !== 12) h += 12;
      if (meridiem.toUpperCase() === "AM" && h === 12) h = 0;
      return { hours: h, minutes: parseInt(minutes, 10) };
    };

    return {
      open: parseTime(timeMatch[1]),
      close: parseTime(timeMatch[2]),
    };
  };

  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: null,
    numberOfGuests: "",
    customerName: "",
    tableNumber: "",
    status: "New Reservation",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await spotOnApi.get(
          `/restaurants/restaurant/${restaurantId}`,
        );
        setRestaurant(data.restaurant);
      } catch (error) {
        Swal.fire(
          "Error loading restaurant",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
      }
    };
    if (restaurantId) fetchRestaurant();
  }, [restaurantId]);

  useEffect(() => {
    startLoadingEvents();
  }, [startLoadingEvents]);

  useEffect(() => {
    setActiveEvent(null);
  }, [setActiveEvent]);

  //INFO: Check table abailability based on selected date and time
  const occupiedTables = useMemo(() => {
    if (!formValues.start) return [];

    const selectedDay = new Date(formValues.start).toDateString();

    return events
      .filter((ev) => {
        const isSameDay = new Date(ev.start).toDateString() === selectedDay;
        const isDifferentReservation = ev._id !== activeEvent?._id;
        return isSameDay && isDifferentReservation && ev.tableNumber;
      })
      .map((ev) => Number(ev.tableNumber));
  }, [events, formValues.start, activeEvent]);

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

    if (isEmployee && formValues.customerName.trim().length <= 0) {
      Swal.fire("Missing client name", "Enter the client's name", "error");
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

    try {
      await startSavingEvent({ ...formValues, restaurant: restaurantId });
      await Swal.fire({
        title: "Reservation created",
        text: "Your reservation was booked successfully.",
        icon: "success",
        confirmButtonText: "Go to my reservations",
      });
      navigate("/reservations");
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="container py-4 new-reservation-container">
        {!isEmployee && (
          <button
            type="button"
            className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
            onClick={() => navigate("/")}
          >
            <i className="fa fa-arrow-left me-1"></i> Back to restaurants
          </button>
        )}

        {isEmployee && (
          <button
            type="button"
            className="btn btn-link p-0 mb-3 text-muted text-decoration-none"
            onClick={() => navigate("/reservations")}
          >
            <i className="fa fa-arrow-left me-1"></i> Back to calendar
          </button>
        )}

        {!isEmployee && <h1 className="fw-bold mb-1">Schedule your visit</h1>}
        {isEmployee && (
          <h1 className="fw-bold mb-1">Schedule your client's visit</h1>
        )}
        <p className="text-muted mb-4">
          Pick a date and time, then share a few details for your reservation.
        </p>

        {restaurant && !isEmployee && (
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

          {isEmployee && (
            <div className="form-group mb-2">
              <label>Client name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Client's full name"
                name="customerName"
                autoComplete="off"
                value={formValues.customerName}
                onChange={onInputChanged}
                aria-describedby="customerNameHelp"
              />
              <small id="customerNameHelp" className="form-text text-muted">
                Who is this reservation for
              </small>
            </div>
          )}

          <div className="form-group mb-2">
            <label>Start date & time</label>
            <DatePicker
              minDate={new Date()}
              minTime={(() => {
                const hours = parseOperatingHours(restaurant?.operatingHours);
                const base = formValues.start ?? new Date();
                return hours
                  ? new Date(
                      new Date(base).setHours(
                        hours.open.hours,
                        hours.open.minutes,
                        0,
                        0,
                      ),
                    )
                  : new Date(new Date(base).setHours(10, 0, 0, 0));
              })()}
              maxTime={(() => {
                const hours = parseOperatingHours(restaurant?.operatingHours);
                const base = formValues.start ?? new Date();
                return hours
                  ? new Date(
                      new Date(base).setHours(
                        hours.close.hours,
                        hours.close.minutes,
                        0,
                        0,
                      ),
                    )
                  : new Date(new Date(base).setHours(18, 0, 0, 0));
              })()}
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

          {isEmployee && (
            <div className="form-group mb-2">
              <label>Table number</label>
              <select
                className="form-control"
                name="tableNumber"
                value={formValues.tableNumber}
                onChange={onInputChanged}
              >
                <option value="">Select a table</option>
                {tableOptions.map((table) => (
                  <option
                    key={table}
                    value={table}
                    disabled={occupiedTables.includes(table)}
                  >
                    Table {table}{" "}
                    {occupiedTables.includes(table) ? "(Taken)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isEmployee && (
            <div className="form-group mb-2">
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                value={formValues.status}
                onChange={onInputChanged}
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            <label>Notes</label>
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
