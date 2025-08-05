"use client"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Textarea
} from "@/components/ui/textarea"
import Contact from "@/components/ui/homecontact"

const formSchema = z.object({
  "first-name": z.string().min(1),
  "last-name": z.string().min(1),
  email: z.string(),
  message: z.string()
});

export default function BookNowSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="relative w-full py-16 bg-[url('/contactbg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mt-2">Contact Us</h2>
          <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
            Ready to explore Cebu? Fill out the form below to book your van rental and experience the beauty of the Philippines with our professional service.
          </p>
        </div>
        <Contact/>
        
        <div className="mt-12 text-center">
          <p className="text-white/80">
            Need help with your booking? Call us at <span className="font-semibold text-white">+63 912 345 6789</span> or email <span className="font-semibold text-white">bookings@borakvanrentals.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}