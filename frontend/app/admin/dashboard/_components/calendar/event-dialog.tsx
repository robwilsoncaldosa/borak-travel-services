import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Edit2, Trash2, MapPin, User, Mail, Calendar, DollarSign } from "lucide-react";
import { MyEvent } from "../../types/calendar";

interface EventDialogProps {
  event: MyEvent | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDialog({
  event,
  open,
  onClose,
  onEdit,
  onDelete,
}: EventDialogProps) {
  if (!event) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'VERIFIED': return 'bg-green-500';
      case 'INPROGRESS': return 'bg-blue-500';
      case 'RENDERED': return 'bg-gray-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'FULL': return 'bg-green-500';
      case 'PARTIAL': return 'bg-yellow-500';
      case 'PENDING': return 'bg-orange-500';
      case 'REFUNDED': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {event.isBooking ? (
              <>
                <Calendar className="w-5 h-5" />
                Booking Details
              </>
            ) : (
              event.title
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {event.isBooking ? (
            // Booking-specific details
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={`${getStatusColor(event.status)} text-white`}>
                    {event.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment</p>
                  <Badge className={`${getPaymentStatusColor(event.paymentStatus)} text-white`}>
                    {event.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Customer
                </p>
                <p className="text-sm font-medium">{event.customerName}</p>
                {event.customerEmail && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {event.customerEmail}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Destination
                </p>
                <p className="text-sm">{event.destination}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Pickup Location</p>
                <p className="text-sm">{event.pickupLocation}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Travel Dates</p>
                <p className="text-sm">
                  <strong>Pickup:</strong> {format(event.start, 'PPP p')}
                  <br />
                  <strong>Return:</strong> {format(event.end, 'PPP p')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Packs</p>
                  <p className="text-sm">{event.packs}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Price
                  </p>
                  <p className="text-sm">₱{event.price?.toLocaleString()}</p>
                </div>
              </div>

              {event.paidAmount !== null && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Paid Amount</p>
                  <p className="text-sm">₱{event.paidAmount?.toLocaleString()}</p>
                  {event.price && event.paidAmount !== null && (
                    <p className="text-xs text-gray-500">
                      Balance: ₱{(event.price && event.paidAmount !== undefined ? (event.price - event.paidAmount).toLocaleString() : 0)}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            // Regular event details
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-sm">
                  {format(event.start, 'PPPP')}
                  <br />
                  {format(event.start, 'p')} - {format(event.end, 'p')}
                </p>
              </div>
              {event.location && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm">{event.location}</p>
                </div>
              )}
              {event.description && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm">{event.description}</p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="mt-6">
          <div className="flex space-x-2">
            {event.isBooking ? (
              <p className="text-sm text-gray-500 flex-1">
                To edit this booking, use the Bookings page
              </p>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
