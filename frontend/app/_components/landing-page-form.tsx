"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  Location: z.string(),
  Tour_Location: z.string(),
  How_Many_Are_You: z.number(),
});

export default function LandingPageForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="Location"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex items-center w-full">
                        <MapPin className="mr-2 h-4 w-4 shrink-0" />
                        <SelectValue placeholder="Where are you located?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mactan_airport">Mactan-Cebu International Airport</SelectItem>
                      <SelectItem value="cebu_port">Cebu International Port</SelectItem>
                      <SelectItem value="pier1">Cebu Pier 1</SelectItem>
                      <SelectItem value="pier2">Cebu Pier 2</SelectItem>
                      <SelectItem value="pier3">Cebu Pier 3</SelectItem>
                      <SelectItem value="pier4">Cebu Pier 4</SelectItem>
                      <SelectItem value="sm_cebu">SM City Cebu</SelectItem>
                      <SelectItem value="ayala_cebu">Ayala Center Cebu</SelectItem>
                      <SelectItem value="it_park">Cebu IT Park</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="Tour_Location"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex items-center w-full">
                        <Image alt="car" src={"/car.png"} width={30} height={25}/>
                        <SelectValue placeholder="Where are you gonna tour" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="oslob">Oslob Whale Shark Watching</SelectItem>
                      <SelectItem value="kawasan">Kawasan Falls</SelectItem>
                      <SelectItem value="magellan">Magellan&apos;s Cross</SelectItem>
                      <SelectItem value="taoist">Cebu Taoist Temple</SelectItem>
                      <SelectItem value="tops">Tops Lookout</SelectItem>
                      <SelectItem value="temple_of_leah">Temple of Leah</SelectItem>
                      <SelectItem value="sirao">Sirao Flower Garden</SelectItem>
                      <SelectItem value="simala">Simala Shrine</SelectItem>
                      <SelectItem value="moalboal">Moalboal Sardine Run</SelectItem>
                      <SelectItem value="bantayan">Bantayan Island</SelectItem>
                      <SelectItem value="malapascua">Malapascua Island</SelectItem>
                      <SelectItem value="badian">Badian Canyoneering</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="How_Many_Are_You"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center relative">
                      <Users className="absolute left-3 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="How many are you?"
                        type="number"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormItem>
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </FormItem>
          </div>
        </div>
      </form>
    </Form>
  );
}
