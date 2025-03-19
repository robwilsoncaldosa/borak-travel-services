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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  PhoneInput
} from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Textarea
} from "@/components/ui/textarea"

const formSchema = z.object({
  "first-name": z.string().min(1),
  "last-name": z.string().min(1),
  name_6807074546: z.string(),
  email: z.string(),
  nationality: z.string(),
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
    <div className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-neutral-600 dark:text-neutral-300 text-lg">Contact Us</p>
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-2">Book Now</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-4 max-w-2xl mx-auto">
            Ready to explore Cebu? Fill out the form below to book your van rental and experience the beauty of the Philippines with our professional service.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10  dark:bg-gray-900 rounded-xl p-8 ">
            
            <div className="grid grid-cols-12 gap-4">
              
              <div className="col-span-12 md:col-span-6">
                
            <FormField
              control={form.control}
              name="first-name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">First Name</FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="Enter your first name..."
                    className="h-12 text-base px-4"
                    type="text"
                    {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                
            <FormField
              control={form.control}
              name="last-name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="Enter your last name..."
                    className="h-12 text-base px-4"
                    type="text"
                    {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
              
            </div>
            
              <FormField
                control={form.control}
                name="name_6807074546"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-base">Phone Number (Choose Your Country Code)</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="Enter your phone number"
                        className="h-12 text-base"
                        {...field}
                        defaultCountry="PH"
                        international
                      />
                    </FormControl>
                  <FormDescription className="text-sm">Enter your phone number with country code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="Enter your email address..."
                    className="h-12 text-base px-4"
                    type="email"
                    {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nationality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Filipino">Filipino</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                    
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message..."
                      className="resize-none text-base px-4 py-3 min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="px-10 py-7 text-lg font-medium">Book Now</Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-12 text-center">
          <p className="text-neutral-600 dark:text-neutral-300">
            Need help with your booking? Call us at <span className="font-semibold">+63 912 345 6789</span> or email <span className="font-semibold">bookings@borakvanrentals.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}