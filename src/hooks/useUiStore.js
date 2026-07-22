import { useDispatch, useSelector } from "react-redux";
import { onCloseCalendarModal, onOpenCalendarModal } from "../store";

export const useUiStore = () => {
  const dispatch = useDispatch();
  const { isCalendarModalOpen } = useSelector((state) => state.ui);

  const openCalendarModal = () => {
    dispatch(onOpenCalendarModal());
  };

  const closeCalendarModal = () => {
    dispatch(onCloseCalendarModal());
  };

  return {
    isCalendarModalOpen,
    openCalendarModal,
    closeCalendarModal,
  };
};
