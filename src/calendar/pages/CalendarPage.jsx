import { useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  NavbarComponent,
  CalendarEventComponent,
  CalendarModalComponent,
} from "../";
import { addHours } from "date-fns";
import { localizer } from "../../helpers";
import "./CalendarPage.css";

const events = [
  {
    title: "Reservation Camilo Martinez",
    notes: "Camilo Martinez Birthday",
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: "#fafafafa",
    user: {
      _id: "testCode_123",
      name: "Viviana Camargo",
    },
  },
];

export const CalendarPage = () => {
  const [view, setView] = useState(localStorage.getItem("lastView") || "week");

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#347CF7",
      borderRadious: "0px",
      opacity: 0.8,
      color: "white",
    };
    return { style };
  };

  const onDoubleClick = (event) => {
    console.log({ doubleClick: event });
  };

  const onSelect = (event) => {
    console.log({ click: event });
  };

  const onViewChanged = (event) => {
    setView(event);
    localStorage.setItem("lastView", event);
  };

  return (
    <>
      <NavbarComponent />
      <div style={{ height: "calc(100vh - 80px)" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
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
      </div>
    </>
  );
};
