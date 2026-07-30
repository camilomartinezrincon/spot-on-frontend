import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  NavbarComponent,
  CalendarEventComponent,
  CalendarModalComponent,
  FabDeleteComponent,
} from "../";
import { useUiStore, useCalendarStore, useAuthStore } from "../../hooks";
import { localizer } from "../../helpers";
import "./CalendarPage.css";

export const CalendarPage = () => {
  const navigate = useNavigate();
  const { openCalendarModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const { user } = useAuthStore();
  const [view, setView] = useState(localStorage.getItem("lastView") || "week");

  // eslint-disable-next-line no-unused-vars
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#347CF7",
      borderRadious: "0px",
      opacity: 0.8,
      color: "white",
    };
    return { style };
  };

  // eslint-disable-next-line no-unused-vars
  const onDoubleClick = (event) => {
    openCalendarModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onViewChanged = (event) => {
    setView(event);
    localStorage.setItem("lastView", event);
  };

  useEffect(() => {
    startLoadingEvents();
  }, [startLoadingEvents]);

  return (
    <>
      <NavbarComponent />
      <div className="calendar-page-container">
        {user?.role === "CLIENT" && (
          <button
            type="button"
            className="btn btn-link mb-3 text-muted text-decoration-none back-to-restaurants-btn"
            onClick={() => navigate("/")}
          >
            <i className="fa fa-arrow-left me-1"></i> Back to restaurants
          </button>
        )}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="calendar-page-inner"
          view={view}
          onView={onViewChanged}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CalendarEventComponent,
          }}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelect}
        />
        <CalendarModalComponent />
        <FabDeleteComponent />
      </div>
    </>
  );
};
