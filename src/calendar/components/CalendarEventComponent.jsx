export const CalendarEventComponent = ({ event }) => {
  const { title, user, customerName } = event;
  const displayName = user?.role === "EMPLOYEE" ? customerName : user?.fullName;
  return (
    <>
      <strong>{title}</strong>
      <span> - {displayName}</span>
    </>
  );
};
