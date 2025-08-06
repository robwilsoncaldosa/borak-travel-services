"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  Trash2,
  X,
  Printer,
  MessageSquare,
} from "lucide-react";
import { bookingsApi } from "@/lib/backend_api/bookings";
import { guestApi } from "@/lib/backend_api/guest";

interface Booking {
  _id: string;
  user_id: string;
  package_id: string;
  destination: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  status: 'PENDING' | 'VERIFIED' | 'INPROGRESS' | 'RENDERED' | 'CANCELLED';
  payment_status: 'FULL' | 'PARTIAL' | 'PENDING' | 'REFUNDED';
  packs: number;
  price: number;
  paid_amount: number | null;
  created_at: string;
  updated_at: string;
  guest?: {
    username: string;
    email: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    mobile?: string;
  };
}

interface EditBookingFormData {
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
  price: number;
  paid_amount: number | null;
  status: 'PENDING' | 'VERIFIED' | 'INPROGRESS' | 'RENDERED' | 'CANCELLED';
  payment_status: 'FULL' | 'PARTIAL' | 'PENDING' | 'REFUNDED';
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditBookingFormData>({
    pickup_date: '',
    pickup_time: '',
    return_date: '',
    return_time: '',
    price: 0,
    paid_amount: null,
    status: 'PENDING',
    payment_status: 'PENDING'
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsApi.getAllBookings();
      console.log('Received bookings data:', response);

      // Fetch guest data for each booking
      const bookingsWithGuests = await Promise.all(
        response.map(async (booking: Booking) => {
          try {
            console.log('Fetching guest for user_id:', booking.user_id);
            const guest = await guestApi.getGuestById(booking.user_id);
            console.log('Successfully fetched guest:', guest);
            return { ...booking, guest };
          } catch (error) {
            console.error(`Failed to fetch guest for booking ${booking._id} with user_id ${booking.user_id}:`, error);
            console.error('Error details:', {
              bookingId: booking._id,
              userId: booking.user_id,
              error: error
            });
            return { ...booking, guest: undefined };
          }
        })
      );

      setBookings(bookingsWithGuests);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.guest?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (booking.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (booking.guest?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (booking.guest?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (booking.guest?.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      VERIFIED: { color: "bg-blue-100 text-blue-800", label: "Verified" },
      INPROGRESS: { color: "bg-orange-100 text-orange-800", label: "In Progress" },
      RENDERED: { color: "bg-green-100 text-green-800", label: "Completed" },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-red-100 text-red-800", label: "Pending" },
      PARTIAL: { color: "bg-orange-100 text-orange-800", label: "Partial" },
      FULL: { color: "bg-green-100 text-green-800", label: "Paid" },
      REFUNDED: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    console.log('Formatting date:', dateString);
    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }

    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(price);
  };

  // Action handlers
  const handleViewDetails = (booking: Booking) => {
    console.log('View details for booking:', booking);
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    console.log('Edit booking:', booking);
    setSelectedBooking(booking);

    // Parse the date strings to extract date and time
    const pickupDate = new Date(booking.pickup_date);
    const returnDate = new Date(booking.return_date);

    console.log('Original pickup_date:', booking.pickup_date);
    console.log('Parsed pickupDate:', pickupDate);
    console.log('Original return_date:', booking.return_date);
    console.log('Parsed returnDate:', returnDate);

    // Format date as YYYY-MM-DD for date inputs
    const formatDateForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Format time as HH:MM for time inputs
    const formatTimeForInput = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const formattedPickupDate = formatDateForInput(pickupDate);
    const formattedPickupTime = formatTimeForInput(pickupDate);
    const formattedReturnDate = formatDateForInput(returnDate);
    const formattedReturnTime = formatTimeForInput(returnDate);

    console.log('Formatted pickup date:', formattedPickupDate);
    console.log('Formatted pickup time:', formattedPickupTime);
    console.log('Formatted return date:', formattedReturnDate);
    console.log('Formatted return time:', formattedReturnTime);

    setEditFormData({
      pickup_date: formattedPickupDate,
      pickup_time: formattedPickupTime,
      return_date: formattedReturnDate,
      return_time: formattedReturnTime,
      price: booking.price,
      paid_amount: booking.paid_amount,
      status: booking.status,
      payment_status: booking.payment_status
    });
    setShowEditModal(true);
    setShowBookingModal(false);
  };

  // const handleUpdateStatus = (booking: Booking) => {
  //   console.log('Update status for booking:', booking);
  //   const statusOptions = ['PENDING', 'VERIFIED', 'INPROGRESS', 'RENDERED'];
  //   const currentStatus = booking.status;
  //   const availableStatuses = statusOptions.filter(status => status !== currentStatus);

  //   const statusList = availableStatuses.map(status => `${status}`).join('\n');
  //   const newStatus = prompt(`Current status: ${currentStatus}\n\nAvailable statuses:\n${statusList}\n\nEnter new status:`);

  //   if (newStatus && statusOptions.includes(newStatus.toUpperCase())) {
  //     // TODO: Call API to update status
  //     console.log(`Updating booking ${booking._id} status from ${currentStatus} to: ${newStatus.toUpperCase()}`);
  //     alert(`Status updated from ${currentStatus} to: ${newStatus.toUpperCase()}`);
  //   } else if (newStatus) {
  //     alert(`Invalid status: ${newStatus}\nValid options: ${statusOptions.join(', ')}`);
  //   }
  // };

  const handleSendEmail = async (booking: Booking) => {
    console.log('Send email for booking:', booking);
    // TODO: Implement email sending functionality
    alert(`Sending email notification for booking: ${booking._id}\nCustomer: ${booking.guest?.username || booking.user_id}`);
  };

  const handleSendSMS = (booking: Booking) => {
    console.log('Send SMS for booking:', booking);
    // TODO: Integrate with SMS service
    alert(`Sending SMS notification for booking: ${booking._id}\nCustomer: ${booking.guest?.username || booking.user_id}`);
  };

  const handlePrintReceipt = (booking: Booking) => {
    console.log('Print receipt for booking:', booking);
    setSelectedBooking(booking);
    setShowReceiptModal(true);
  };

  const handleCancelBooking = async (booking: Booking) => {
    console.log('Cancel booking:', booking);
    const confirmCancel = confirm(`Are you sure you want to cancel this booking?\n\nBooking ID: ${booking._id}\nCustomer: ${booking.guest?.username || booking.user_id}\nDestination: ${booking.destination}\n\nThis will update the booking status to CANCELLED.`);

    if (confirmCancel) {
      try {
        const updatedData = {
          status: 'CANCELLED' as const
        };

        console.log('Cancelling booking with data:', updatedData);

        // Call API to update booking status
        const response = await bookingsApi.updateBooking(booking._id, updatedData);
        console.log('Booking cancelled successfully:', response);

        alert('Booking cancelled successfully!');

        // Refresh the bookings list
        loadBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedBooking(null);
    setEditFormData({
      pickup_date: '',
      pickup_time: '',
      return_date: '',
      return_time: '',
      price: 0,
      paid_amount: null,
      status: 'PENDING',
      payment_status: 'PENDING'
    });
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedBooking(null);
  };

  const handlePrintReceiptAction = () => {
    if (!selectedBooking) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptContent = generateReceiptHTML(selectedBooking);
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSendReceiptEmail = async () => {
    if (!selectedBooking) return;
    try {
      console.log(`Sending receipt email for booking ID: ${selectedBooking._id}`);
      const response = await bookingsApi.sendReceiptEmail(selectedBooking._id);
      if (response && response.message) {
        console.log('Receipt sent successfully!');
        alert(response.message);
      } else {
        console.error('Failed to send receipt.', response);
        alert('Failed to send receipt.');
      }
    } catch (error: any) {
      console.error('Error sending receipt:', error);
      // Try to show backend error message if available
      const backendMessage = error?.response?.data?.message || error?.message;
      alert(backendMessage ? `Error: ${backendMessage}` : 'Error sending receipt.');
    }
  };

  const generateReceiptHTML = (booking: Booking) => {
    const receiptNumber = booking._id.slice(-8).toUpperCase();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Receipt - ${receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #333; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .receipt-title { font-size: 18px; margin-bottom: 5px; }
          .receipt-number { font-size: 14px; color: #666; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .label { font-weight: bold; }
          .value { text-align: right; }
          .total { border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; font-weight: bold; font-size: 18px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } .receipt { border: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company-name">BORAK TRAVEL CEBU SERVICES</div>
            <div class="receipt-title">BOOKING RECEIPT</div>
            <div class="receipt-number">Receipt #: ${receiptNumber}</div>
            <div>Date: ${currentDate} | Time: ${currentTime}</div>
          </div>
          
          <div class="section">
            <div class="section-title">CUSTOMER INFORMATION</div>
            <div class="row">
              <span class="label">Customer Name:</span>
              <span class="value">${booking.guest?.firstname && booking.guest?.lastname
        ? `${booking.guest.firstname} ${booking.guest.middlename ? booking.guest.middlename + ' ' : ''}${booking.guest.lastname}`
        : booking.guest?.username || 'Guest ' + booking.user_id.slice(-6)
      }</span>
            </div>
            <div class="row">
              <span class="label">Email:</span>
              <span class="value">${booking.guest?.email || 'No email available'}</span>
            </div>
            <div class="row">
              <span class="label">Mobile Number:</span>
              <span class="value">${booking.guest?.mobile || 'No mobile number available'}</span>
            </div>
            <div class="row">
              <span class="label">Customer ID:</span>
              <span class="value">${booking.user_id}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">BOOKING DETAILS</div>
            <div class="row">
              <span class="label">Booking ID:</span>
              <span class="value">${booking._id}</span>
            </div>
            <div class="row">
              <span class="label">Destination:</span>
              <span class="value">${booking.destination}</span>
            </div>
            <div class="row">
              <span class="label">Pickup Location:</span>
              <span class="value">${booking.pickup_location}</span>
            </div>
            <div class="row">
              <span class="label">Pickup Date & Time:</span>
              <span class="value">${formatDateTime(booking.pickup_date)}</span>
            </div>
            <div class="row">
              <span class="label">Return Date & Time:</span>
              <span class="value">${formatDateTime(booking.return_date)}</span>
            </div>
            <div class="row">
              <span class="label">Number of Packs:</span>
              <span class="value">${booking.packs}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">PAYMENT INFORMATION</div>
            <div class="row">
              <span class="label">Total Price:</span>
              <span class="value">${formatPrice(booking.price)}</span>
            </div>
            <div class="row">
              <span class="label">Paid Amount:</span>
              <span class="value">${booking.paid_amount ? formatPrice(booking.paid_amount) : '₱0.00'}</span>
            </div>
            <div class="row">
              <span class="label">Balance:</span>
              <span class="value">${formatPrice(booking.price - (booking.paid_amount || 0))}</span>
            </div>
            <div class="row">
              <span class="label">Payment Status:</span>
              <span class="value">${booking.payment_status}</span>
            </div>
            <div class="row">
              <span class="label">Booking Status:</span>
              <span class="value">${booking.status}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Borak Travel Cebu Services!</p>
            <p>For inquiries, please contact us at work.boraktravel@gmail.com</p>
        
            <div style="text-align: center; margin-top: 30px;">
              <img src="/borak-signature.png" alt="Borak Travel Cebu Services Signature" style="height: 60px; width: auto; max-width: 200px;">
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const exportToCSV = () => {
    // Define CSV headers
    const headers = [
      'Booking ID',
      'Customer Name',
      'Customer Email',
      'Customer Mobile',
      'Customer ID',
      'First Name',
      'Middle Name',
      'Last Name',
      'Destination',
      'Pickup Location',
      'Pickup Date & Time',
      'Return Date & Time',
      'Number of Packs',
      'Total Price (₱)',
      'Paid Amount (₱)',
      'Balance (₱)',
      'Payment Status',
      'Booking Status',
      'Created Date',
      'Last Updated'
    ];

    // Convert bookings data to CSV format
    const csvData = filteredBookings.map(booking => [
      booking._id,
      booking.guest?.firstname && booking.guest?.lastname
        ? `${booking.guest.firstname} ${booking.guest.middlename ? booking.guest.middlename + ' ' : ''}${booking.guest.lastname}`
        : booking.guest?.username || `Guest ${booking.user_id.slice(-6)}`,
      booking.guest?.email || 'No email available',
      booking.guest?.mobile || 'No mobile available',
      booking.user_id,
      booking.guest?.firstname || '',
      booking.guest?.middlename || '',
      booking.guest?.lastname || '',
      booking.destination,
      booking.pickup_location,
      formatDateTime(booking.pickup_date),
      formatDateTime(booking.return_date),
      booking.packs,
      booking.price.toFixed(2),
      (booking.paid_amount || 0).toFixed(2),
      (booking.price - (booking.paid_amount || 0)).toFixed(2),
      booking.payment_status,
      booking.status,
      new Date(booking.created_at).toLocaleDateString(),
      new Date(booking.updated_at).toLocaleDateString()
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  //@ts-expect-error don't know how to fix this
  const handleEditFormChange = (field: string, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBooking = async () => {
    if (!selectedBooking) return;

    try {
      // Combine date and time for pickup and return
      const pickupDateTime = `${editFormData.pickup_date}T${editFormData.pickup_time}`;
      const returnDateTime = `${editFormData.return_date}T${editFormData.return_time}`;

      const updatedData = {
        pickup_date: pickupDateTime,
        return_date: returnDateTime,
        price: editFormData.price,
        paid_amount: editFormData.paid_amount,
        status: editFormData.status,
        payment_status: editFormData.payment_status
      };

      console.log('Updating booking with data:', updatedData);

      // Call API to update booking
      const response = await bookingsApi.updateBooking(selectedBooking._id, updatedData);
      console.log('Booking updated successfully:', response);

      alert('Booking updated successfully!');
      handleCloseEditModal();

      // Refresh the bookings list
      loadBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage and track all customer bookings
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            A list of all bookings with their current status and details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("VERIFIED")}>
                  Verified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("INPROGRESS")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("RENDERED")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("CANCELLED")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto w-full">
              <div className="min-w-[1500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      {/* <TableHead>Email</TableHead> */}
                      <TableHead>Destination</TableHead>
                      {/* <TableHead>Pickup Location</TableHead> */}
                      <TableHead>Pickup Date/Time</TableHead>
                      <TableHead>Return Date/Time</TableHead>
                      <TableHead>Packs</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell className="font-medium">
                            {booking.guest?.username || `Guest ${booking.user_id.slice(-6)}`}
                          </TableCell>
                          {/* <TableCell className="text-sm text-gray-600">
                          {booking.guest?.email || 'No email available'}
                        </TableCell> */}
                          <TableCell>{booking.destination}</TableCell>
                          {/* <TableCell>{booking.pickup_location}</TableCell> */}
                          <TableCell>
                            {booking.pickup_date ? formatDateTime(booking.pickup_date) : 'No date'}
                          </TableCell>
                          <TableCell>
                            {booking.return_date ? formatDateTime(booking.return_date) : 'No date'}
                          </TableCell>
                          <TableCell>{booking.packs}</TableCell>
                          <TableCell>{formatPrice(booking.price)}</TableCell>
                          <TableCell>{booking.paid_amount ? formatPrice(booking.paid_amount) : '₱0.00'}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                          <TableCell>
                            {new Date(booking.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendEmail(booking)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendSMS(booking)}>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Send SMS
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePrintReceipt(booking)}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Receipt
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleCancelBooking(booking)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBooking.guest?.firstname && selectedBooking.guest?.lastname
                        ? `${selectedBooking.guest.firstname} ${selectedBooking.guest.middlename ? selectedBooking.guest.middlename + ' ' : ''}${selectedBooking.guest.lastname}`
                        : selectedBooking.guest?.username || `Guest ${selectedBooking.user_id.slice(-6)}`
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.guest?.email || 'No email available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.guest?.mobile || 'No mobile number available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedBooking.user_id}</p>
                  </div>
                  {selectedBooking.guest?.username && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Usernane</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.guest.username}</p>
                    </div>
                  )}
                  {/* {selectedBooking.guest?.middlename && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.guest.middlename}</p>
                    </div>
                  )}
                  {selectedBooking.guest?.lastname && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.guest.lastname}</p>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedBooking._id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.destination}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.pickup_location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Packs</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.packs}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{formatPrice(selectedBooking.price)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedBooking.paid_amount ? formatPrice(selectedBooking.paid_amount) : '₱0.00'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Package ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedBooking.package_id}</p>
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Date Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Date & Time</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedBooking.pickup_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Return Date & Time</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedBooking.return_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedBooking.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedBooking.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Status</label>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <div className="mt-1">{getPaymentStatusBadge(selectedBooking.payment_status)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                onClick={() => handleEditBooking(selectedBooking)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Booking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Booking</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information (Read-only) */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.guest?.username || `Guest ${selectedBooking.user_id.slice(-6)}`}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.guest?.email || 'No email available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.destination}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.pickup_location}</p>
                  </div>
                </div>
              </div>

              {/* Editable Date & Time Fields */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Date & Time Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
                    <Input
                      type="date"
                      value={editFormData.pickup_date}
                      onChange={(e) => handleEditFormChange('pickup_date', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
                    <Input
                      type="time"
                      value={editFormData.pickup_time}
                      onChange={(e) => handleEditFormChange('pickup_time', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Return Date</label>
                    <Input
                      type="date"
                      value={editFormData.return_date}
                      onChange={(e) => handleEditFormChange('return_date', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Return Time</label>
                    <Input
                      type="time"
                      value={editFormData.return_time}
                      onChange={(e) => handleEditFormChange('return_time', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Price */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Price Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₱)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.price}
                      onChange={(e) => handleEditFormChange('price', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Paid Amount */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Paid Amount</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paid Amount (₱)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.paid_amount || ''}
                      onChange={(e) => handleEditFormChange('paid_amount', parseFloat(e.target.value) || null)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Status Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="INPROGRESS">In Progress</option>
                      <option value="RENDERED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <select
                      value={editFormData.payment_status}
                      onChange={(e) => handleEditFormChange('payment_status', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PARTIAL">Partial</option>
                      <option value="FULL">Paid</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseEditModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveBooking}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Booking Receipt</h2>
                <p className="text-sm text-gray-600">Receipt #{selectedBooking._id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={handleCloseReceiptModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">BORAK TRAVEL SERVICES</h1>
                  <h2 className="text-lg font-semibold text-gray-700 mb-1">BOOKING RECEIPT</h2>
                  <p className="text-sm text-gray-600">Receipt #{selectedBooking._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Customer Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Customer Name:</span>
                        <span className="text-gray-900"> {selectedBooking.guest?.firstname && selectedBooking.guest?.lastname
                          ? `${selectedBooking.guest.firstname} ${selectedBooking.guest.middlename ? selectedBooking.guest.middlename + ' ' : ''}${selectedBooking.guest.lastname}`
                          : selectedBooking.guest?.username || `Guest ${selectedBooking.user_id.slice(-6)}`
                        }</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="text-gray-900">{selectedBooking.guest?.email || 'No email available'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Customer ID:</span>
                        <span className="text-gray-900 font-mono text-sm">{selectedBooking.user_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Booking Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Booking ID:</span>
                        <span className="text-gray-900 font-mono text-sm">{selectedBooking._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Destination:</span>
                        <span className="text-gray-900">{selectedBooking.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Pickup Location:</span>
                        <span className="text-gray-900">{selectedBooking.pickup_location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Date Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Pickup Date & Time:</span>
                        <span className="text-gray-900">{formatDateTime(selectedBooking.pickup_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Return Date & Time:</span>
                        <span className="text-gray-900">{formatDateTime(selectedBooking.return_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Number of Packs:</span>
                        <span className="text-gray-900">{selectedBooking.packs}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Total Price:</span>
                        <span className="text-gray-900 font-semibold">{formatPrice(selectedBooking.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Paid Amount:</span>
                        <span className="text-gray-900">{selectedBooking.paid_amount ? formatPrice(selectedBooking.paid_amount) : '₱0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Balance:</span>
                        <span className="text-gray-900 font-semibold">{formatPrice(selectedBooking.price - (selectedBooking.paid_amount || 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Payment Status:</span>
                        <span className="text-gray-900">{getPaymentStatusBadge(selectedBooking.payment_status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Booking Status:</span>
                        <span className="text-gray-900">{getStatusBadge(selectedBooking.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-gray-300">
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src="/borak-signature.png"
                      alt="Borak Travel Cebu Services Signature"
                      className="h-16 w-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Thank you for choosing Borak Travel Cebu Services!</p>
                  <p className="text-sm text-gray-600 mb-2">For inquiries, please contact us at work.boraktravel@gmail.com</p>

                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseReceiptModal}
              >
                Close
              </Button>
              <Button
                onClick={handleSendReceiptEmail}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send to Email
              </Button>
              <Button
                onClick={handlePrintReceiptAction}
                className="bg-green-600 hover:bg-green-700"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
