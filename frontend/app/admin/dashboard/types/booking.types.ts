
export interface BookingData {
  user_id: string;
  package_id: string;
  destination: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
  status: string;
  payment_status: string;
  packs: number;
  price: number | null;
  paid_amount: number | null;
}