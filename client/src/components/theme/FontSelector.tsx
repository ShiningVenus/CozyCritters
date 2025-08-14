import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontOption {
  label: string;
  value: string;
}

interface FontSelectorProps {
  id?: string;
  label: string;
  value: string;
  options: FontOption[];
  onChange: (value: string) => void;
  helpText?: string;
}

/**
 * FontSelector renders a list of font options. The optional `helpText`
 * is read by screen readers and presented visually to provide clear
 * direction for neurodivergent users.
 */
export function FontSelector({
  id = "font-selector",
  label,
  value,
  options,
  onChange,
  helpText,
}: FontSelectorProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label} aria-describedby={helpId}>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {options.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
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

