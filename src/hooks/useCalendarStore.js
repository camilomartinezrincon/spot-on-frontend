import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store";
import { spotOnApi } from "../api";
import Swal from "sweetalert2";
import { useCallback } from "react";

const buildReservationPayload = (calendarEvent, user) => ({
  eventTitle: calendarEvent.title,
  customerName: calendarEvent.customerName || user.fullName,
  reservationDateTime: calendarEvent.start,
  numberOfGuests: Number(calendarEvent.numberOfGuests),
  notes: calendarEvent.notes,
  restaurant: calendarEvent.restaurant,
  tableNumber: calendarEvent.tableNumber || undefined,
  status: calendarEvent.status,
});

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    const payload = buildReservationPayload(calendarEvent, user);
    try {
      if (calendarEvent._id) {
        const { data } = await spotOnApi.put(
          `/events/update/reservation/${calendarEvent._id}`,
          payload,
        );
        dispatch(
          onUpdateEvent({
            ...calendarEvent,
            end: new Date(data.reservation.endReservationDateTime),
          }),
        );
      } else {
        const { data } = await spotOnApi.post(
          "/events/new/reservation",
          payload,
        );
        dispatch(
          onAddNewEvent({
            ...calendarEvent,
            _id: data.reservation._id,
            end: new Date(data.reservation.endReservationDateTime),
            user,
          }),
        );
      }
    } catch (error) {
      Swal.fire(
        "Error saving reservation",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startDeletingEvent = async () => {
    try {
      await spotOnApi.delete(`/events/delete/reservation/${activeEvent._id}`);
      dispatch(onDeleteEvent());
    } catch (error) {
      Swal.fire(
        "Error deleting reservation",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
      throw error;
    }
  };

  const startLoadingEvents = useCallback(async () => {
    try {
      const { data } = await spotOnApi.get("/events/reservations");
      const reservations = data.reservation.map((event) => ({
        ...event,
        start: new Date(event.reservationDateTime),
        end: new Date(event.endReservationDateTime),
        title: event.eventTitle,
      }));
      dispatch(onLoadEvents(reservations));
    } catch (error) {
      console.log(error.response?.data);
      Swal.fire(
        "Error loading reservations",
        error.response?.data?.msg || "Something went wrong, please try again",
        "error",
      );
    }
  }, [dispatch]);

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  };
};
