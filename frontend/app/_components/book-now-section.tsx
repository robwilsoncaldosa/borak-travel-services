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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-8 shadow-xl">
            
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
              <Button type="submit" className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200">Submit</Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-12 text-center">
          <p className="text-white/80">
            Need help with your booking? Call us at <span className="font-semibold text-white">+63 912 345 6789</span> or email <span className="font-semibold text-white">bookings@borakvanrentals.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}