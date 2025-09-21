
export interface MyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  resourceId?: string;
  bookingData?: any; // Add booking data for events created from bookings
  
  // Booking-specific properties (optional for regular events)
  isBooking?: boolean;
  bookingId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  destination?: string;
  pickupLocation?: string;
  status?: 'PENDING' | 'VERIFIED' | 'INPROGRESS' | 'RENDERED' | 'CANCELLED';
  paymentStatus?: 'FULL' | 'PARTIAL' | 'PENDING' | 'REFUNDED';
  packs?: number;
  price?: number;
  paidAmount?: number;
}

export interface BookingEvent extends MyEvent {
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  destination: string;
  pickupLocation: string;
  status: 'PENDING' | 'VERIFIED' | 'INPROGRESS' | 'RENDERED' | 'CANCELLED';
  paymentStatus: 'FULL' | 'PARTIAL' | 'PENDING' | 'REFUNDED';
  packs: number;
  price: number;
  paidAmount: number;
  isBooking: true;
}