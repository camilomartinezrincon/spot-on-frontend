import { addHours, differenceInSeconds } from "date-fns";
import { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/CalendarModalComponent.css";

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
  const [isOpen, setIsOpen] = useState(true);
  const [formValues, setFormValues] = useState({
    title: "Camilo",
    notes: "Martinez",
    start: new Date(),
    end: addHours(new Date(), 2),
  });

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
    console.log("Closing modal");
    setIsOpen(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const difference = differenceInSeconds(formValues.end, formValues.start);
    console.log(difference);
  };

  return (
    <Modal
      isOpen={isOpen}
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
            className="form-control"
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
