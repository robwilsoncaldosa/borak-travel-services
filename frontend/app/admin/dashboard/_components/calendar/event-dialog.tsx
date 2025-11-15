import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Edit2, Trash2, MapPin, User, Mail, Calendar, Clock, DollarSign } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
              {event.isBooking ? (
                <>
                  <Calendar className="w-5 h-5 text-primary" />
                  Booking Details
                </>
              ) : (
                event.title
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {event.isBooking ? (
              <BookingDetails event={event} />
            ) : (
              <EventDetails event={event} />
            )}
          </div>
        </div>

        <Separator />

        <DialogFooter className="p-6 pt-4">
          <ActionButtons 
            isBooking={event.isBooking} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BookingDetails({ event }: { event: MyEvent }) {
  return (
    <div className="space-y-6">
      <StatusSection event={event} />
      <CustomerSection event={event} />
      <LocationSection event={event} />
      <TravelDatesSection event={event} />
      <PricingSection event={event} />
    </div>
  );
}

function EventDetails({ event }: { event: MyEvent }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-sm text-foreground">
            <p>{format(event.start, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-muted-foreground">
              {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
            </p>
          </div>
        </div>
      </div>

      {event.location && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Location</p>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-foreground">{event.location}</p>
          </div>
        </div>
      )}

      {event.description && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
        </div>
      )}
    </div>
  );
}

function StatusSection({ event }: { event: MyEvent }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
          {event.status}
        </Badge>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment</p>
        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-50 text-emerald-700">
          {event.paymentStatus}
        </Badge>
      </div>
    </div>
  );
}

function CustomerSection({ event }: { event: MyEvent }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{event.customerName}</span>
        </div>
        {event.customerEmail && (
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{event.customerEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LocationSection({ event }: { event: MyEvent }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{event.destination}</p>
            <p className="text-xs text-muted-foreground">Destination</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{event.pickupLocation}</p>
            <p className="text-xs text-muted-foreground">Pickup Location</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TravelDatesSection({ event }: { event: MyEvent }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Travel Dates</p>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{format(event.start, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-xs text-muted-foreground">Pickup: {format(event.start, 'h:mm a')}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{format(event.end, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-xs text-muted-foreground">Return: {format(event.end, 'h:mm a')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingSection({ event }: { event: MyEvent }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pricing</p>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Packs</p>
            <p className="text-sm font-medium text-foreground">{event.packs}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground">Total Price</p>
            <p className="text-lg font-semibold text-foreground">₱{event.price?.toLocaleString()}</p>
          </div>
        </div>
        
        {event.paidAmount !== null && event.paidAmount !== undefined && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Paid Amount</p>
                <p className="text-sm font-medium text-emerald-700">₱{event.paidAmount.toLocaleString()}</p>
              </div>
              {event.price && (
                <div className="space-y-1 text-right">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="text-sm font-medium text-foreground">
                    ₱{(event.price - event.paidAmount).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButtons({ isBooking, onEdit, onDelete }: { 
  isBooking?: boolean; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  if (isBooking) {
    return (
      <p className="text-xs text-muted-foreground text-center w-full">
        To edit this booking, use the Bookings page
      </p>
    );
  }

  return (
    <div className="flex gap-3 w-full">
      <Button
        variant="outline"
        onClick={onEdit}
        className="flex-1"
      >
        <Edit2 className="w-4 h-4 mr-2" />
        Edit
      </Button>
      <Button
        variant="destructive"
        onClick={onDelete}
        className="flex-1"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}
