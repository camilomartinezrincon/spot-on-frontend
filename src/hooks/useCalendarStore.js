import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store";
import { spotOnApi } from "../api";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);
  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    if (calendarEvent._id) {
      // TODO: update
      dispatch(onUpdateEvent({ ...calendarEvent }));
    } else {
      const payload = {
        eventTitle: calendarEvent.title,
        customerName: user.fullName,
        reservationDateTime: calendarEvent.start,
        numberOfGuests: Number(calendarEvent.numberOfGuests),
        notes: calendarEvent.notes,
        restaurant: calendarEvent.restaurant,
      };
      try {
        const { data } = await spotOnApi.post(
          "/events/new/reservation",
          payload,
        );
        console.log({ data });
        dispatch(onAddNewEvent({ ...calendarEvent, id: data.event._id, user }));
      } catch (error) {
        Swal.fire(
          "Error saving reservation",
          error.response?.data?.msg || "Something went wrong, please try again",
          "error",
        );
        throw error;
      }
    }
  };

  const startDeletingEvent = () => {
    //ToDo: connect with the backend
    dispatch(onDeleteEvent());
  };

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
  };
};
