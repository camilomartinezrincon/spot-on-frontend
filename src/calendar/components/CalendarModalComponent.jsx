import { useEffect, useMemo, useState } from "react";
import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/CalendarModalComponent.css";
import "sweetalert2/src/sweetalert2.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const tableOptions = Array.from({ length: 15 }, (_, i) => i + 1);
const statusOptions = [
  "New Reservation",
  "Confirmed Reservation",
  "Cancelled Reservation",
];

export const CalendarModalComponent = () => {
  const { isCalendarModalOpen, closeCalendarModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();
  const { user } = useAuthStore();
  const isEmployee = user?.role === "EMPLOYEE";
  const [formSubmitted, setFormSubmitted] = useState(false);

  //TODO: change this is just for testing
  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: null,
    numberOfGuests: "",
  });

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

  const isReservationConfirmedWithTable =
    !!formValues.tableNumber && formValues.status === "Confirmed Reservation";

  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onCloseModal = () => {
    closeCalendarModal();
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

    await startSavingEvent(formValues);
    closeCalendarModal();
    setFormSubmitted(false);
  };

  return (
    <Modal
      isOpen={isCalendarModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-background"
      closeTimeoutMS={200}
    >
      <h1> Update Event </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
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
              value={formValues.customerName}
              readOnly
            />
          </div>
        )}

        <div className="form-group mb-2">
          <label>Start date & time</label>
          <DatePicker
            minDate={new Date()}
            minTime={new Date(new Date(formValues.start).setHours(10, 0, 0, 0))}
            maxTime={new Date(new Date(formValues.start).setHours(18, 0, 0, 0))}
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

        {(isEmployee || isReservationConfirmedWithTable) && (
          <div className="form-group mb-2">
            <label>Table number</label>
            {isEmployee ? (
              <select
                className="form-control"
                name="tableNumber"
                value={formValues.tableNumber}
                onChange={onInputChanged}
              >
                <option value="">Select a table</option>
                {tableOptions.map((table) => (
                  <option key={table} value={table}>
                    Table {table}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                value={`Table ${formValues.tableNumber}`}
                readOnly
              />
            )}
          </div>
        )}

        {(isEmployee || isReservationConfirmedWithTable) && (
          <div className="form-group mb-2">
            <label>Status</label>
            {isEmployee ? (
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
            ) : (
              <input
                type="text"
                className="form-control"
                value={formValues.status}
                readOnly
              />
            )}
          </div>
        )}

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
    </Modal>
  );
};
