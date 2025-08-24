import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSizeOption {
  label: string;
  value: string;
}

interface FontSizeSelectorProps {
  id?: string;
  label: string;
  value: string;
  options: FontSizeOption[];
  onChange: (value: string) => void;
  helpText?: string;
}

/**
 * FontSizeSelector allows users to choose comfortable font sizes
 * for better readability, especially important for ND users.
 */
export function FontSizeSelector({
  id = "font-size-selector",
  label,
  value,
  options,
  onChange,
  helpText,
}: FontSizeSelectorProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label} aria-describedby={helpId}>
          <SelectValue placeholder="Select font size" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helpText && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}