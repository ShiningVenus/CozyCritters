import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemePresetOption {
  label: string;
  value: string;
  description?: string;
}

interface ThemePresetSelectorProps {
  id?: string;
  label: string;
  value: string;
  options: ThemePresetOption[];
  onChange: (value: string) => void;
  helpText?: string;
}

/**
 * ThemePresetSelector allows users to quickly switch between
 * pre-designed ND-friendly and accessible themes.
 */
export function ThemePresetSelector({
  id = "theme-preset-selector",
  label,
  value,
  options,
  onChange,
  helpText,
}: ThemePresetSelectorProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label} aria-describedby={helpId}>
          <SelectValue placeholder="Select theme preset" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                )}
              </div>
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