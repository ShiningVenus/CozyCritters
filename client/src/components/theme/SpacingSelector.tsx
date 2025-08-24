import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpacingOption {
  label: string;
  value: string;
}

interface SpacingSelectorProps {
  id?: string;
  label: string;
  value: string;
  options: SpacingOption[];
  onChange: (value: string) => void;
  helpText?: string;
}

/**
 * SpacingSelector allows users to choose comfortable spacing levels
 * for better visual organization, especially helpful for ND users.
 */
export function SpacingSelector({
  id = "spacing-selector",
  label,
  value,
  options,
  onChange,
  helpText,
}: SpacingSelectorProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label} aria-describedby={helpId}>
          <SelectValue placeholder="Select spacing" />
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