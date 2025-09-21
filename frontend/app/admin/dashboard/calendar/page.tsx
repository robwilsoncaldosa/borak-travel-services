import Calendar from "../_components/calendar/calendar";

const CalendarPage = () => {
  return (
    <div className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            View all bookings and events in calendar format
          </p>
        </div>
        <Calendar />
      </div>
    </div>
  );
};

export default CalendarPage;