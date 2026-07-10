import { addHours, differenceInSeconds } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useCalendarStore, useUiStore } from "../../hooks";
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

export const CalendarModalComponent = () => {
  const { isCalendarModalOpen, closeCalendarModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();
  const [formSubmitted, setFormSubmitted] = useState(false);

  //TODO: change this is just for testing
  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 2),
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

  const onCloseModal = () => {
    closeCalendarModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0) {
      Swal.fire("Incorrect dates", "Check the input dates", "error");
      return;
    }

    if (formValues.title.length <= 0) return;

    console.log(formValues);

    //TODO:
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
      <h1> New Event </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
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
            popperPlacement="bottom-start"
            popperProps={{
              strategy: "fixed",
            }}
          />
        </div>

        <div className="form-group mb-2">
          <label>End date & time</label>
          <DatePicker
            minDate={formValues.start}
            minTime={formValues.start}
            maxTime={new Date(new Date(formValues.end).setHours(18, 0, 0, 0))}
            selected={formValues.end}
            className="form-control"
            onChange={(event) => onDateChanged(event, "end")}
            dateFormat="Pp"
            wrapperClassName="w-50 d-block"
            showTimeSelect
            popperPlacement="bottom-start"
            popperProps={{
              strategy: "fixed",
            }}
          />
        </div>

        <div className="form-group mb-2">
          <label>Title and notes</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Event title"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChanged}
          />
          <small id="emailHelp" className="form-text text-muted">
            A short description
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
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
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
