"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Input
} from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Package } from '@/lib/backend_api/package';
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  guests: z.number().min(1, "At least 1 guest required").max(20, "Maximum 20 guests allowed"),
});

export interface BookingCardProps {
    packageData: Package;
    openChatbot: () => void; // Add this prop
}

export const BookingCard = ({ packageData, openChatbot }: BookingCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
      guests: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Here you would handle the booking request
    openChatbot(); // Open the chatbot after successful validation
  };

  return (
    <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        
        {/* Price section */}
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">Contact for price</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Custom pricing based on group size</div>
        </div>
        
        {/* Booking form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date Range Picker */}
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full border border-gray-300 rounded-md p-8 justify-between text-left font-normal hover:border-blue-500 transition-colors",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">Check-in</span>
                            {field.value?.from ? (
                              field.value.to ? (
                                <span className="text-gray-700">
                                  {format(field.value.from, "MMM d, yyyy")} - {format(field.value.to, "MMM d, yyyy")}
                                </span>
                              ) : (
                                <span className="text-gray-700">{format(field.value.from, "MMM d, yyyy")}</span>
                              )
                            ) : (
                              <span className="text-gray-700">Add date</span>
                            )}
                          </div>
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Guests Input */}
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="border border-gray-300 rounded-md p-3 flex justify-between items-center hover:border-blue-500 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Guests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => field.value > 1 && form.setValue('guests', field.value - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="text"
                          className="px-2 w-10 text-center h-8"
                          readOnly
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1 && value <= 20) {
                              field.onChange(value);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => field.value < 20 && form.setValue('guests', field.value + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Booking button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-blue-700 flex items-center justify-center"
            >
              Contact for Booking
            </Button>
          </form>
        </Form>
        
        {/* No charge yet note */}
        <div className="text-center text-sm text-gray-500 mt-4">
            You won&apos;t be charged yet
        </div>

        
        {/* Package highlights */}
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Package highlights:</h3>
            <ul className="space-y-3">
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Duration: {packageData.duration_hours || 6} hours</span>
                </li>
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Live tour guide included</span>
                </li>
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Hotel pickup included</span>
                </li>
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Free cancellation available</span>
                </li>
            </ul>
        </div>
    </div>
  );
};