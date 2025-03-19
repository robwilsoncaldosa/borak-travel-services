import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Popular countries to show initially for better performance
const POPULAR_COUNTRIES = ["US", "GB", "CA", "AU", "PH", "IN", "CN", "JP", "KR", "SG"];

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn("rounded-e-lg rounded-s-none h-12 text-base", className)}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [visibleCountries, setVisibleCountries] = React.useState<CountryEntry[]>([]);
  
  // Initialize with popular countries only
  React.useEffect(() => {
    if (!open) return;
    
    // If there's a search query, filter countries based on it
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      const filtered = countryList.filter(({ label, value }) => 
        label?.toLowerCase().includes(searchLower) ||
        value?.toLowerCase().includes(searchLower)
      );
      
      // Always include the selected country in results if it exists
      if (selectedCountry && !filtered.some(entry => entry.value === selectedCountry)) {
        const selectedEntry = countryList.find(entry => entry.value === selectedCountry);
        if (selectedEntry) {
          filtered.unshift(selectedEntry);
        }
      }
      
      setVisibleCountries(filtered.slice(0, 50)); // Increased limit for better search results
    } else {
      // Otherwise show popular countries first, then add the selected country if not already included
      const popular = countryList.filter(({ value }) => 
        value && POPULAR_COUNTRIES.includes(value)
      );
      
      // Add selected country if not in popular list
      if (selectedCountry && !popular.some(entry => entry.value === selectedCountry)) {
        const selectedEntry = countryList.find(entry => entry.value === selectedCountry);
        if (selectedEntry) {
          popular.unshift(selectedEntry);
        }
      }
      
      setVisibleCountries(popular);
    }
  }, [countryList, searchQuery, open, selectedCountry]);

  // Handle search input changes with debounce
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10 h-12"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-mr-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start" sideOffset={5}>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search country..." 
            value={searchQuery}
            onValueChange={handleSearchChange}
            autoFocus
            className="h-12 text-base"
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {visibleCountries.map(({ value, label }) =>
                  value ? (
                    <CommandItem 
                      key={value} 
                      className="gap-2 h-12 text-base" 
                      onSelect={() => {
                        onChange(value);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <FlagComponent country={value} countryName={label} />
                      <span className="flex-1 text-sm">{label}</span>
                      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(value)}`}</span>
                      <CheckIcon
                        className={`ml-auto size-4 ${value === selectedCountry ? "opacity-100" : "opacity-0"}`}
                      />
                    </CommandItem>
                  ) : null,
                )}
                {searchQuery && visibleCountries.length >= 50 && (
                  <div className="py-2 px-4 text-xs text-muted-foreground">
                    Showing first 50 results. Refine your search for more.
                  </div>
                )}
                {!searchQuery && visibleCountries.length < countryList.length && (
                  <div className="py-2 px-4 text-xs text-muted-foreground">
                    Showing popular countries. Type to search more.
                  </div>
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Memoize the flag component to prevent unnecessary re-renders
const FlagComponent = React.memo(({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
});
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
