import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
}

/**
 * ColorPicker allows choosing a color using an accessible input.
 * Helpful instructions can be provided via `helpText` which is
 * connected to the input for screen readers and users who benefit
 * from clear guidance.
 */
export function ColorPicker({
  id,
  label,
  value,
  onChange,
  helpText,
}: ColorPickerProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        aria-describedby={helpId}
      />
      {helpText && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}

