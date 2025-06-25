import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModalMessagePrompt } from "@/components/ui/modalMessagePrompt"; 
import { BookingData, bookingsApi } from "@/lib/backend_api/bookings";
import { packageApi } from "@/lib/backend_api/package";

export interface BookingFormData {
  user_id: string | "";
  package_id: string;
  destination: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  status: string;
  payment_status: string;
  packs: number;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  userId: string;
}

const mapToCamelCase = (data: BookingFormData): BookingData => ({
  user_id: data.user_id,
  package_id: data.package_id,
  destination: data.destination,
  pickup_location: data.pickup_location,
  pickup_date: data.pickup_date,
  return_date: data.return_date,
  status: data.status,
  payment_status: data.payment_status,
  packs: data.packs,
});

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  userId,
}) => {
  const [form, setForm] = useState<BookingFormData>({
    user_id: userId,
    package_id: initialData.package_id || "",
    destination: initialData.destination || "",
    pickup_location: initialData.pickup_location || "",
    pickup_date: initialData.pickup_date || "",
    return_date: initialData.return_date || "",
    status: "PENDING",
    payment_status: "PENDING",
    packs: initialData.packs || 1,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [packages, setPackages] = useState<{ id: string; title: string; location: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [modalType, setModalType] = useState<"success" | "error">("success"); // State for modal type
  const [modalMessage, setModalMessage] = useState<string>(""); // State for modal message

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await packageApi.getAllPackages();
        setPackages(response.map((pkg) => ({ id: pkg._id, title: pkg.title, location: pkg.location })));
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "package_id") {
      const selectedPackage = packages.find((pkg) => pkg.id === value);
      setForm((prev) => ({
        ...prev,
        package_id: value,
        destination: selectedPackage ? selectedPackage.location : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: name === "packs" ? Number(value) : value }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.package_id) newErrors.package_id = "Package is required";
    if (!form.destination) newErrors.destination = "Destination is required";
    if (!form.pickup_location) newErrors.pickup_location = "Pickup location is required";
    if (!form.pickup_date) newErrors.pickup_date = "Pickup date is required";
    if (!form.return_date) newErrors.return_date = "Return date is required";
    if (form.packs < 1) newErrors.packs = "Number of packs must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const payload = mapToCamelCase(form); // Convert to camelCase
        console.log("Payload being sent:", payload); // Log the payload
        const response = await bookingsApi.createBooking(payload);
        console.log("Booking created successfully:", response);
  
        // Update modal state
        setModalType("success");
        setModalMessage("Your booking has been submitted successfully.");
        setIsModalOpen(true); // Open the modal
  
        onSubmit(form); // Pass the original form data to the callback
      } catch (error) {
        console.error("Failed to create booking:", error);
  
        // Update modal state for error
        setModalType("error");
        setModalMessage("Failed to submit your booking. Please try again.");
        setIsModalOpen(true); // Open the modal
      }
    }
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
  <ModalMessagePrompt
    type={modalType}
    message={modalMessage}
    onClose={() => setIsModalOpen(false)}
  />
)}

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">Booking Form</h2>
        <p className="text-sm text-gray-600">Please fill out the details below to complete your booking.</p>

        {/* Package Selection */}
        <div>
          <Label htmlFor="package_id">Package</Label>
          <select
            id="package_id"
            name="package_id"
            value={form.package_id}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Select package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title}
              </option>
            ))}
          </select>
          {errors.package_id && <span className="text-red-500 text-xs">{errors.package_id}</span>}
        </div>

        {/* Destination */}
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
          {errors.destination && <span className="text-red-500 text-xs">{errors.destination}</span>}
        </div>

        {/* Pickup Location */}
        <div>
          <Label htmlFor="pickup_location">Pickup Location</Label>
          <Input id="pickup_location" name="pickup_location" value={form.pickup_location} onChange={handleChange} />
          {errors.pickup_location && <span className="text-red-500 text-xs">{errors.pickup_location}</span>}
        </div>

        <div>
          <Label htmlFor="pickup_date">Pickup Date</Label>
          <Input
            id="pickup_date"
            name="pickup_date"
            type="date"
            value={form.pickup_date}
            onChange={handleChange}
          />
          {errors.pickup_date && <span className="text-red-500 text-xs">{errors.pickup_date}</span>}
        </div>

        <div>
          <Label htmlFor="return_date">Return Date</Label>
          <Input
            id="return_date"
            name="return_date"
            type="date"
            value={form.return_date}
            onChange={handleChange}
          />
          {errors.return_date && <span className="text-red-500 text-xs">{errors.return_date}</span>}
        </div>

        <div>
          <Label htmlFor="packs">Number of Packs</Label>
          <Input
            id="packs"
            name="packs"
            type="number"
            min={1}
            value={form.packs}
            onChange={handleChange}
          />
          {errors.packs && <span className="text-red-500 text-xs">{errors.packs}</span>}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <Button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
            Submit Booking
          </Button>
        </div>
      </form>
    </>
  );
};