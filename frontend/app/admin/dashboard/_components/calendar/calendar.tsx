"use client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  SlotInfo,
  ToolbarProps,
  View,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styles.css";
import { EventDialog } from "./event-dialog";
import { MyEvent } from "../../types/calendar";
import { EventForm } from "./event-form";
import { useBookingsCache } from "@/hooks/useAdminCache";
import { toast } from "sonner";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Helper function to convert booking data to calendar events
const convertBookingsToEvents = (bookings: any[]): MyEvent[] => {
  return bookings.map((booking) => {
    const pickupDate = new Date(booking.pickup_date);
    const returnDate = new Date(booking.return_date);

    const customerName = booking.guest
      ? `${booking.guest.firstname || ''} ${booking.guest.lastname || ''}`.trim() || booking.guest.username
      : 'Unknown Customer';

    return {
      id: booking._id,
      title: `${booking.destination} - ${customerName}`,
      start: pickupDate,
      end: returnDate,
      description: `Pickup: ${booking.pickup_location}`,
      location: booking.destination,
      // Booking-specific data
      bookingId: booking._id,
      customerId: booking.user_id,
      customerName,
      customerEmail: booking.guest?.email || '',
      destination: booking.destination,
      pickupLocation: booking.pickup_location,
      status: booking.status,
      paymentStatus: booking.payment_status,
      packs: booking.packs,
      price: booking.price,
      paidAmount: booking.paid_amount,
      isBooking: true,
    } as MyEvent;
  });
};

export default function Calendar() {
  const { data: bookings, isLoading, error, refreshData } = useBookingsCache();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();

  // Convert bookings to calendar events when bookings data changes
  useEffect(() => {
    if (bookings && Array.isArray(bookings)) {
      const bookingEvents = convertBookingsToEvents(bookings);
      setEvents(bookingEvents);
    }
  }, [bookings]);

  const handleSelectEvent = (event: MyEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Only allow creating non-booking events for now
    setSelectedSlot(slotInfo.start);
    setSelectedEvent(null);
    setShowEventForm(true);
    if (slotInfo.end) {
      const endDate = new Date(slotInfo.end);
      endDate.setDate(endDate.getDate() - 1);
      setSelectedEndDate(endDate);
    } else {
      setSelectedEndDate(undefined);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setSelectedSlot(new Date());
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData: Omit<MyEvent, "id">) => {
    if (selectedEvent && !selectedEvent.isBooking) {
      // Only allow editing non-booking events
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? { ...eventData, id: event.id } : event
        )
      );
      toast.success('Event updated successfully');
    } else if (!selectedEvent) {
      // Create new non-booking event
      const newEvent: MyEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
        isBooking: false,
      };
      setEvents([...events, newEvent]);
      toast.success('Event created successfully');
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && !selectedEvent.isBooking) {
      // Only allow deleting non-booking events
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setShowEventDialog(false);
      toast.success('Event deleted successfully');
    } else if (selectedEvent?.isBooking) {
      toast.error('Cannot delete booking events from calendar. Use the bookings page to manage bookings.');
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent?.isBooking) {
      toast.error('Cannot edit booking events from calendar. Use the bookings page to manage bookings.');
      return;
    }
    setShowEventDialog(false);
    setShowEventForm(true);
  };

  const handleRefresh = () => {
    refreshData();
    toast.success('Calendar refreshed');
  };

  // Custom event style function
  const eventStyleGetter = (event: MyEvent) => {
    let backgroundColor = '#3174ad';
    let borderColor = '#3174ad';

    if (event.isBooking) {
      switch (event.status) {
        case 'PENDING':
          backgroundColor = '#f59e0b';
          borderColor = '#f59e0b';
          break;
        case 'VERIFIED':
          backgroundColor = '#10b981';
          borderColor = '#10b981';
          break;
        case 'INPROGRESS':
          backgroundColor = '#3b82f6';
          borderColor = '#3b82f6';
          break;
        case 'RENDERED':
          backgroundColor = '#6b7280';
          borderColor = '#6b7280';
          break;
        case 'CANCELLED':
          backgroundColor = '#ef4444';
          borderColor = '#ef4444';
          break;
        default:
          backgroundColor = '#8b5cf6';
          borderColor = '#8b5cf6';
      }
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
      },
    };
  };

  const CustomToolbar: React.FC<ToolbarProps<MyEvent>> = (props) => {
    const { label, onNavigate, onView } = props;

    return (
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => onNavigate("TODAY")}>
            Today
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => onNavigate("PREV")}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => onNavigate("NEXT")}>
              Next
            </Button>
          </div>
          <h2 className="text-xl font-semibold">{label}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={handleAddEvent}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </Button>
          <div className="flex space-x-2">
            {["month", "week", "day"].map((viewType) => (
              <Button
                key={viewType}
                variant="outline"
                onClick={() => onView(viewType as View)}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="h-full w-full px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading booking data</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-4">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Verified</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Rendered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Cancelled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Custom Events</span>
        </div>
      </div>

      <div className="h-[calc(85vh-3rem)] rounded-lg shadow-sm">
        <BigCalendar
          localizer={localizer}
          events={events}
          defaultView="month"
          views={["month", "week", "day"]}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      <EventDialog
        event={selectedEvent}
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <EventForm
        event={selectedEvent}
        open={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setSelectedEndDate(undefined);
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedSlot ?? undefined}
        selectedEndDate={selectedEndDate}
      />
    </div>
  );
}