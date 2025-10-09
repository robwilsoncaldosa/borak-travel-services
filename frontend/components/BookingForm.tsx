import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookingData, bookingsApi } from "@/lib/backend_api/bookings";
import { packageApi } from "@/lib/backend_api/package";
import { guestApi } from "@/lib/backend_api/guest";

export interface BookingFormData {
  user_id: string | "";
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
  price: number;
  paid_amount: number | null;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  mobile?: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  userId: string;
  priceEditable?: boolean;
  onError?: () => void;
}

const mapToCamelCase = (data: BookingFormData): BookingData => ({
  user_id: data.user_id,
  package_id: data.package_id,
  destination: data.destination,
  pickup_location: data.pickup_location,
  pickup_date: data.pickup_date,
  pickup_time: data.pickup_time,
  return_date: data.return_date,
  return_time: data.return_time,
  status: data.status,
  payment_status: data.payment_status,
  packs: data.packs,
  price: data.price,
  paid_amount: data.paid_amount,
});

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  userId,
  priceEditable = false,
  onError,
}) => {
  const [form, setForm] = useState<BookingFormData>({
    user_id: userId,
    package_id: initialData.package_id || "",
    destination: initialData.destination || "",
    pickup_location: initialData.pickup_location || "",
    pickup_date: initialData.pickup_date || "",
    pickup_time: initialData.pickup_time || "",
    return_date: initialData.return_date || "",
    return_time: initialData.return_time || "",
    status: "PENDING",
    payment_status: "PENDING",
    packs: initialData.packs || 1,
    price: initialData.price ?? 0,
    paid_amount: initialData.paid_amount ?? null,
    firstname: initialData.firstname || "",
    middlename: initialData.middlename || "",
    lastname: initialData.lastname || "",
    mobile: initialData.mobile || "",
  });

  const [isOther, setIsOther] = useState<boolean>(false);
  const [customPackageTitle, setCustomPackageTitle] = useState<string>("");

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, user_id: userId }));
    console.log('[BookingForm] user_id updated:', userId);
  }, [userId]);

  React.useEffect(() => {
    console.log('[BookingForm] Initial user_id:', form.user_id, 'Initial package_id:', form.package_id);
  }, []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [packages, setPackages] = useState<{ id: string; title: string; location: string }[]>([]);

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
      if (value === "OTHERS") {
        setIsOther(true);
        setForm((prev) => ({ ...prev, package_id: "", destination: "" }));
      } else {
        const selectedPackage = packages.find((pkg) => pkg.id === value);
        setIsOther(false);
        setCustomPackageTitle("");
        setForm((prev) => ({
          ...prev,
          package_id: value,
          destination: selectedPackage ? selectedPackage.location : "",
        }));
      }
      console.log('[BookingForm] Package selected:', value, 'Current user_id:', form.user_id);
    } else if (name === "mobile") {
      // Format mobile number as user types
      const cleanValue = value.replace(/\D/g, ''); // Remove non-digits
      let formattedValue = cleanValue;

      // Format as Philippine mobile number (e.g., 0917 123 4567)
      if (cleanValue.length > 0) {
        if (cleanValue.length <= 4) {
          formattedValue = cleanValue;
        } else if (cleanValue.length <= 7) {
          formattedValue = `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`;
        } else {
          formattedValue = `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 7)} ${cleanValue.slice(7, 11)}`;
        }
      }

      setForm((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "customPackageTitle") {
      setCustomPackageTitle(value);
    } else {
      setForm((prev) => ({ ...prev, [name]: name === "packs" || name === "price" ? Number(value) : value }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.user_id) newErrors.user_id = "User ID is required";
    if (!isOther && !form.package_id) newErrors.package_id = "Package is required";
    if (isOther && !customPackageTitle.trim()) newErrors.package_id = "Package title is required";
    if (!form.destination) newErrors.destination = "Destination is required";
    if (!form.pickup_location) newErrors.pickup_location = "Pickup location is required";
    if (!form.pickup_date) newErrors.pickup_date = "Pickup date is required";
    if (!form.pickup_time) newErrors.pickup_time = "Pickup time is required";
    if (!form.return_date) newErrors.return_date = "Return date is required";
    if (!form.return_time) newErrors.return_time = "Return time is required";

    if (!form.firstname) newErrors.firstname = "Firt name is required";
    if (!form.lastname) newErrors.lastname = "Last name is required";
    if (!form.mobile) newErrors.mobile = "Mobile is required";
    if (form.packs < 1) newErrors.packs = "Number of packs must be at least 1";
    if (form.price < 0) newErrors.price = "Price cannot be negative";

    // Mobile number validation
    if (form.mobile && form.mobile.trim() !== "") {
      // Remove all non-digit characters for validation
      const cleanMobile = form.mobile.replace(/\D/g, '');

      // Check if it's a valid Philippine mobile number
      if (cleanMobile.length < 10 || cleanMobile.length > 11) {
        newErrors.mobile = "Mobile number must be 10-11 digits";
      } else if (!cleanMobile.startsWith('9')) {
        newErrors.mobile = "Mobile number must start with 9";
      } else if (!/^9\d{9,10}$/.test(cleanMobile)) {
        newErrors.mobile = "Please enter a valid Philippine mobile number";
      }
    }

    // Date and time validation
    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

    if (form.pickup_date && form.pickup_time) {
      const pickupDateTime = `${form.pickup_date}T${form.pickup_time}`;
      if (pickupDateTime < currentDateTime) {
        newErrors.pickup_date = "Pickup date and time cannot be earlier than current date and time";
      }
    }

    if (form.return_date && form.return_time && form.pickup_date && form.pickup_time) {
      const pickupDateTime = `${form.pickup_date}T${form.pickup_time}`;
      const returnDateTime = `${form.return_date}T${form.return_time}`;
      if (returnDateTime <= pickupDateTime) {
        newErrors.return_date = "Return date and time must be later than pickup date and time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitForm = { ...form, user_id: userId };
    if (validate()) {
      try {
        // Update guest user with personal information if provided
        if (form.firstname || form.middlename || form.lastname || form.mobile) {
          try {
            const guestData = {
              firstname: form.firstname,
              middlename: form.middlename,
              lastname: form.lastname,
              mobile: form.mobile
            };

            // Update the existing guest user using their ID
            await guestApi.updateGuest(userId, guestData);
            console.log("Guest user updated with personal information");
          } catch (guestError) {
            console.error("Failed to update guest user:", guestError);
            // Continue with booking creation even if guest update fails
          }
        }

        // If "Others" selected, create the package first
        if (isOther) {
          const safeDestination = submitForm.destination?.trim() ? submitForm.destination : customPackageTitle;
          const newPackage = await packageApi.createPackage({
            title: customPackageTitle.trim(),
            location: safeDestination || "",
            duration_hours: 0,
            about_tour: "",
            highlights: [],
            activities: [],
            inclusions: [],
            images: [],
          });
          submitForm.package_id = newPackage._id;
          // Ensure destination is set if it was empty
          if (!submitForm.destination) {
            submitForm.destination = newPackage.location || newPackage.title;
          }
        }

        const payload = mapToCamelCase(submitForm);
        console.log("Payload being sent:", payload);
        const response = await bookingsApi.createBooking(payload);
        console.log("Booking created successfully:", response);


        onSubmit(submitForm);
      } catch (error) {
        console.error("Failed to create booking:", error);

        // Update modal state for error
        onError?.();
      }
    }
  };

  return (
    <>

      {/* Booking Form */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Booking Form</h2>
          <p className="text-sm text-gray-600 mt-1">Please fill out the details below to complete your booking.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4" id="booking-form">
            {/* Package Selection */}
            <div>
              <Label htmlFor="package_id">Package</Label>
              <select
                id="package_id"
                name="package_id"
                value={isOther ? "OTHERS" : form.package_id}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
               <option value="OTHERS">Others</option>
               
              </select>
              {isOther && (
                <div className="mt-2">
                  <Label htmlFor="customPackageTitle">Preferred Spot Name</Label>
                  <Input
                    id="customPackageTitle"
                    name="customPackageTitle"
                    value={customPackageTitle}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>
              )}
              {errors.package_id && <span className="text-red-500 text-xs">{errors.package_id}</span>}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.firstname && <span className="text-red-500 text-xs">{errors.firstname}</span>}
              </div>
              <div>
                <Label htmlFor="middlename">Middle Name</Label>
                <Input
                  id="middlename"
                  name="middlename"
                  value={form.middlename}
                  onChange={handleChange}
                  placeholder="Optional"
                />
                {errors.middlename && <span className="text-red-500 text-xs">{errors.middlename}</span>}
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder=""
                />
                {errors.lastname && <span className="text-red-500 text-xs">{errors.lastname}</span>}
              </div>
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder=""
                type="tel"
                maxLength={13}
              />
              <p className="text-xs text-gray-500 mt-1">Format: 0917 123 4567 (Philippine mobile number)</p>
              {errors.mobile && <span className="text-red-500 text-xs">{errors.mobile}</span>}
            </div>

            {/* Destination */}
            <div>
              <Label htmlFor="destination">Destination Location</Label>
              <Input
                id="destination"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                readOnly={!isOther}
                className={isOther ? "" : "bg-gray-100 cursor-not-allowed"}
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
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.pickup_date && <span className="text-red-500 text-xs">{errors.pickup_date}</span>}
            </div>

            <div>
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                name="pickup_time"
                type="time"
                value={form.pickup_time}
                onChange={handleChange}
              />
              {errors.pickup_time && <span className="text-red-500 text-xs">{errors.pickup_time}</span>}
            </div>

            <div>
              <Label htmlFor="return_date">Return Date</Label>
              <Input
                id="return_date"
                name="return_date"
                type="date"
                value={form.return_date}
                onChange={handleChange}
                min={form.pickup_date || new Date().toISOString().split('T')[0]}
              />
              {errors.return_date && <span className="text-red-500 text-xs">{errors.return_date}</span>}
            </div>

            <div>
              <Label htmlFor="return_time">Return Time</Label>
              <Input
                id="return_time"
                name="return_time"
                type="time"
                value={form.return_time}
                onChange={handleChange}
              />
              {errors.return_time && <span className="text-red-500 text-xs">{errors.return_time}</span>}
            </div>

            {/* Price Field */}
            <div>
              <Label htmlFor="price">Price (₱)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                value={form.price}
                onChange={handleChange}
                readOnly={!priceEditable}
                disabled={!priceEditable}
                className={priceEditable ? "" : "bg-gray-100 cursor-not-allowed"}
              />
              {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
            </div>

            {/* Paid Amount Field */}
            <div>
              <Label htmlFor="paid_amount">Paid Amount (₱)</Label>
              <Input
                id="paid_amount"
                name="paid_amount"
                type="number"
                min={0}
                value={form.paid_amount || ''}
                onChange={handleChange}
                readOnly={!priceEditable}
                disabled={!priceEditable}
                className={priceEditable ? "" : "bg-gray-100 cursor-not-allowed"}
                placeholder=""
              />
              {errors.paid_amount && <span className="text-red-500 text-xs">{errors.paid_amount}</span>}
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

          </form>
        </div>

        {/* Sticky Footer with Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <Button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
              Cancel
            </Button>
            <Button type="submit" form="booking-form" className="bg-blue-500 text-white hover:bg-blue-600">
              Submit Booking
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};