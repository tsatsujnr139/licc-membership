import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Option {
  value: string;
  label: string;
}

interface ResponsiveOptionGroupProps {
  idPrefix: string;
  onValueChange: (value: string) => void;
  options: readonly Option[];
  value: string;
}

export const ResponsiveOptionGroup = ({
  idPrefix,
  onValueChange,
  options,
  value,
}: ResponsiveOptionGroupProps) => (
  <>
    <RadioGroup
      className="flex flex-col gap-3 sm:hidden"
      onValueChange={onValueChange}
      value={value}
    >
      {options.map((option, index) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroupItem id={`${idPrefix}-${index}`} value={option.value} />
          <Label htmlFor={`${idPrefix}-${index}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
    <ToggleGroup
      className="hidden w-full sm:flex"
      onValueChange={onValueChange}
      type="single"
      value={value}
      variant="outline"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          className="flex-1"
          value={option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </>
);
