import { CheckIcon, ChevronsUpDown } from "lucide-react";
import type * as React from "react";
import { useMemo } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<
    RPNInput.Props<typeof RPNInput.default>,
    "onChange" | "inputComponent"
  > & {
    onChange?: (value: RPNInput.Value) => void;
    inputClassName?: string;
    countryClassName?: string;
  };

const createForwardedInputComponent = (inputClassName?: string) => {
  const Comp = ({ ...inputProps }: React.ComponentProps<"input">) => (
    <InputComponent {...inputProps} className={inputClassName} />
  );
  Comp.displayName = "PhoneInput.InputComponent";
  return Comp;
};

const createForwardedCountrySelect = (countryClassName?: string) => {
  const Comp = ({ ...props }: React.ComponentProps<typeof CountrySelect>) => (
    <CountrySelect {...props} className={countryClassName} />
  );
  Comp.displayName = "PhoneInput.CountrySelect";
  return Comp;
};

function PhoneInput({
  className,
  inputClassName,
  countryClassName,
  onChange,
  ...props
}: PhoneInputProps) {
  const MemoizedCountrySelect = useMemo(
    () => createForwardedCountrySelect(countryClassName),
    [countryClassName]
  );
  const MemoizedInputComponent = useMemo(
    () => createForwardedInputComponent(inputClassName),
    [inputClassName]
  );
  return (
    <RPNInput.default
      autoComplete="tel"
      className={cn("flex h-9", className)}
      countrySelectComponent={MemoizedCountrySelect}
      data-slot="phone-input"
      flagComponent={FlagComponent}
      inputComponent={MemoizedInputComponent}
      onChange={(value) => onChange?.(value ?? ("" as RPNInput.Value))}
      smartCaret={false}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered. To prevent this,
       * the value is coerced to an empty string.
       *
       * @param {E164Number | undefined} value - The entered value
       */
      type="tel"
      {...props}
    />
  );
}
PhoneInput.displayName = "PhoneInput";

function InputComponent({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      className={cn("rounded-s-none rounded-e-lg", className)}
      {...props}
    />
  );
}

interface CountryEntry {
  label: string;
  value: RPNInput.Country | undefined;
}

interface CountrySelectProps {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
  className?: string;
}

function CountrySelect({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
  className,
  ...rest
}: CountrySelectProps) {
  // biome-ignore lint/suspicious/noExplicitAny: library code
  const { iconComponent: _, ...buttonProps } = rest as any;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "corner-superellipse/1.2 flex h-9 items-center gap-1 rounded-s-lg rounded-e-none border-r-0 px-2 focus:z-10",
            className
          )}
          data-slot="phone-input-country-select"
          disabled={disabled}
          type="button"
          variant="outline"
          {...buttonProps}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "size-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-75 p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      country={value}
                      countryName={label}
                      key={value}
                      onChange={onChange}
                      selectedCountry={selectedCountry}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
CountrySelect.displayName = "CountrySelect";

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => (
  <CommandItem className="gap-2" onSelect={() => onChange(country)}>
    <FlagComponent country={country} countryName={countryName} />
    <span className="flex-1 text-sm">{countryName}</span>
    <span className="text-muted-foreground text-sm">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
    <CheckIcon
      className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
    />
  </CommandItem>
);

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex size-4 items-center justify-center overflow-hidden [&_svg]:size-4! [&_svg]:shrink-0">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
